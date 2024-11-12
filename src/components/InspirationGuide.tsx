import React, { useState } from 'react';
import { BookOpen, Copy, CheckCircle2, Loader2, Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InspirationGuidePDF } from './InspirationGuidePDF';
import type { Theme } from '../types/Theme';
import type { Quote } from '../types/Quote';

interface InspirationGuideProps {
  quotes: Quote[];
  theme: Theme;
  isDark: boolean;
}

export function InspirationGuide({ quotes, theme, isDark }: InspirationGuideProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!quotes?.length) return null;

  const handleCopyText = async () => {
    try {
      const text = quotes.map(quote => 
        `${quote.title}\n"${quote.content}"\n- ${quote.author}\n\n`
      ).join('');

      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleDownloadStart = () => {
    setDownloading(true);
    // Reset after animation completes
    setTimeout(() => setDownloading(false), 1000);
  };

  return (
    <div className="flex items-center gap-2">
      <PDFDownloadLink
        document={
          <InspirationGuidePDF 
            quotes={quotes}
            theme={theme}
            isDark={isDark}
          />
        }
        fileName="inspiration-guide.pdf"
        onClick={handleDownloadStart}
      >
        {({ loading, error: pdfError }) => (
          <button
            className={`
              p-2 rounded-xl transition-all duration-300 relative
              ${isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }
              ${loading || pdfError ? 'cursor-wait' : 'cursor-pointer'}
              ${pdfError ? 'opacity-50' : ''}
              group
            `}
            title={pdfError ? 'Failed to generate PDF' : 'Download PDF guide'}
            disabled={loading || Boolean(pdfError)}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <BookOpen className={`w-5 h-5 transition-transform duration-300 ${downloading ? 'scale-90' : 'group-hover:scale-105'}`} />
                <Download 
                  className={`
                    w-3 h-3 absolute -bottom-1 -right-1
                    transition-all duration-300
                    ${downloading 
                      ? 'opacity-100 translate-y-3 scale-0' 
                      : 'opacity-0 translate-y-0 scale-100 group-hover:opacity-100'
                    }
                  `}
                />
              </>
            )}
          </button>
        )}
      </PDFDownloadLink>

      <button
        onClick={handleCopyText}
        className={`
          p-2 rounded-xl transition-all duration-300
          ${isDark 
            ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }
        `}
        title={copied ? 'Copied!' : 'Copy to clipboard'}
      >
        {copied ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <Copy className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}