'use client';

import React, { useState } from 'react';
import { PracticeSessionRecord } from '@/types/typing';
import { formatAccuracy, formatDateTime, formatDuration, formatWpm } from '@/lib/utils/formatters';
import { Badge } from '../ui/Badge';
import { Search, Inbox } from 'lucide-react';

interface HistoryTableProps {
  history: PracticeSessionRecord[];
}

export function HistoryTable({ history }: HistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState<string>('all');

  const filtered = history.filter((session) => {
    if (modeFilter !== 'all' && session.mode !== modeFilter) {
      return false;
    }
    if (searchTerm.trim().length > 0) {
      const term = searchTerm.toLowerCase();
      const snippet = session.passageSnippet.toLowerCase();
      const cat = session.category.toLowerCase();
      return snippet.includes(term) || cat.includes(term);
    }
    return true;
  });

  if (history.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-surface-subtle flex items-center justify-center text-text-muted">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-text-main">No saved practice sessions</h3>
        <p className="text-sm text-text-muted max-w-sm">
          Once you complete typing tests, your full performance history will be displayed and saved locally here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden space-y-4 p-4 sm:p-5">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search snippet or category..."
            className="w-full bg-surface-subtle border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-text-main placeholder-text-muted focus-ring"
          />
        </div>

        {/* Mode Filter */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-xs text-text-muted font-medium">Mode:</span>
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="bg-surface-subtle border border-border rounded-lg px-2.5 py-1 text-xs text-text-main focus-ring cursor-pointer"
          >
            <option value="all">All Modes</option>
            <option value="timed">Timed</option>
            <option value="sentence">Sentence</option>
            <option value="paragraph">Paragraph</option>
            <option value="accuracy">Accuracy</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-text-main">
          <thead className="border-b border-border text-text-muted uppercase text-[10px] tracking-wider font-semibold">
            <tr>
              <th className="pb-3 pr-4 font-semibold">Date & Time</th>
              <th className="pb-3 px-3 font-semibold">Mode / Level</th>
              <th className="pb-3 px-3 font-semibold text-right">Net WPM</th>
              <th className="pb-3 px-3 font-semibold text-right">Gross WPM</th>
              <th className="pb-3 px-3 font-semibold text-right">Accuracy</th>
              <th className="pb-3 px-3 font-semibold text-right">Time</th>
              <th className="pb-3 px-3 font-semibold text-right">Errors</th>
              <th className="pb-3 pl-3 font-semibold">Passage Snippet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.map((session) => (
              <tr key={session.id} className="hover:bg-surface-subtle/50 transition-colors">
                <td className="py-3 pr-4 text-text-muted whitespace-nowrap">
                  {formatDateTime(session.timestamp)}
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="primary" size="sm">
                      {session.mode}
                    </Badge>
                    <span className="text-[11px] text-text-muted capitalize">
                      {session.difficulty}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-primary text-right whitespace-nowrap">
                  {formatWpm(session.metrics.netWpm)}
                </td>
                <td className="py-3 px-3 font-mono text-text-muted text-right whitespace-nowrap">
                  {formatWpm(session.metrics.grossWpm)}
                </td>
                <td className="py-3 px-3 font-mono font-bold text-emerald-400 text-right whitespace-nowrap">
                  {formatAccuracy(session.metrics.accuracy)}
                </td>
                <td className="py-3 px-3 font-mono text-text-main text-right whitespace-nowrap">
                  {formatDuration(session.metrics.elapsedSeconds)}
                </td>
                <td className="py-3 px-3 font-mono text-right whitespace-nowrap">
                  {session.metrics.incorrectKeystrokes > 0 ? (
                    <span className="text-red-400 font-semibold">
                      {session.metrics.incorrectKeystrokes}
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold">0</span>
                  )}
                </td>
                <td className="py-3 pl-3 text-text-muted truncate max-w-xs" title={session.passageSnippet}>
                  "{session.passageSnippet}"
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-text-muted pt-2 flex items-center justify-between">
        <span>Showing {filtered.length} of {history.length} sessions</span>
        <span>Stored locally on your machine</span>
      </div>
    </div>
  );
}
