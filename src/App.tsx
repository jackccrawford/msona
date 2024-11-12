import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LuminaryApp } from './apps/luminary/LuminaryApp';
import { MSonaApp } from './apps/msona/MSonaApp';
import { appConfig } from './config/app';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { AppMode } from './config/app';
import './index.css';

export default function App() {
  const [lastUsedApp] = useLocalStorage<AppMode>('lastUsedApp', appConfig.mode);
  const [currentApp, setCurrentApp] = useState<AppMode>(lastUsedApp);

  useEffect(() => {
    setCurrentApp(lastUsedApp);
  }, [lastUsedApp]);

  return (
    <ErrorBoundary>
      {currentApp === 'luminary' ? (
        <LuminaryApp onAppChange={setCurrentApp} />
      ) : (
        <MSonaApp onAppChange={setCurrentApp} />
      )}
    </ErrorBoundary>
  );
}