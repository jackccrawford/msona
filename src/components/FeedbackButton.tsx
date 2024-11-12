import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, X } from 'lucide-react';
import { feedbackConfig, feedbackQuestions } from '../config/feedback';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Theme } from '../types/Theme';

interface FeedbackButtonProps {
  theme: Theme;
  isDark: boolean;
}

export function FeedbackButton({ theme, isDark }: FeedbackButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastPrompt, setLastPrompt] = useLocalStorage('lastFeedbackPrompt', 0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    const now = Date.now();
    const showAfterCooldown = now - lastPrompt > feedbackConfig.cooldown * 3600000;

    if (feedbackConfig.enabled && showAfterCooldown) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, feedbackConfig.delay);

      return () => clearTimeout(timer);
    }
  }, [lastPrompt]);

  const handleSubmit = async () => {
    try {
      // Send feedback to your backend
      console.log('Feedback submitted:', answers);
      
      setLastPrompt(Date.now());
      setIsOpen(false);
      setIsVisible(false);
      setCurrentQuestion(0);
      setAnswers({});
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  if (!isVisible) return null;

  const currentQ = feedbackQuestions[currentQuestion];

  return (
    <div className={`
      fixed ${feedbackConfig.position.replace('-', ' ')} m-4 z-50
      ${isOpen ? 'w-80' : 'w-auto'}
    `}>
      {isOpen ? (
        <div className={`
          bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4
          animate-slideUp
        `}>
          <div className="flex justify-between items-start mb-4">
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Help us improve
            </h3>
            <button
              onClick={() => {
                setIsOpen(false);
                setLastPrompt(Date.now());
              }}
              className={`
                p-1 rounded-lg transition-colors
                ${isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-4">
            <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {currentQ.text}
            </p>

            {currentQ.type === 'rating' && (
              <div className="flex gap-2">
                {Array.from({ length: currentQ.scale }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAnswers(prev => ({ ...prev, [currentQ.id]: i + 1 }));
                      if (currentQuestion < feedbackQuestions.length - 1) {
                        setCurrentQuestion(prev => prev + 1);
                      }
                    }}
                    className={`
                      w-8 h-8 rounded-full font-medium
                      transition-all duration-300
                      ${answers[currentQ.id] === i + 1
                        ? isDark
                          ? 'bg-white text-gray-900'
                          : `bg-gray-900 text-white`
                        : isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}

            {currentQ.type === 'multiselect' && (
              <div className="space-y-2">
                {currentQ.options.map(option => (
                  <label
                    key={option}
                    className={`
                      flex items-center gap-2 p-2 rounded-lg cursor-pointer
                      ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={answers[currentQ.id]?.includes(option)}
                      onChange={(e) => {
                        const current = answers[currentQ.id] || [];
                        setAnswers(prev => ({
                          ...prev,
                          [currentQ.id]: e.target.checked
                            ? [...current, option]
                            : current.filter((o: string) => o !== option)
                        }));
                      }}
                      className="rounded text-gray-900 dark:text-white"
                    />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {currentQ.type === 'text' && (
              <textarea
                value={answers[currentQ.id] || ''}
                onChange={(e) => setAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                placeholder={currentQ.placeholder}
                className={`
                  w-full p-2 rounded-lg resize-none
                  ${isDark 
                    ? 'bg-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                  }
                  focus:outline-none focus:ring-2
                  ${isDark ? 'focus:ring-white/20' : `focus:ring-${theme.accent}/20`}
                `}
                rows={4}
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            {currentQuestion < feedbackQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                className={`
                  px-4 py-2 rounded-lg font-medium
                  transition-all duration-300
                  ${isDark
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : `bg-gray-900 text-white hover:bg-gray-800`
                  }
                `}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className={`
                  px-4 py-2 rounded-lg font-medium
                  transition-all duration-300
                  ${isDark
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : `bg-gray-900 text-white hover:bg-gray-800`
                  }
                `}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg
            transition-all duration-300
            ${isDark
              ? 'bg-white text-gray-900 hover:bg-gray-100'
              : `bg-gray-900 text-white hover:bg-gray-800`
            }
            animate-slideUp
          `}
        >
          <MessageSquarePlus className="w-5 h-5" />
          <span className="font-medium">Feedback</span>
        </button>
      )}
    </div>
  );
}