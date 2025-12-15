import { GoogleGenAI } from "@google/genai";
import { ImageSize, VideoAspectRatio } from "../types";

// Helper to get fresh AI instance with current key
const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateLogoImage = async (prompt: string, size: ImageSize): Promise<string> => {
  const ai = getAI();
  
  // Using gemini-3-pro-image-preview as requested for high quality logo generation
  // "Generate images with Nano Banana Pro" -> gemini-3-pro-image-preview
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          text: `Design a professional, high-quality vector-style logo for a company. Description: ${prompt}. The logo should be clean, memorable, and suitable for branding.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1", // Logos are best as squares
        imageSize: size
      },
    },
  });

  // Extract image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const base64EncodeString = part.inlineData.data;
      return `data:image/png;base64,${base64EncodeString}`;
    }
  }

  throw new Error("No image data found in response");
};

export const generateLogoAnimation = async (
  imageBase64: string, 
  prompt: string, 
  aspectRatio: VideoAspectRatio
): Promise<string> => {
  const ai = getAI();

  // Strip prefix if present for API call
  const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

  // "Animate images with Veo" -> veo-3.1-fast-generate-preview
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Animate this logo cinematically. ${prompt}`,
    image: {
      imageBytes: cleanBase64,
      mimeType: 'image/png',
    },
    config: {
      numberOfVideos: 1,
      resolution: '1080p', // High quality for branding
      aspectRatio: aspectRatio
    }
  });

  // Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  
  if (!downloadLink) {
    throw new Error("Video generation failed or no URI returned.");
  }

  // Fetch the actual video bytes using the API key
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!videoResponse.ok) {
     throw new Error("Failed to download generated video.");
  }
  
  const videoBlob = await videoResponse.blob();
  return URL.createObjectURL(videoBlob);
};

export const checkApiKey = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const promptApiKeySelection = async (): Promise<void> => {
  if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
  } else {
    console.warn("AI Studio host bindings not found.");
  }
};