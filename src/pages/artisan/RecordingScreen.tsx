import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, Square, Loader2, Video, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  transcribeWithSarvamAI,
  parseProductDetails,
  type ProductDetails
} from "@/integrations/sarvam/client";

const RecordingScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // --- STATE ---
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState("");
  const [hasAudio, setHasAudio] = useState(false); // Track if audio is available
  const [capturedFrame, setCapturedFrame] = useState<Blob | null>(null); // Captured product frame

  // --- REFS ---
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. START CAMERA (Simple & Robust)
  useEffect(() => {
    let mounted = true;
    const initCamera = async () => {
      try {
        setCameraError(null);
        let stream: MediaStream | null = null;

        // Try video + audio first
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
          console.log("Successfully got audio+video stream");
        } catch (err: any) {
          console.error(
            "Failed with audio+video, trying video only:",
            err.name || err.message
          );

          // Fallback: try audio only (for speech recording, video isn't essential)
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
            });
            console.log("Got audio-only stream (video failed)");
          } catch (audioErr: any) {
            // If audio-only also fails, try video only as last resort
            try {
              stream = await navigator.mediaDevices.getUserMedia({
                video: {
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                },
              });
              console.log("Got video-only stream (audio failed)");
            } catch (videoErr: any) {
              // All failed, throw the original error
              throw err;
            }
          }
        }

        if (!mounted) {
          stream?.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        // Check if we have audio tracks - critical for transcription
        const audioTracks = stream.getAudioTracks();
        const hasAudioTracks = audioTracks.length > 0 && audioTracks.some(t => t.enabled);

        console.log(
          `Stream ready: ${audioTracks.length} audio tracks, ${stream.getVideoTracks().length} video tracks`
        );

        if (!hasAudioTracks) {
          setCameraError("Microphone Access Required");
          toast({
            variant: "destructive",
            title: "Microphone Required",
            description:
              "Microphone access is required for video transcription. Please enable microphone permissions in your browser settings.",
            duration: 6000,
          });
          setHasAudio(false);
          setIsCameraReady(true); // Show UI but disable recording
          return;
        }

        setHasAudio(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait for video to actually play before showing UI
          videoRef.current.onloadedmetadata = () => {
            if (!mounted) return;
            videoRef.current?.play().catch((e) => console.error("Play error:", e));
            setIsCameraReady(true);
          };
        }
      } catch (err: any) {
        console.error("Camera Error:", err);
        let errorMessage = "Camera access failed. Please check permissions.";
        let toastDescription =
          "Could not access camera. Please grant permissions.";

        if (err.name === "NotAllowedError") {
          errorMessage = "Permission Denied";
          toastDescription =
            "You denied camera/microphone access. Please allow it in browser settings.";
        } else if (err.name === "NotFoundError") {
          errorMessage = "No Camera/Microphone Found";
          toastDescription =
            "No camera or microphone device detected. Please check your hardware.";
        } else if (err.name === "NotReadableError") {
          errorMessage = "Camera/Microphone In Use";
          toastDescription =
            "Camera or microphone is being used by another app. Please close it.";
        }

        if (mounted) {
          setCameraError(errorMessage);
          toast({
            variant: "destructive",
            title: "Camera Failed",
            description: toastDescription,
          });
        }
      }
    };

    initCamera();

    // Cleanup
    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [toast]);

  // 2. START RECORDING (with audio-only or webm fallback)
  const startRecording = () => {
    if (!streamRef.current) return;

    // Check if audio is available
    const audioTracks = streamRef.current.getAudioTracks();
    if (audioTracks.length === 0) {
      toast({
        variant: "destructive",
        title: "Cannot Record",
        description:
          "Microphone is not available. Please check permissions and try again.",
        duration: 4000,
      });
      return;
    }

    // Ensure audio tracks are enabled
    audioTracks.forEach((track) => {
      if (!track.enabled) {
        track.enabled = true;
      }
    });

    let recordingStream = streamRef.current;

    // Check what tracks are available
    const videoTracks = streamRef.current.getVideoTracks();
    const hasVideo = videoTracks.length > 0;
    const hasAudioTracks = audioTracks.length > 0;

    if (hasAudioTracks && hasVideo) {
      try {
        // Include both audio and video if available
        recordingStream = new MediaStream([...audioTracks, ...videoTracks]);
        console.log("Using audio+video stream for recording");
      } catch (error) {
        console.warn("Could not create audio+video stream:", error);
        recordingStream = streamRef.current;
      }
    } else if (hasAudioTracks) {
      recordingStream = new MediaStream(audioTracks);
      console.log("Using audio-only stream for recording");
    }

    // Pick MIME types based on whether stream has video tracks
    // IMPORTANT: Cannot use audio/* MIME types on a stream with video tracks
    const videoMimeTypes = [
      "video/webm;codecs=vp8,opus",
      "video/webm;codecs=vp9,opus",
      "video/webm",
      "video/mp4",
    ];

    const audioMimeTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/ogg",
    ];

    // Use video types if stream has video, otherwise audio types
    const candidateTypes = hasVideo
      ? [...videoMimeTypes, ...audioMimeTypes]
      : [...audioMimeTypes, ...videoMimeTypes];

    let mimeType = "";
    for (const type of candidateTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        mimeType = type;
        break;
      }
    }

    if (!mimeType) {
      mimeType = hasVideo ? "video/webm" : "audio/webm";
      console.warn("No supported mime type found, using fallback:", mimeType);
    }

    console.log("Using mime type for MediaRecorder:", mimeType);

    try {
      const mediaRecorder = new MediaRecorder(recordingStream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event.error);
        setIsRecording(false);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      };

      mediaRecorder.onstop = async () => {
        const finalMimeType = mediaRecorder.mimeType || mimeType;
        const blob = new Blob(chunksRef.current, { type: finalMimeType });
        console.log(
          `Recording stopped, blob type: ${blob.type}, size: ${blob.size}`
        );

        // Capture a frame from the video as product thumbnail
        const frameBlob = captureVideoFrame();
        await handleUpload(blob, frameBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      setTimer(0);
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

      console.log("Recording started successfully");
    } catch (error) {
      console.error("Error creating/starting MediaRecorder:", error);
      setIsRecording(false);
      toast({
        variant: "destructive",
        title: "Recording Failed",
        description:
          error instanceof Error
            ? error.message
            : "Could not start recording. Please try again.",
      });
    }
  };

  // 3. CAPTURE VIDEO FRAME
  const captureVideoFrame = (): Blob | null => {
    try {
      const video = videoRef.current;
      if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
        console.warn("Video element not ready for frame capture");
        return null;
      }

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob synchronously via data URL
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      const byteString = atob(dataUrl.split(",")[1]);
      const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const frameBlob = new Blob([ab], { type: mimeString });
      console.log(`Captured video frame: ${frameBlob.size} bytes`);
      return frameBlob;
    } catch (error) {
      console.error("Error capturing video frame:", error);
      return null;
    }
  };

  // 4. STOP RECORDING
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  // 5. UPLOAD TO SUPABASE & TRANSCRIBE
  const handleUpload = async (videoBlob: Blob, frameBlob: Blob | null) => {
    setUploading(true);
    let videoPath = "";
    let imageUrl = "";
    try {
      const userId = user?.id || "anon_user";
      const timestamp = Date.now();
      const fileName = `${userId}/${timestamp}.mp4`;

      // Upload Video
      const { data, error } = await supabase.storage
        .from("videos")
        .upload(fileName, videoBlob, {
          contentType: "video/mp4",
        });

      if (error) throw error;

      console.log("Upload Success:", data);
      videoPath = data.path;

      // Upload captured frame as product image
      if (frameBlob) {
        setTranscriptionStatus("Uploading product image...");
        const imgFileName = `${userId}/${timestamp}_thumb.jpg`;
        const { data: imgData, error: imgError } = await supabase.storage
          .from("product_images")
          .upload(imgFileName, frameBlob, {
            contentType: "image/jpeg",
          });

        if (imgError) {
          console.warn("Image upload failed (non-critical):", imgError.message);
        } else {
          const { data: urlData } = supabase.storage
            .from("product_images")
            .getPublicUrl(imgData.path);
          imageUrl = urlData.publicUrl;
          console.log("Product image uploaded:", imageUrl);
        }
      }

      // Start Transcription
      console.log("Starting transcription with Sarvam AI...");
      setTranscribing(true);
      setTranscriptionStatus("Converting audio to English text...");

      const transcript = await transcribeWithSarvamAI(videoBlob, (status) => {
        setTranscriptionStatus(status);
      });

      console.log("Transcript:", transcript);

      // Parse transcript to extract product details
      setTranscriptionStatus("Analyzing product details...");
      const productDetails = parseProductDetails(transcript);

      // Navigate to Processing Page with transcript, image, and parsed product details
      navigate("/artisan/processing", {
        state: {
          videoPath: videoPath,
          imageUrl: imageUrl,
          transcript: transcript,
          productDetails: productDetails,
        },
      });

    } catch (error: any) {
      console.error("Upload/Transcription Failed:", error);

      let description = error.message;
      if (error.message?.includes("Bucket not found")) {
        description = "Storage bucket 'videos' not found in Supabase. Contact admin to create it.";
      } else if (error.message?.includes("Unauthorized")) {
        description = "Permission denied to upload. Check storage permissions.";
      } else if (error.message?.includes("Sarvam API key not configured")) {
        description = "Sarvam API key not configured. Please check with admin.";
      } else if (error.message?.includes("Invalid file type")) {
        description = "Audio format issue. Please try recording again with clearer speech.";
      } else if (error.message?.includes("Sarvam API error")) {
        description = "Transcription service error. Please try again or check your internet connection.";
      } else if (error.message?.includes("No transcription returned")) {
        description = "No speech detected in the recording. Please speak clearly and try again.";
      } else if (error.message?.includes("network")) {
        description = "Network error. Check your internet connection.";
      } else if (error.message?.includes("not-allowed")) {
        description = "Camera/audio access denied. Check browser permissions.";
      }

      toast({
        variant: "destructive",
        title: "Upload/Transcription Failed",
        description: description,
      });
      setUploading(false);
      setTranscribing(false);
    }
  };

  // Helper for 00:00 format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-black relative flex flex-col items-center justify-center overflow-hidden">

      {/* VIDEO PREVIEW */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isCameraReady ? "opacity-100" : "opacity-0"
          }`}
      />

      {/* LOADING STATE */}
      {!isCameraReady && !cameraError && (
        <div className="z-10 flex flex-col items-center text-white/70">
          <Loader2 className="w-10 h-10 animate-spin mb-2" />
          <p>Starting Camera...</p>
        </div>
      )}

      {/* ERROR STATE */}
      {cameraError && (
        <div className="z-10 flex flex-col items-center text-white text-center px-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <X className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-lg font-bold mb-2">
            {cameraError === "Microphone Access Required"
              ? "🎤 " + cameraError
              : cameraError}
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            {cameraError === "Microphone Access Required"
              ? "Your microphone permission is needed to transcribe your product description."
              : cameraError}
          </p>
          {cameraError === "Microphone Access Required" && (
            <div className="mb-6 text-xs text-gray-300 max-w-sm">
              <p className="mb-2">
                <strong>How to enable permissions:</strong>
              </p>
              <ul className="text-left space-y-1">
                <li>
                  🔒 Look for the lock icon in the address bar
                </li>
                <li>
                  🔊 Click and enable "Microphone" permissions
                </li>
                <li>
                  🔄 Reload the page and try again
                </li>
              </ul>
            </div>
          )}
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* UPLOADING STATE (Overlay) */}
      {uploading && (
        <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center text-white">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
          <h3 className="text-xl font-bold">
            {transcribing ? "Transcribing Audio..." : "Uploading Video..."}
          </h3>
          <p className="text-sm text-gray-400 mt-2">
            {transcriptionStatus || "Please wait while AI analyzes it."}
          </p>
        </div>
      )}

      {/* CONTROLS (Only show when ready & not uploading) */}
      {isCameraReady && !uploading && (
        <>
          {/* Top Bar: Close Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 right-6 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Timer Pill */}
          {isRecording && (
            <div className="absolute top-8 bg-red-600 px-4 py-1 rounded-full text-white font-mono font-bold animate-pulse">
              {formatTime(timer)}
            </div>
          )}

          {/* Bottom Bar: Record Button */}
          <div className="absolute bottom-10 w-full flex justify-center items-center">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!hasAudio}
              className={`transition-transform duration-200 ${!hasAudio ? "opacity-50 cursor-not-allowed" : ""
                } ${isRecording ? "scale-110" : "hover:scale-105"}`}
            >
              <div
                className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${isRecording
                  ? "border-red-500 bg-red-500/20"
                  : hasAudio
                    ? "border-white bg-transparent"
                    : "border-gray-600 bg-transparent"
                  }`}
              >
                {isRecording ? (
                  <Square className="w-8 h-8 text-red-500 fill-current" />
                ) : (
                  <div
                    className={`w-16 h-16 rounded-full ${hasAudio ? "bg-red-500" : "bg-gray-600"
                      }`}
                  />
                )}
              </div>
            </button>
          </div>

          {/* Instructions */}
          {!isRecording && (
            <div className="absolute bottom-32 bg-black/50 px-4 py-2 rounded-lg text-white text-sm backdrop-blur-sm">
              {hasAudio ? (
                "Tap the red button to record"
              ) : (
                <span className="text-yellow-300">
                  Enable microphone permission to record
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecordingScreen;