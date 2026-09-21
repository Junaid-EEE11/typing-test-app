'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-text-main text-center">
      <div className="max-w-md space-y-6 bg-surface border border-border p-8 rounded-2xl shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-text-main">Something went wrong</h2>
          <p className="text-sm text-text-muted">
            An unexpected error occurred while rendering this view.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button variant="primary" onClick={() => reset()} leftIcon={<RotateCcw className="w-4 h-4" />}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
