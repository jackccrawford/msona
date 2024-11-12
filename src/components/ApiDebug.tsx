import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface ApiStatus {
  direct: { ok: boolean; error?: string };
  proxy: { ok: boolean; error?: string };
}

export function ApiDebug() {
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [testing, setTesting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    setStatus(null);
    
    const results: ApiStatus = {
      direct: { ok: false },
      proxy: { ok: false }
    };

    // Test direct API
    try {
      const directResponse = await fetch('https://api.quotable.io/quotes/random?limit=1', {
        headers: { 'Accept': 'application/json' }
      });
      results.direct.ok = directResponse.ok;
      if (!directResponse.ok) {
        results.direct.error = `Status: ${directResponse.status}`;
      }
    } catch (error) {
      results.direct.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Test proxy
    try {
      const proxyUrl = 'https://api.allorigins.win/raw?url=' + 
        encodeURIComponent('https://api.quotable.io/quotes/random?limit=1');
      const proxyResponse = await fetch(proxyUrl);
      results.proxy.ok = proxyResponse.ok;
      if (!proxyResponse.ok) {
        results.proxy.error = `Status: ${proxyResponse.status}`;
      }
    } catch (error) {
      results.proxy.error = error instanceof Error ? error.message : 'Unknown error';
    }

    setStatus(results);
    setTesting(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          API Status
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </h3>
        <button
          onClick={testConnection}
          disabled={testing}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
        >
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      {isExpanded && status && (
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">Direct API:</span>
            {status.direct.ok ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            {status.direct.error && (
              <span className="text-red-500">{status.direct.error}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">CORS Proxy:</span>
            {status.proxy.ok ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            {status.proxy.error && (
              <span className="text-red-500">{status.proxy.error}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}