import React, { useState } from 'react';
import { Heart, Share2, Copy, CheckCircle2, Wand2, Volume2, ChevronUp, ChevronDown, SendHorizontal } from 'lucide-react';
import { generateAIResponse } from '../services/aiService';
import { aiConfig } from '../config/ai';
import { AudioButton } from './AudioButton';
import type { Quote } from '../types/Quote';
import type { Theme } from '../types/Theme';

interface QuoteCardProps {
  quote: Quote;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
  isNew?: boolean;
  selectedVoice: string;
  theme: Theme;
  isDark: boolean;
  transformedQuotes: Record<string, string>;
  onTransformSuccess?: (quoteId: string, text: string) => void;
}

export function QuoteCard({ 
  quote, 
  isLiked, 
  onToggleLike, 
  isNew, 
  selectedVoice,
  theme,
  isDark,
  transformedQuotes,
  onTransformSuccess
}: QuoteCardProps) {
  const [copied, setCopied] = useState(false);
  const [transformedCopied, setTransformedCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [transformPrompt, setTransformPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTransform, setShowTransform] = useState(true);
  const [currentStyle, setCurrentStyle] = useState<string>('');
  const [lastUsedPrompt, setLastUsedPrompt] = useState<string>('');
  const [transformedText, setTransformedText] = useState<string>('');
  const isMonochrome = theme.id === 'monochrome';

  const handleShare = async (text: string, setCopiedState: (copied: boolean) => void) => {
    try {
      if (navigator.share && window.innerWidth <= 768) {
        await navigator.share({
          title: 'Share Quote',
          text: text
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCopiedState(true);
        setTimeout(() => setCopiedState(false), 2000);
      }
    } catch (error) {
      // If sharing fails or is denied, fallback to clipboard
      try {
        await navigator.clipboard.writeText(text);
        setCopiedState(true);
        setTimeout(() => setCopiedState(false), 2000);
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError);
      }
    }
  };

  const handleTransform = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const fullPrompt = `Transform this quote: "${quote.content}" by ${quote.author}. ${prompt}. Keep the response concise and similar in length to the original quote. Do not use quotation marks in the response.`;
      const response = await generateAIResponse(fullPrompt);
      
      if (response.error) {
        setError(response.error);
      } else {
        setTransformedText(response.text);
        if (onTransformSuccess) {
          onTransformSuccess(quote.id, response.text);
        }
        setLastUsedPrompt(prompt);
        setIsExpanded(true);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to transform quote');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article 
      className={`
        relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-lg 
        transition-all duration-500
        ${isNew ? 'animate-slideDown' : ''}
        hover:shadow-xl hover:scale-105 group
      `}
      role="article"
      aria-label={`Quote by ${quote.author}`}
    >
      {isNew && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/10 via-amber-500/10 to-purple-500/10 rounded-2xl blur-xl transition-opacity duration-1000 opacity-0 group-hover:opacity-100" />
      )}

      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : theme.text}`}>
              {quote.title}
            </h2>
            {isNew && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                New
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsExpanded(true);
                const randomStyle = aiConfig.defaultStyles[
                  Math.floor(Math.random() * aiConfig.defaultStyles.length)
                ];
                setCurrentStyle(randomStyle.name);
                handleTransform(randomStyle.prompt);
              }}
              className={`
                p-2 rounded-xl transition-all duration-300
                ${isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-white/20' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }
              `}
              title="Transform with AI"
            >
              <Wand2 className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <AudioButton 
              text={quote.content}
              voiceId={selectedVoice}
              theme={theme}
              isDark={isDark}
            />

            <button
              onClick={() => handleShare(`"${quote.content}" - ${quote.author}`, setCopied)}
              className={`
                p-2 rounded-xl transition-all duration-300
                ${isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-white/20' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }
              `}
              title={copied ? 'Copied!' : 'Share quote'}
            >
              {copied ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => onToggleLike(quote.id)}
              className={`
                p-2 rounded-xl transition-all duration-300
                ${isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-white/20' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }
              `}
              title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-5 h-5 transition-colors duration-300 ${
                  isLiked 
                    ? isDark
                      ? isMonochrome
                        ? 'fill-white text-white'
                        : 'fill-red-400 text-red-400'
                      : isMonochrome
                        ? 'fill-gray-600 text-gray-600'
                        : 'fill-red-500 text-red-500'
                    : ''
                }`}
              />
            </button>
          </div>
        </div>

        <blockquote className={`text-2xl font-light leading-relaxed mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          {quote.content}
        </blockquote>

        <footer className="text-right mb-6">
          <cite className={`font-medium not-italic ${isDark ? 'text-gray-400' : theme.accent}`}>
            — {quote.author}
          </cite>
        </footer>

        {isExpanded && (
          <div className="space-y-4">
            <div className="relative">
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
                <button
                  onClick={() => setShowTransform(!showTransform)}
                  className={`
                    p-1 rounded-full transition-colors duration-300
                    ${isDark 
                      ? 'bg-gray-800 text-gray-400 hover:text-white' 
                      : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                    }
                    transform -translate-y-1/2
                  `}
                  title={showTransform ? 'Hide transformation' : 'Show transformation'}
                >
                  {showTransform ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
              </div>

              {showTransform && (
                <>
                  {transformedText && (
                    <div className="mt-6 mb-4">
                      {lastUsedPrompt && (
                        <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {currentStyle 
                            ? `Transformed in the style of ${currentStyle}:`
                            : `Transformed with prompt: "${lastUsedPrompt}"`}
                        </p>
                      )}
                      <div className="flex justify-between items-start gap-2">
                        <p className={`text-xl flex-grow ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                          {transformedText}
                        </p>
                        <div className="flex gap-2 flex-shrink-0">
                          <AudioButton 
                            text={transformedText}
                            voiceId={selectedVoice}
                            theme={theme}
                            isDark={isDark}
                          />
                          <button
                            onClick={() => handleShare(transformedText, setTransformedCopied)}
                            className={`
                              p-2 rounded-xl transition-all duration-300
                              ${isDark 
                                ? 'text-gray-400 hover:text-white hover:bg-white/20' 
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                              }
                            `}
                            title={transformedCopied ? 'Copied!' : 'Share transformed quote'}
                          >
                            {transformedCopied ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Share2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <p className="text-red-500 dark:text-red-400 text-sm mb-4">
                      {error}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Enter your transformation prompt..."
                      value={transformPrompt}
                      onChange={(e) => setTransformPrompt(e.target.value)}
                      className={`
                        flex-1 px-4 py-2 rounded-lg text-sm
                        ${isDark 
                          ? 'bg-gray-800 text-white placeholder-gray-500 border-gray-700' 
                          : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'
                        }
                        border focus:outline-none focus:ring-2
                        ${isDark ? 'focus:ring-white/20' : `focus:ring-${theme.accent}/20`}
                      `}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && transformPrompt) {
                          handleTransform(transformPrompt);
                          setCurrentStyle('');
                          setTransformPrompt('');
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (transformPrompt) {
                          handleTransform(transformPrompt);
                          setCurrentStyle('');
                          setTransformPrompt('');
                        }
                      }}
                      disabled={isLoading}
                      className={`
                        p-2 rounded-lg transition-all duration-300
                        ${isDark 
                          ? 'text-gray-400 hover:text-white hover:bg-white/20' 
                          : `${theme.accent} hover:bg-gray-100`
                        }
                        disabled:opacity-50
                      `}
                      title="Submit transformation"
                    >
                      <SendHorizontal className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}