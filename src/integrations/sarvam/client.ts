/**
 * Sarvam AI Speech-to-Text Translation
 * Sends audio to Sarvam AI API for transcription and English translation
 */

/**
 * Extract audio stream from MediaStream and record as audio/webm
 */
const extractAudioStream = (stream: MediaStream): Blob | null => {
  try {
    // Get audio tracks from the stream
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      console.warn("No audio tracks found in stream");
      return null;
    }

    // Create a new MediaStream with only audio tracks
    const audioStream = new MediaStream(audioTracks);
    return audioStream as any; // We'll handle this below
  } catch (error) {
    console.error("Error extracting audio stream:", error);
    return null;
  }
};

/**
 * Extract audio from video blob - tries AudioContext first, falls back to webm
 */
const extractAudioFromVideo = async (videoBlob: Blob): Promise<Blob> => {
  try {
    // If the blob is already a pure audio format, use it directly
    if (videoBlob.type.startsWith("audio/")) {
      console.log("Blob is already audio format:", videoBlob.type);
      return videoBlob;
    }

    console.log("Extracting audio from video blob type:", videoBlob.type);

    // Try to decode as audio and convert to WAV
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const arrayBuffer = await videoBlob.arrayBuffer();

    try {
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      // Convert audio buffer to wav format
      const wavBlob = await audioBufferToWav(audioBuffer);
      return wavBlob;
    } catch (decodeError) {
      console.warn(
        "Could not decode as audio, will send original blob:",
        decodeError
      );
      // If we can't decode, return the blob as-is
      // Sarvam might accept it if it's webm
      return videoBlob;
    }
  } catch (error) {
    console.error("Error extracting audio from video:", error);
    // Return the original blob
    return videoBlob;
  }
};

/**
 * Convert AudioBuffer to WAV format Blob
 */
const audioBufferToWav = (audioBuffer: AudioBuffer): Promise<Blob> => {
  return new Promise((resolve) => {
    const offlineContext = new (window.OfflineAudioContext ||
      (window as any).webkitOfflineAudioContext)(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start(0);

    offlineContext.oncomplete = (e) => {
      const wavData = audioContextToWav(e.renderedBuffer);
      resolve(new Blob([wavData], { type: "audio/wav" }));
    };

    offlineContext.startRendering();
  });
};

/**
 * Convert AudioBuffer to WAV data
 */
const audioContextToWav = (audioBuffer: AudioBuffer): ArrayBuffer => {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numberOfChannels * bytesPerSample;

  const channelDatas = Array.from(
    { length: numberOfChannels },
    (_, i) => audioBuffer.getChannelData(i)
  );
  const interleaved = interleaveChannels(channelDatas);
  const dataLength = interleaved.length * bytesPerSample;

  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, "data");
  view.setUint32(40, dataLength, true);

  // Audio data
  let offset = 44;
  const view16 = new Int16Array(buffer, offset);
  for (let i = 0; i < interleaved.length; i++) {
    view16[i] =
      interleaved[i] < 0 ? interleaved[i] * 0x8000 : interleaved[i] * 0x7fff;
  }

  return buffer;
};

/**
 * Interleave audio channels
 */
const interleaveChannels = (channels: Float32Array[]): Float32Array => {
  const length = channels[0].length;
  const result = new Float32Array(channels.length * length);
  let offset = 0;

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < channels.length; j++) {
      result[offset++] = channels[j][i];
    }
  }

  return result;
};

/**
 * Transcribe video/audio blob using Sarvam AI API
 * Sends audio to Sarvam for speech-to-text translation
 */
