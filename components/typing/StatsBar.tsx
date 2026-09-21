'use client';

import React from 'react';
import { Gauge, Target, Timer, AlertCircle, BookOpen } from 'lucide-react';
import { formatAccuracy, formatDuration, formatWpm } from '@/lib/utils/formatters';
import { PracticeMode, TypingMetrics } from '@/types/typing';

interface StatsBarProps {
  metrics: TypingMetrics | null;
  mode: PracticeMode;
  remainingSeconds: number | null;
  elapsedSeconds: number;
  durationTargetSeconds?: number;
}

export function StatsBar({
  metrics,
  mode,
  remainingSeconds,
  elapsedSeconds,
  durationTargetSeconds,
}: StatsBarProps) {
  const currentNetWpm = metrics ? metrics.netWpm : 0;
  const currentGrossWpm = metrics ? metrics.grossWpm : 0;
  const currentAccuracy = metrics ? metrics.accuracy : 100;
  const currentErrors = metrics ? metrics.incorrectKeystrokes : 0;
  const completedWords = metrics ? metrics.completedWords : 0;
  const totalWords = metrics ? metrics.totalWords : 0;

  // Time display
  const displayTime =
    mode === 'timed' && remainingSeconds !== null
      ? formatDuration(remainingSeconds)
      : formatDuration(elapsedSeconds);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full bg-surface/90 border border-border rounded-xl p-3 sm:p-4 shadow-sm backdrop-blur-sm">
      {/* WPM */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <Gauge className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Net WPM
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-text-main flex items-baseline gap-1.5">
            <span>{formatWpm(currentNetWpm)}</span>
            {currentGrossWpm > currentNetWpm && (
              <span className="text-xs text-text-muted font-normal" title="Gross WPM">
                ({formatWpm(currentGrossWpm)} gross)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Accuracy */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Accuracy
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-text-main">
            {formatAccuracy(currentAccuracy)}
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0">
          <Timer className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {mode === 'timed' ? 'Time Left' : 'Time'}
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-text-main">
            {displayTime}
          </div>
        </div>
      </div>

      {/* Errors */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Errors
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-text-main">
            {currentErrors}
          </div>
        </div>
      </div>

      {/* Completed Words */}
      <div className="col-span-2 sm:col-span-1 flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Words
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-text-main">
            {completedWords}
            {totalWords > 0 && mode !== 'timed' && (
              <span className="text-xs text-text-muted font-normal ml-1">/{totalWords}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
