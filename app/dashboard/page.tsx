'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { GoalProgressCard } from '@/components/dashboard/GoalProgressCard';
import { WpmProgressChart } from '@/components/dashboard/WpmProgressChart';
import { AccuracyProgressChart } from '@/components/dashboard/AccuracyProgressChart';
import { DailyActivityChart } from '@/components/dashboard/DailyActivityChart';
import { FilterControls } from '@/components/dashboard/FilterControls';
import { Button } from '@/components/ui/Button';
import {
  calculateDashboardAnalytics,
  DEFAULT_GOALS,
  DEFAULT_PREFERENCES,
  loadPracticeHistory,
  loadUserGoals,
  loadUserPreferences,
} from '@/lib/storage/localStorage';
import { PracticeSessionRecord, UserGoalStats, UserPreferences } from '@/types/typing';
import { extractWeakKeys } from '@/lib/typing/weakKeys';
import { Keyboard, History, Target } from 'lucide-react';

export default function DashboardPage() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [history, setHistory] = useState<PracticeSessionRecord[]>([]);
  const [goals, setGoals] = useState<UserGoalStats>(DEFAULT_GOALS);
  const [filterRange, setFilterRange] = useState<'7d' | '30d' | 'all'>('all');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setPreferences(loadUserPreferences());
    const savedHistory = loadPracticeHistory();
    setHistory(savedHistory);
    setGoals(loadUserGoals());
  }, []);

  const stats = calculateDashboardAnalytics(history, filterRange);

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

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Title & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight">
              Performance Dashboard
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Track your typing speed, accuracy progression, and daily practice habits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <FilterControls filterRange={filterRange} onFilterChange={setFilterRange} />

            <Link href="/">
              <Button variant="primary" size="sm" leftIcon={<Keyboard className="w-4 h-4" />}>
                Practice Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Summary Stats Cards */}
        <StatsOverview stats={stats} />

        {/* Weak Key Focus Recommendations */}
        {(() => {
          const weakKeys = extractWeakKeys(history, 5);
          if (weakKeys.length === 0) return null;
          return (
            <div className="bg-surface border border-border rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-text-main">
                    Targeted Weak Spot Recommendations
                  </h3>
                </div>
                <p className="text-xs text-text-muted">
                  Your most frequent typing errors occur on these keys. Practice custom drills to build muscle memory.
                </p>
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {weakKeys.map(({ key, count }) => (
                    <span
                      key={key}
                      className="px-2.5 py-1 rounded-md bg-surface-subtle border border-red-500/20 text-xs font-mono flex items-center gap-1.5"
                    >
                      <strong className="text-red-400 font-bold">{key}</strong>
                      <span className="text-[10px] text-text-subtle">({count} errors)</span>
                    </span>
                  ))}
                </div>
              </div>

              <Link href="/">
                <Button variant="secondary" size="sm" leftIcon={<Target className="w-4 h-4 text-primary" />}>
                  Practice Weak Keys Drill
                </Button>
              </Link>
            </div>
          );
        })()}

        {/* Goal Milestone Card */}
        <GoalProgressCard
          currentBestNetWpm={stats.personalBestNetWpm}
          goals={goals}
        />

        {/* Analytical Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* WPM Trend Chart */}
          <WpmProgressChart data={stats.wpmTrend} />

          {/* Accuracy Trend Chart */}
          <AccuracyProgressChart data={stats.accuracyTrend} />
        </div>

        {/* Daily Practice Activity Chart */}
        <DailyActivityChart data={stats.dailyPracticeMinutes} />

        {/* Quick Links */}
        <div className="flex items-center justify-between p-4 bg-surface-subtle border border-border/80 rounded-xl text-xs text-text-muted">
          <span>All statistics calculated strictly from your verified typing tests.</span>
          <Link href="/history" className="text-primary hover:underline font-medium flex items-center gap-1">
            <History className="w-3.5 h-3.5" />
            <span>View Full History Table</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
