import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './components/Button';
import { ApiKeyModal } from './components/ApiKeyModal';
import { checkApiKey, generateLogoImage, generateLogoAnimation } from './services/geminiService';
import { ImageSize, VideoAspectRatio, GenerationStatus } from './types';

// Icons
const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const VideoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const WandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState<ImageSize>(ImageSize.Size1K);
  
  // Results
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  
  // Animation Form
  const [animationPrompt, setAnimationPrompt] = useState('Cinematic, spinning, lighting effects');
  const [videoAspectRatio, setVideoAspectRatio] = useState<VideoAspectRatio>(VideoAspectRatio.Landscape);

  const checkKey = useCallback(async () => {
    const has = await checkApiKey();
    setHasKey(has);
  }, []);

  useEffect(() => {
    checkKey();
  }, [checkKey]);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;
    setStatus('generating_image');
    setError(null);
    setGeneratedVideo(null); // Reset video if new image
    
    try {
      const imageUrl = await generateLogoImage(prompt, imageSize);
      setGeneratedImage(imageUrl);
      setStatus('success_image');
    } catch (err: any) {
      setError(err.message || "Failed to generate image.");
      setStatus('error');
    }
  };

  const handleAnimate = async () => {
    if (!generatedImage) return;
    setStatus('generating_video');
    setError(null);

    try {
      const videoUrl = await generateLogoAnimation(generatedImage, animationPrompt, videoAspectRatio);
      setGeneratedVideo(videoUrl);
      setStatus('success_video');
    } catch (err: any) {
      setError(err.message || "Failed to generate video.");
      setStatus('success_image'); // Revert to image success state on video failure
    }
  };

  if (!hasKey) {
    return <ApiKeyModal onSuccess={checkKey} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg">
              <WandIcon />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-white">LogoMotion</h1>
          </div>
          <div className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Powered by Gemini 3 Pro & Veo
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Creation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT COLUMN: Controls */}
          <div className="space-y-8">
            
            {/* Step 1: Design Logo */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${status === 'idle' || status === 'generating_image' ? 'bg-slate-800 border-indigo-500/30 shadow-lg shadow-indigo-500/5' : 'bg-slate-800/50 border-slate-700'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                  <ImageIcon />
                </div>
                <h2 className="text-lg font-semibold text-white">1. Design Logo</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Company Description & Style</label>
                  <textarea
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-32"
                    placeholder="e.g. A futuristic tech company called 'Nebula' with a star motif, minimal, gradient blue and purple..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={status === 'generating_image' || status === 'generating_video'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Image Resolution</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(ImageSize).map((size) => (
                      <button
                        key={size}
                        onClick={() => setImageSize(size)}
                        disabled={status === 'generating_image' || status === 'generating_video'}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          imageSize === size 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleGenerateImage} 
                  disabled={!prompt || status === 'generating_image' || status === 'generating_video'}
                  isLoading={status === 'generating_image'}
                  className="w-full"
                >
                  Generate Logo
                </Button>
              </div>
            </div>

            {/* Step 2: Animate Logo */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${generatedImage ? 'bg-slate-800 border-indigo-500/30 shadow-lg shadow-indigo-500/5' : 'bg-slate-800/30 border-slate-800 opacity-50'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${generatedImage ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-slate-500'}`}>
                  <VideoIcon />
                </div>
                <h2 className="text-lg font-semibold text-white">2. Animate with Veo</h2>
              </div>

              <div className="space-y-4">
                 <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Animation Prompt (Optional)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="Describe movement..."
                    value={animationPrompt}
                    onChange={(e) => setAnimationPrompt(e.target.value)}
                    disabled={!generatedImage || status === 'generating_video'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Video Aspect Ratio</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(VideoAspectRatio).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setVideoAspectRatio(ratio)}
                        disabled={!generatedImage || status === 'generating_video'}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          videoAspectRatio === ratio
                            ? 'bg-purple-600 text-white shadow-md' 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {ratio === VideoAspectRatio.Landscape ? 'Landscape (16:9)' : 'Portrait (9:16)'}
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleAnimate}
                  disabled={!generatedImage || status === 'generating_video'}
                  isLoading={status === 'generating_video'}
                  className="w-full"
                  variant="secondary"
                  // Override secondary styles if active
                  style={generatedImage && status !== 'generating_video' ? {
                     backgroundColor: '#9333ea', // purple-600
                     borderColor: '#9333ea',
                     color: 'white'
                  } : {}}
                >
                  {status === 'generating_video' ? 'Generating Video (this may take a minute)...' : 'Generate Video'}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Preview */}
          <div className="space-y-6">
            
            {/* Image Preview */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl relative min-h-[400px] flex flex-col">
              <div className="p-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm flex justify-between items-center">
                <h3 className="font-semibold text-slate-300">Preview</h3>
                {status === 'generating_image' && <span className="text-xs text-indigo-400 animate-pulse">Designing...</span>}
              </div>
              
              <div className="flex-1 bg-slate-900/50 flex items-center justify-center p-8 relative">
                {!generatedImage && !generatedVideo && status !== 'generating_image' && (
                  <div className="text-center text-slate-600">
                     <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4">
                       <WandIcon />
                     </div>
                     <p>Your creation will appear here</p>
                  </div>
                )}

                {status === 'generating_image' && (
                   <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-indigo-400 font-medium">Designing your logo...</p>
                      </div>
                   </div>
                )}

                {/* Show Image if available */}
                {generatedImage && (
                  <div className="relative group w-full max-w-md mx-auto">
                    <img 
                      src={generatedImage} 
                      alt="Generated Logo" 
                      className={`w-full h-auto rounded-lg shadow-2xl border border-slate-700 transition-opacity duration-500 ${status === 'generating_video' ? 'opacity-50' : 'opacity-100'}`} 
                    />
                    
                    {/* Overlay while generating video */}
                    {status === 'generating_video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="bg-slate-900/90 rounded-xl p-6 text-center shadow-2xl border border-purple-500/30">
                            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-purple-300 font-medium">Animating with Veo...</p>
                            <p className="text-xs text-slate-500 mt-2">This usually takes 1-2 minutes.</p>
                         </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Video Result */}
            {generatedVideo && (
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="p-4 border-b border-slate-700 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                   <h3 className="font-semibold text-white">Logo Animation</h3>
                </div>
                <div className="bg-black flex items-center justify-center p-4">
                  <video 
                    src={generatedVideo} 
                    controls 
                    autoPlay 
                    loop 
                    className="max-h-[500px] w-auto rounded-lg shadow-lg border border-slate-800"
                  />
                </div>
                 <div className="p-4 bg-slate-800/50 flex justify-end">
                    <a 
                      href={generatedVideo} 
                      download="logo-motion.mp4" 
                      className="text-sm font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Video
                    </a>
                 </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;