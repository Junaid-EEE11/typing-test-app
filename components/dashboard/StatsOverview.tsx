import React from 'react';
import { Gauge, Trophy, Target, Clock, Flame, CheckSquare } from 'lucide-react';
import { AggregatedDashboardStats } from '@/lib/storage/localStorage';
import { formatAccuracy, formatTotalPracticeTime, formatWpm } from '@/lib/utils/formatters';

interface StatsOverviewProps {
  stats: AggregatedDashboardStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const cards = [
    {
      label: 'Average Net WPM',
      value: `${formatWpm(stats.averageNetWpm)} WPM`,
      subtext: `Gross: ${formatWpm(stats.averageGrossWpm)} WPM`,
      icon: Gauge,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Personal Best',
      value: `${formatWpm(stats.personalBestNetWpm)} WPM`,
      subtext: 'Highest Net WPM achieved',
      icon: Trophy,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
    },
    {
      label: 'Average Accuracy',
      value: formatAccuracy(stats.averageAccuracy),
      subtext: 'Keystroke precision',
      icon: Target,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
    },
    {
      label: 'Total Practice Time',
      value: formatTotalPracticeTime(stats.totalPracticeSeconds),
      subtext: 'Active typing duration',
      icon: Clock,
      color: 'text-sky-400',
      bgColor: 'bg-sky-400/10',
    },
    {
      label: 'Sessions Completed',
      value: stats.completedSessionsCount.toString(),
      subtext: 'Total test runs',
      icon: CheckSquare,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-400/10',
    },
    {
      label: 'Practice Streak',
      value: `${stats.streakDays} ${stats.streakDays === 1 ? 'day' : 'days'}`,
      subtext: stats.streakDays > 0 ? 'Consecutive daily practice' : 'Start your streak today!',
      icon: Flame,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-surface border border-border rounded-xl p-5 shadow-sm flex items-start gap-4 hover:border-border/80 transition-colors"
          >
            <div className={`w-12 h-12 rounded-xl ${card.bgColor} ${card.color} flex items-center justify-center shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                {card.label}
              </div>
              <div className="text-2xl font-extrabold font-mono text-text-main mt-0.5">
                {card.value}
              </div>
              <div className="text-xs text-text-muted mt-1">{card.subtext}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
