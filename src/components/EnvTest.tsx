import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { logger, LogLevel } from '../services/logService';

export function EnvTest() {
  const [elevenlabs, setElevenlabs] = useState<boolean | null>(null);
  const [grok, setGrok] = useState<boolean | null>(null);

  useEffect(() => {
    // Test ElevenLabs API
    fetch('/api/speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: 'Test', 
        voiceId: 'pNInz6obpgDQGcFmaJgB'
      })
    })
    .then(res => {
      setElevenlabs(res.ok);
      logger.log(LogLevel.INFO, 'EnvTest', 'ElevenLabs test completed', {
        status: res.status,
        ok: res.ok
      });
    })
    .catch(error => {
      setElevenlabs(false);
      logger.log(LogLevel.ERROR, 'EnvTest', 'ElevenLabs test failed', { error });
    });

    // Test Grok API
    fetch('/api/transform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Test' })
    })
    .then(res => {
      setGrok(res.ok);
      logger.log(LogLevel.INFO, 'EnvTest', 'Grok test completed', {
        status: res.status,
        ok: res.ok
      });
    })
    .catch(error => {
      setGrok(false);
      logger.log(LogLevel.ERROR, 'EnvTest', 'Grok test failed', { error });
    });
  }, []);

  return (
    <div className="fixed bottom-4 left-4 p-3 bg-black/80 text-white rounded-lg text-xs font-mono space-y-1.5 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span>ElevenLabs:</span>
        {elevenlabs === null ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : elevenlabs ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
        ) : (
          <XCircle className="w-3.5 h-3.5 text-red-400" />
        )}
      </div>
      <div className="flex items-center gap-2">
        <span>Grok:</span>
        {grok === null ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : grok ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
        ) : (
          <XCircle className="w-3.5 h-3.5 text-red-400" />
        )}
      </div>
    </div>
  );
}