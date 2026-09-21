'use client';

import React from 'react';
import { Sparkles, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface GhostPacerProps {
  cursorIndex: number;
  totalLength: number;
  elapsedSeconds: number;
  currentNetWpm: number;
  targetWpm: number;
  status: string;
}

export function GhostPacer({
  cursorIndex,
  totalLength,
  elapsedSeconds,
  currentNetWpm,
  targetWpm,
  status,
}: GhostPacerProps) {
  if (totalLength === 0 || status === 'idle') return null;

  // User progress percentage
  const userProgress = Math.min(100, Math.round((cursorIndex / totalLength) * 100));

  // Ghost progress based on target WPM (5 chars = 1 word)
  // expectedChars = elapsedMinutes * targetWpm * 5
  const elapsedMinutes = elapsedSeconds / 60;
  const expectedCharsAtTarget = elapsedMinutes * targetWpm * 5;
  const ghostProgress = Math.min(
    100,
    Math.round((expectedCharsAtTarget / totalLength) * 100)
  );

  const wpmDelta = Math.round(currentNetWpm - targetWpm);

  return (
    <div className="w-full bg-surface/70 border border-border/70 rounded-xl p-3 shadow-xs space-y-2 backdrop-blur-xs">
      <div className="flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-1.5 font-medium">
          <Bot className="w-3.5 h-3.5 text-primary" />
          <span>Target Pacer: <strong className="text-text-main">{targetWpm} WPM</strong></span>
        </div>

        {/* Delta Status */}
        <div className="text-xs font-mono font-bold">
          {wpmDelta >= 0 ? (
            <span className="text-emerald-400">+{wpmDelta} WPM ahead</span>
          ) : (
            <span className="text-amber-400">{wpmDelta} WPM behind</span>
          )}
        </div>
      </div>

      {/* Dual Progress Track */}
      <div className="space-y-1.5">
        {/* User track */}
        <div className="relative h-2 bg-surface-subtle rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-150"
            style={{ width: `${userProgress}%` }}
          />
        </div>

        {/* Ghost target track */}
        <div className="relative h-1.5 bg-surface-subtle/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400/80 rounded-full transition-all duration-300"
            style={{ width: `${ghostProgress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-text-subtle">
        <span className="flex items-center gap-1 text-primary">
          <User className="w-3 h-3" /> You ({userProgress}%)
        </span>
        <span className="flex items-center gap-1 text-amber-400">
          <Bot className="w-3 h-3" /> Ghost ({ghostProgress}%)
        </span>
      </div>
    </div>
  );
}
