import React from 'react';
import { cn } from '@/lib/utils/cn';

interface FilterControlsProps {
  filterRange: '7d' | '30d' | 'all';
  onFilterChange: (range: '7d' | '30d' | 'all') => void;
}

export function FilterControls({ filterRange, onFilterChange }: FilterControlsProps) {
  const options: { id: '7d' | '30d' | 'all'; label: string }[] = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: 'all', label: 'All Time' },
  ];

  return (
    <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
      {options.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onFilterChange(id)}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-medium transition-colors focus-ring',
            filterRange === id
              ? 'bg-primary text-background font-bold shadow-xs'
              : 'text-text-muted hover:text-text-main hover:bg-surface-subtle'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
