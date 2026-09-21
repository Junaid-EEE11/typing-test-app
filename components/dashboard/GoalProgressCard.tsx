import React from 'react';
import { Trophy, CheckCircle, Flame, ArrowUpRight } from 'lucide-react';
import { UserGoalStats } from '@/types/typing';

interface GoalProgressCardProps {
  currentBestNetWpm: number;
  goals: UserGoalStats;
}

export function GoalProgressCard({ currentBestNetWpm, goals }: GoalProgressCardProps) {
  const beginnerProgress = Math.min(100, Math.round((currentBestNetWpm / goals.beginnerGoal) * 100));
  const customProgress = Math.min(100, Math.round((currentBestNetWpm / goals.customGoal) * 100));

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-text-main">Typing Goal Milestones</h3>
        </div>
        <span className="text-xs text-text-muted">Target milestones</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Beginner Goal (30 WPM) */}
        <div className="bg-surface-subtle border border-border/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-text-main flex items-center gap-1.5">
                <span>Beginner Mastery ({goals.beginnerGoal} WPM)</span>
                {goals.achievedBeginnerGoal && (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Foundation speed for smooth everyday typing
              </p>
            </div>
            <span className="font-mono text-sm font-bold text-primary">
              {beginnerProgress}%
            </span>
          </div>

          <div className="w-full bg-surface rounded-full h-2.5 overflow-hidden border border-border/40">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                beginnerProgress >= 100 ? 'bg-emerald-500' : 'bg-primary'
              }`}
              style={{ width: `${beginnerProgress}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-text-muted">
            <span>Best: {currentBestNetWpm} WPM</span>
            <span>Target: {goals.beginnerGoal} WPM</span>
          </div>
        </div>

        {/* Custom Goal */}
        <div className="bg-surface-subtle border border-border/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-text-main flex items-center gap-1.5">
                <span>Custom Target ({goals.customGoal} WPM)</span>
                {goals.achievedCustomGoal && (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Personalized typing speed objective
              </p>
            </div>
            <span className="font-mono text-sm font-bold text-emerald-400">
              {customProgress}%
            </span>
          </div>

          <div className="w-full bg-surface rounded-full h-2.5 overflow-hidden border border-border/40">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                customProgress >= 100 ? 'bg-emerald-500' : 'bg-emerald-400'
              }`}
              style={{ width: `${customProgress}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-text-muted">
            <span>Best: {currentBestNetWpm} WPM</span>
            <span>Target: {goals.customGoal} WPM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
