import React, { useState } from 'react';
import { X, Share2, CheckCircle2, Wand2 } from 'lucide-react';
import { aiConfig } from '../config/ai';
import { generateAIResponse } from '../services/aiService';
import type { Theme } from '../types/Theme';

interface AITransformModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  author: string;
  theme: Theme;
  isDark: boolean;
}

export function AITransformModal({
  isOpen,
  onClose,
  text,
  author,
  theme,
  isDark
}: AITransformModalProps) {
  const [selectedStyle, setSelectedStyle] = useState(aiConfig.defaultStyles[0]);
  const [transformedText, setTransformedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransform = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await generateAIResponse(text, author, 'rephrase', {
        style: selectedStyle.prompt
      });

      if (response.error) {
        setError(response.error);
      } else {
        setTransformedText(response.text);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to transform quote');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!transformedText) return;
    await navigator.clipboard.writeText(transformedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={`
          relative w-full max-w-lg rounded-2xl shadow-lg
          ${isDark ? 'bg-slate-900' : 'bg-white'}
          p-6 space-y-4
        `}
      >
        <div className="flex justify-between items-center">
          <h2 
            id="modal-title"
            className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Transform Quote
          </h2>
          <button
            onClick={onClose}
            className={`
              p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800
              ${isDark ? 'text-gray-400' : 'text-gray-500'}
            `}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label 
              htmlFor="style-select" 
              className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Choose a style:
            </label>
            <select
              id="style-select"
              value={selectedStyle.id}
              onChange={(e) => {
                const style = aiConfig.defaultStyles.find(s => s.id === e.target.value);
                if (style) setSelectedStyle(style);
              }}
              className={`
                mt-1 block w-full rounded-md border-gray-300 shadow-sm
                focus:border-purple-500 focus:ring-purple-500 sm:text-sm
                ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900'}
              `}
            >
              {aiConfig.defaultStyles.map(style => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Original:
            </p>
            <p className={`mt-1 text-lg ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
              "{text}" - {author}
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          {transformedText && (
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Transformed:
              </p>
              <p className={`mt-1 text-lg ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                {transformedText}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            {transformedText && (
              <button
                onClick={handleCopy}
                className={`
                  px-4 py-2 rounded-lg border transition-colors duration-300 flex items-center gap-2
                  ${isDark 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }
                `}
                aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={handleTransform}
              disabled={isLoading}
              className={`
                px-4 py-2 rounded-lg font-medium flex items-center gap-2
                transition-all duration-300
                ${isDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : `${theme.accent} hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200`
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <Wand2 className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Transforming...' : 'Transform'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}