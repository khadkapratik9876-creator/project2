import React from 'react';
import { Button } from './Button';
import { promptApiKeySelection } from '../services/geminiService';

interface ApiKeyModalProps {
  onSuccess: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSuccess }) => {
  const handleConnect = async () => {
    try {
      await promptApiKeySelection();
      // Assume success if no error thrown, calling parent callback to re-verify
      onSuccess();
    } catch (e) {
      console.error("Failed to select key", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="mb-6 bg-indigo-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 9.636a1.003 1.003 0 00-.464 0l-.999.999a1.003 1.003 0 000 1.414l2.121 2.121a1.003 1.003 0 001.414 0l.999-.999a1.003 1.003 0 000-.464l1.936-.536a6 6 0 00-1.743-7.743 6 6 0 00-3.536-1.157 2 2 0 00-1.787 1.026z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Connect Google AI</h2>
        <p className="text-slate-400 mb-8">
          To generate professional logos and videos with Veo & Gemini 3 Pro, you need to connect your paid Google Cloud Project.
        </p>
        
        <div className="space-y-4">
          <Button onClick={handleConnect} className="w-full">
            Select API Key
          </Button>
          <p className="text-xs text-slate-500">
            Learn more about billing at <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">Google AI Docs</a>
          </p>
        </div>
      </div>
    </div>
  );
};