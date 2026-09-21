'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Target, BarChart2 } from 'lucide-react';

interface AccuracyProgressChartProps {
  data: { date: string; accuracy: number; finalTextAccuracy: number }[];
}

export function AccuracyProgressChart({ data }: AccuracyProgressChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center justify-center min-h-[260px] text-center">
        <BarChart2 className="w-10 h-10 text-text-subtle mb-2" />
        <p className="text-sm font-semibold text-text-main">No accuracy data yet</p>
        <p className="text-xs text-text-muted mt-1">
          Complete practice sessions to see your keystroke accuracy history.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-text-main">Accuracy Over Time (%)</h3>
        </div>
        <span className="text-xs text-text-muted">Target: &gt;95%</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[70, 100]} />
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
              dataKey="accuracy"
              name="Keystroke Accuracy %"
              stroke="#22C55E"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#22C55E' }}
            />
            <Line
              type="monotone"
              dataKey="finalTextAccuracy"
              name="Final Text Accuracy %"
              stroke="#A855F7"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
