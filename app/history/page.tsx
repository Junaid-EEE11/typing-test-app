'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { HistoryTable } from '@/components/history/HistoryTable';
import { ExportControls } from '@/components/history/ExportControls';
import { Button } from '@/components/ui/Button';
import {
  clearPracticeHistory,
  DEFAULT_PREFERENCES,
  loadPracticeHistory,
  loadUserPreferences,
} from '@/lib/storage/localStorage';
import { PracticeSessionRecord, UserPreferences } from '@/types/typing';
import { Keyboard } from 'lucide-react';

export default function HistoryPage() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [history, setHistory] = useState<PracticeSessionRecord[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setPreferences(loadUserPreferences());
    setHistory(loadPracticeHistory());
  }, []);

  const handleClearHistory = () => {
    clearPracticeHistory();
    setHistory([]);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-main">
      <Navbar preferences={preferences} />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight">
              Practice History
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Complete chronological record of all your typing sessions.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <ExportControls history={history} onClearHistory={handleClearHistory} />

            <Link href="/">
              <Button variant="primary" size="sm" leftIcon={<Keyboard className="w-4 h-4" />}>
                Practice
              </Button>
            </Link>
          </div>
        </div>

        {/* History Table */}
        <HistoryTable history={history} />
      </main>

      <Footer />
    </div>
  );
}
