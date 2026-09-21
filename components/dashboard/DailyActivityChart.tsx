'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Calendar, BarChart2 } from 'lucide-react';

interface DailyActivityChartProps {
  data: { date: string; minutes: number; sessions: number }[];
}

export function DailyActivityChart({ data }: DailyActivityChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center justify-center min-h-[260px] text-center">
        <BarChart2 className="w-10 h-10 text-text-subtle mb-2" />
        <p className="text-sm font-semibold text-text-main">No daily activity recorded</p>
        <p className="text-xs text-text-muted mt-1">
          Practice daily to build a strong typing habit and track daily practice minutes.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-text-main">Daily Practice (Minutes)</h3>
        </div>
        <span className="text-xs text-text-muted">Total active minutes</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
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
            <Bar dataKey="minutes" name="Practice Minutes" fill="#818CF8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
