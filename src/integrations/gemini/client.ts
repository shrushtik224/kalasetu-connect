/**
 * Hindi Audio to English Text Transcription using Gemini API
 * Directly transcribes audio from video blobs using Google's Gemini AI
 */

/**
 * Convert Blob to Base64
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Extract base64 from data:audio/...;base64,xxxxx
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Transcribe video audio using Gemini API with fallback to Web Speech API
 * Extracts audio from video blob and sends to Gemini for transcription
 * Falls back to browser Web Speech API if Gemini quota is exceeded
 */
export const transcribeVideoDirectly = async (
  videoBlob: Blob,
  onProgress?: (status: string) => void
): Promise<string> => {
  try {
    if (!videoBlob) {
      throw new Error("No video blob provided");
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    onProgress?.("Preparing audio for transcription...");

    // Convert blob to base64
    const base64Audio = await blobToBase64(videoBlob);

    onProgress?.("Sending to Gemini for transcription...");

    // Use Gemini API with vision capabilities to process the audio
    // We'll send it as audio/mp4 or audio content for transcription
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'Please transcribe the audio in this video file to text. Provide ONLY the transcribed text, nothing else. If the audio is in Hindi, transcribe it exactly as spoken without translation.',
                },
                {
                  inlineData: {
                    mimeType: "video/mp4",
                    data: base64Audio,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);

      // Check if it's a quota error and fall back to Web Speech API
      if (
        errorData.error?.message?.includes("quota") ||
        errorData.error?.message?.includes("Quota") ||
        response.status === 429
      ) {
        console.warn("Gemini quota exceeded, falling back to Web Speech API");
        onProgress?.("Gemini quota exceeded, using browser speech recognition...");
        return transcribeWithWebSpeechAPI(videoBlob, onProgress);
      }

      throw new Error(
        errorData.error?.message || "Failed to transcribe with Gemini API"
      );
    }

    const result = await response.json();
    const transcript =
      result.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!transcript) {
      throw new Error("No transcription returned from Gemini");
    }

    onProgress?.("Transcription complete!");

    console.log("Transcript from Gemini:", transcript);

    // The transcript is already in the original language/text
    // If it's in Hindi script, we can optionally translate it
    return transcript;
  } catch (error: any) {
    console.error("Transcription error:", error);
    
    // If it's a quota error or network error, try Web Speech API as fallback
    if (
      error.message?.includes("quota") ||
      error.message?.includes("Quota") ||
      error.message?.includes("Failed to fetch")
    ) {
      console.warn("Primary method failed, attempting Web Speech API fallback");
      try {
        return await transcribeWithWebSpeechAPI(videoBlob, onProgress);
      } catch (fallbackError) {
        throw error; // Throw the original error if fallback also fails
      }
    }

    throw new Error(error.message || "Failed to transcribe video");
  }
};

/**
 * Fallback: Transcribe using Web Speech API (Browser's native speech recognition)
 */
const transcribeWithWebSpeechAPI = async (
  audioBlob: Blob,
  onProgress?: (status: string) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;

    if (!SpeechRecognition) {
      return reject(
        new Error(
          "Speech Recognition not supported. Try Chrome, Edge, or Safari."
        )
      );
    }

    const recognition = new SpeechRecognition();
    let transcript = "";

    // Configure for Hindi
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "hi-IN"; // Hindi language

    recognition.onstart = () => {
      onProgress?.("Browser speech recognition started...");
      console.log("Speech recognition started");
    };

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          transcript += transcriptSegment + " ";
          onProgress?.(`Recognized: ${transcript.trim()}`);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (!transcript) {
        reject(new Error(`Speech recognition error: ${event.error}`));
      }
    };

    recognition.onend = () => {
      onProgress?.("Speech recognition completed");
      console.log("Final transcript:", transcript.trim());

      if (!transcript.trim()) {
        reject(new Error("No speech detected"));
      } else {
        resolve(transcript.trim());
      }
    };

    // Create audio URL and play for speech recognition
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio();
    audio.src = audioUrl;

    onProgress?.("Playing audio for recognition...");

    audio.play()
      .then(() => {
        recognition.start();
      })
      .catch(() => {
        // Try recognition anyway if play fails
        recognition.start();
      });

    audio.onended = () => {
      setTimeout(() => {
        recognition.stop();
      }, 500);
    };
  });
};


