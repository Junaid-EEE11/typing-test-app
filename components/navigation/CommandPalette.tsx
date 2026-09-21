'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Keyboard,
  BarChart3,
  History,
  Settings,
  Sun,
  Moon,
  Volume2,
  RotateCcw,
  RefreshCw,
  Target,
  Sparkles,
  Command as CommandIcon,
  X,
  Sliders,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useTheme } from '@/hooks/useTheme';
import { PracticeMode } from '@/types/typing';

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Practice Mode' | 'Actions' | 'Preferences';
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode?: (mode: PracticeMode) => void;
  onRestart?: () => void;
  onNewPassage?: () => void;
  onToggleSound?: () => void;
  onToggleKeyboardGuide?: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectMode,
  onRestart,
  onNewPassage,
  onToggleSound,
  onToggleKeyboardGuide,
}: CommandPaletteProps) {
  const router = useRouter();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-practice',
      title: 'Go to Typing Practice',
      category: 'Navigation',
      icon: Keyboard,
      action: () => {
        router.push('/');
        onClose();
      },
    },
    {
      id: 'nav-dashboard',
      title: 'Go to Performance Dashboard',
      category: 'Navigation',
      icon: BarChart3,
      action: () => {
        router.push('/dashboard');
        onClose();
      },
    },
    {
      id: 'nav-history',
      title: 'Go to Practice History',
      category: 'Navigation',
      icon: History,
      action: () => {
        router.push('/history');
        onClose();
      },
    },
    {
      id: 'nav-settings',
      title: 'Go to Preferences & Settings',
      category: 'Navigation',
      icon: Settings,
      action: () => {
        router.push('/settings');
        onClose();
      },
    },
    // Practice Modes
    {
      id: 'mode-timed',
      title: 'Switch to Timed Practice',
      category: 'Practice Mode',
      icon: Keyboard,
      action: () => {
        onSelectMode?.('timed');
        onClose();
      },
    },
    {
      id: 'mode-sentence',
      title: 'Switch to Sentence Practice',
      category: 'Practice Mode',
      icon: Keyboard,
      action: () => {
        onSelectMode?.('sentence');
        onClose();
      },
    },
    {
      id: 'mode-paragraph',
      title: 'Switch to Paragraph Practice',
      category: 'Practice Mode',
      icon: Keyboard,
      action: () => {
        onSelectMode?.('paragraph');
        onClose();
      },
    },
    {
      id: 'mode-weak-keys',
      title: 'Start Weak Keys Targeted Drill',
      category: 'Practice Mode',
      icon: Target,
      action: () => {
        onSelectMode?.('weak_keys');
        onClose();
      },
    },
    // Actions
    {
      id: 'action-restart',
      title: 'Restart Current Test',
      category: 'Actions',
      icon: RotateCcw,
      shortcut: 'Tab',
      action: () => {
        onRestart?.();
        onClose();
      },
    },
    {
      id: 'action-new-passage',
      title: 'Generate New Passage',
      category: 'Actions',
      icon: RefreshCw,
      action: () => {
        onNewPassage?.();
        onClose();
      },
    },
    {
      id: 'pref-theme',
      title: `Toggle Theme (${resolvedTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark'})`,
      category: 'Preferences',
      icon: resolvedTheme === 'dark' ? Sun : Moon,
      action: () => {
        toggleTheme();
        onClose();
      },
    },
    {
      id: 'pref-sound',
      title: 'Toggle Typing Sound Effects',
      category: 'Preferences',
      icon: Volume2,
      action: () => {
        onToggleSound?.();
        onClose();
      },
    },
    {
      id: 'pref-keyboard',
      title: 'Toggle On-Screen Keyboard Guide',
      category: 'Preferences',
      icon: Sliders,
      action: () => {
        onToggleKeyboardGuide?.();
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, filteredCommands.length - 1) : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search className="w-5 h-5 text-text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-text-main placeholder-text-muted focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-surface-subtle border border-border text-[10px] font-mono text-text-muted">
            Esc
          </kbd>
        </div>

        {/* Commands List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs transition-colors',
                    isSelected
                      ? 'bg-primary text-background font-semibold'
                      : 'text-text-main hover:bg-surface-subtle'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn('w-4 h-4', isSelected ? 'text-background' : 'text-text-muted')} />
                    <span>{cmd.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {cmd.shortcut && (
                      <kbd
                        className={cn(
                          'px-1.5 py-0.5 rounded text-[10px] font-mono',
                          isSelected
                            ? 'bg-background/20 text-background'
                            : 'bg-surface-subtle border border-border text-text-muted'
                        )}
                      >
                        {cmd.shortcut}
                      </kbd>
                    )}
                    <span
                      className={cn(
                        'text-[10px]',
                        isSelected ? 'text-background/80' : 'text-text-subtle'
                      )}
                    >
                      {cmd.category}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-text-muted">
              No matching commands found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