export const transcribeWithSarvamAI = async (
  audioBlob: Blob,
  onProgress?: (status: string) => void
): Promise<string> => {
  try {
    if (!audioBlob) {
      throw new Error("No audio blob provided");
    }

    const apiKey = import.meta.env.VITE_SARVAM_API_KEY;
    if (!apiKey) {
      throw new Error("Sarvam API key not configured");
    }

    onProgress?.("Preparing audio for Sarvam AI...");

    // Extract audio or convert to compatible format
    let finalAudioBlob = audioBlob;

    // If we have a video blob, try to extract audio
    if (audioBlob.type.includes("video")) {
      onProgress?.("Extracting audio track from video...");
      finalAudioBlob = await extractAudioFromVideo(audioBlob);
    }

    // Log what we're sending
    console.log("Sending blob to Sarvam with type:", finalAudioBlob.type);

    onProgress?.("Sending to Sarvam AI for transcription...");

    // Create FormData for Sarvam AI API
    const formData = new FormData();

    // Strip codec info from MIME type (e.g. "video/webm;codecs=vp8,opus" -> "video/webm")
    // Sarvam API only accepts clean MIME types without codec parameters
    const rawType = finalAudioBlob.type.split(";")[0].trim() || "audio/webm";
    console.log("Clean MIME type for Sarvam:", rawType);

    // Determine filename based on mime type
    let filename = "audio";
    if (rawType.includes("wav")) {
      filename = "audio.wav";
    } else if (rawType.includes("webm")) {
      filename = "audio.webm";
    } else if (rawType.includes("mp3") || rawType.includes("mpeg")) {
      filename = "audio.mp3";
    } else if (rawType.includes("ogg")) {
      filename = "audio.ogg";
    } else if (rawType.includes("aac")) {
      filename = "audio.aac";
    } else {
      filename = "audio.webm";
    }

    // Create a new blob with clean MIME type (no codec params)
    const cleanBlob = new Blob([finalAudioBlob], { type: rawType });
    formData.append("file", cleanBlob, filename);
    formData.append("prompt", "");
    formData.append("model", "saaras:v2.5");

    onProgress?.("Sending to Sarvam AI for transcription...");

    // Call Sarvam AI API
    const response = await fetch(
      "https://api.sarvam.ai/speech-to-text-translate",
      {
        method: "POST",
        headers: {
          "api-subscription-key": apiKey,
          // DO NOT set Content-Type, let browser handle it with FormData
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Sarvam API error response:", errorText);

      try {
        const errorData = JSON.parse(errorText);
        throw new Error(`Sarvam API error: ${response.status} ${errorData.error?.message || errorText}`);
      } catch {
        throw new Error(`Sarvam API error: ${response.status} ${errorText}`);
      }
    }

    const result = await response.json();
    console.log("Sarvam API response:", result);

    // Extract transcript from Sarvam response
    // Sarvam returns: { transcript?: string, text?: string, textSegments?: [...] }
    const transcript =
      result.transcript ||
      result.text ||
      result.textSegments?.[0]?.text ||
      result.result?.transcript ||
      "";

    if (!transcript) {
      throw new Error("No transcription returned from Sarvam AI");
    }

    onProgress?.("Transcription complete!");

    console.log("Transcript from Sarvam AI:", transcript);

    return transcript;
  } catch (error: any) {
    console.error("Sarvam transcription error:", error);
    throw new Error(error.message || "Failed to transcribe with Sarvam AI");
  }
};

/**
 * Parse raw transcript into product details
 * Extracts: product name, price, and description from the transcript
 */
export interface ProductDetails {
  productName: string;
  productPrice: string;
  productDescription: string;
}

export const parseProductDetails = (transcript: string): ProductDetails => {
  // Pattern matching for product information
  const productDetails: ProductDetails = {
    productName: "",
    productPrice: "",
    productDescription: "",
  };

  if (!transcript) return productDetails;

  const text = transcript.toLowerCase();

  // Extract price (look for patterns like "100 rupees", "$50", "50 rs", etc.)
  const priceMatch = transcript.match(
    /(?:rs\.?|rupee|price|cost|₹|amount)\s*[:=]?\s*([₹$]?\s*[\d,]+\.?\d*)/i
  );
  if (priceMatch) {
    productDetails.productPrice = priceMatch[1].trim();
  }

  // Find sentences that look like product names or descriptions
  // Split into sentences
  const sentences = transcript.split(/[.!?]+/).map((s) => s.trim());

  // First meaningful sentence is likely the product name
  // Last 1-3 sentences form the description
  const meaningfulSentences = sentences.filter((s) => s.length > 5);

  if (meaningfulSentences.length > 0) {
    // First sentence or part of it as product name
    const firstSentence = meaningfulSentences[0];
    const nameMatch = firstSentence.match(
      /^([^,]*(?:(?:hand[- ]?made|traditional|beautiful|ceramic|wood|cloth|bead).{0,40})?)/i
    );
    productDetails.productName = (
      nameMatch?.[1] || firstSentence.substring(0, 50)
    ).trim();
  }

  // Join all sentences as description
  productDetails.productDescription = meaningfulSentences
    .slice(0, -1)
    .join(" ");

  // If we extracted a price, and we have meaningful sentences
  // use the last few sentences as description
  if (meaningfulSentences.length > 1) {
    const descriptionParts = meaningfulSentences.filter(
      (s) =>
        !s.toLowerCase().includes(productDetails.productPrice?.toLowerCase())
    );
    productDetails.productDescription = descriptionParts.join(" ");
  }

  return productDetails;
};
