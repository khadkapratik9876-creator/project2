export enum ImageSize {
  Size1K = '1K',
  Size2K = '2K',
  Size4K = '4K'
}

export enum VideoAspectRatio {
  Landscape = '16:9',
  Portrait = '9:16'
}

export interface GeneratedContent {
  imageUrl?: string;
  videoUrl?: string;
  prompt: string;
}

export type GenerationStatus = 'idle' | 'generating_image' | 'success_image' | 'generating_video' | 'success_video' | 'error';

// Extending AIStudio interface to support key selection methods
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}
