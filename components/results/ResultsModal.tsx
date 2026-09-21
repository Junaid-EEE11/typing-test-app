'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Trophy,
  RotateCcw,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Gauge,
  Target,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { PracticeSessionRecord } from '@/types/typing';
import { formatAccuracy, formatDuration, formatWpm } from '@/lib/utils/formatters';
import { generateFeedback } from '@/lib/typing/metrics';
import { Button } from '../ui/Button';

interface ResultsModalProps {
  session: PracticeSessionRecord;
  previousSession?: PracticeSessionRecord | null;
  onTryAgain: () => void;
  onNewPassage: () => void;
  onStartWeakKeyDrill?: () => void;
}

export function ResultsModal({
  session,
  previousSession,
  onTryAgain,
  onNewPassage,
  onStartWeakKeyDrill,
}: ResultsModalProps) {
  const { metrics, mode, difficulty } = session;

  // Trigger celebration confetti for great scores (accuracy >= 95% and netWpm >= 30)
  useEffect(() => {
    if (metrics.accuracy >= 95 && metrics.netWpm >= 25) {
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#38BDF8', '#22C55E', '#A855F7', '#F59E0B'],
        });
      } catch {
        // Fallback if canvas is not supported
      }
    }
  }, [metrics.accuracy, metrics.netWpm]);

  // Handle keyboard shortcut for quick next/retry
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onNewPassage();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        onTryAgain();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTryAgain, onNewPassage]);

  const feedbackMessages = generateFeedback(
    metrics,
    previousSession
      ? { netWpm: previousSession.metrics.netWpm, accuracy: previousSession.metrics.accuracy }
      : undefined
  );

  // Mistakes list sorted by frequency
  const sortedMistakes = Object.values(metrics.mistakes || {}).sort((a, b) => b.count - a.count);

  // Chart data formatting
  const chartData = metrics.samples && metrics.samples.length > 0
    ? metrics.samples.map((s) => ({
        time: `${s.time}s`,
        wpm: s.netWpm,
        rawWpm: s.wpm,
        accuracy: s.accuracy,
      }))
    : [
        { time: '0s', wpm: 0, rawWpm: 0, accuracy: 100 },
        {
          time: `${Math.round(metrics.elapsedSeconds)}s`,
          wpm: metrics.netWpm,
          rawWpm: metrics.grossWpm,
          accuracy: metrics.accuracy,
        },
      ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-scale-up">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
              {mode} practice • {difficulty}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-main mt-1 tracking-tight">
            Session Completed!
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            onClick={onTryAgain}
            leftIcon={<RotateCcw className="w-4 h-4" />}
            title="Retry this passage (Tab)"
          >
            Try Again <span className="text-xs text-text-muted ml-1">(Tab)</span>
          </Button>

          <Button
            variant="primary"
            onClick={onNewPassage}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            title="Next Passage (Enter)"
          >
            Next Passage <span className="text-xs text-background/80 ml-1">(Enter)</span>
          </Button>
        </div>
      </div>

      {/* Main Score Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Net WPM */}
        <div className="bg-surface-subtle border border-border/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-primary" />
            <span>Net Speed</span>
          </div>
          <div className="mt-2">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-primary">
              {formatWpm(metrics.netWpm)}
            </div>
            <div className="text-xs text-text-muted mt-1">
              Gross: <span className="font-mono font-medium">{formatWpm(metrics.grossWpm)} WPM</span>
            </div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-surface-subtle border border-border/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Accuracy</span>
          </div>
          <div className="mt-2">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">
              {formatAccuracy(metrics.accuracy)}
            </div>
            <div className="text-xs text-text-muted mt-1">
              Final Text: <span className="font-mono font-medium">{formatAccuracy(metrics.finalTextAccuracy)}</span>
            </div>
          </div>
        </div>

        {/* Time / Duration */}
        <div className="bg-surface-subtle border border-border/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Test Time</span>
          </div>
          <div className="mt-2">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-text-main">
              {formatDuration(metrics.elapsedSeconds)}
            </div>
            <div className="text-xs text-text-muted mt-1">
              CPM: <span className="font-mono font-medium">{Math.round(metrics.cpm)}</span>
            </div>
          </div>
        </div>

        {/* Characters & Errors */}
        <div className="bg-surface-subtle border border-border/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>Keystrokes</span>
          </div>
          <div className="mt-2">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-text-main">
              {metrics.totalKeystrokes}
            </div>
            <div className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
              <span className="text-emerald-400">{metrics.correctKeystrokes} ok</span>
              <span>•</span>
              <span className="text-red-400">{metrics.incorrectKeystrokes} err ({metrics.correctedErrors} fixed)</span>
            </div>
          </div>
        </div>
      </div>

      {/* WPM Progression Chart */}
      <div className="bg-surface-subtle border border-border/80 rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-text-main">Speed Over Time (WPM)</h3>
          </div>
          <span className="text-xs text-text-muted">Actual 1-second sample points</span>
        </div>

        <div className="h-44 sm:h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: '#F8FAFC',
                }}
              />
              <Line
                type="monotone"
                dataKey="wpm"
                name="Net WPM"
                stroke="#38BDF8"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#38BDF8' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="rawWpm"
                name="Gross WPM"
                stroke="#94A3B8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mistake Breakdown & Feedback Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mistake Breakdown */}
        <div className="bg-surface-subtle border border-border/80 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-text-main">Mistake Breakdown</h3>
          </div>

          {sortedMistakes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {sortedMistakes.slice(0, 6).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-red-500/20 text-xs font-mono"
                >
                  <span className="text-emerald-400 font-bold">{item.expected === ' ' ? '␣' : item.expected}</span>
                  <span className="text-text-muted">→</span>
                  <span className="text-red-400 font-bold">{item.typed === ' ' ? '␣' : item.typed}</span>
                  <span className="text-[10px] text-text-muted ml-1 bg-red-500/10 px-1.5 py-0.2 rounded-full">
                    ×{item.count}
                  </span>
                </div>
              ))}

              {onStartWeakKeyDrill && (
                <div className="w-full pt-2">
                  <button
                    onClick={onStartWeakKeyDrill}
                    className="w-full py-1.5 px-3 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Practice Weak Keys Drill</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-text-muted italic flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Perfect typing! Zero mistakes registered.
            </p>
          )}
        </div>

        {/* Practical Feedback */}
        <div className="bg-surface-subtle border border-border/80 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-text-main">Coaching Feedback</h3>
          </div>

          <div className="space-y-2">
            {feedbackMessages.map((msg, idx) => (
              <p key={idx} className="text-xs text-text-muted leading-relaxed">
                {msg}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Navigation Link */}
      <div className="flex items-center justify-between pt-2 text-xs text-text-muted">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-primary hover:underline font-medium"
        >
          <BarChart3 className="w-4 h-4" />
          <span>View Detailed Progress Dashboard</span>
        </Link>

        <span>Saved locally to your device</span>
      </div>
    </div>
  );
}
