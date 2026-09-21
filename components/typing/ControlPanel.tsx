'use client';

import React, { useState } from 'react';
import {
  Clock,
  Type,
  AlignLeft,
  Target,
  FileCode,
  RotateCcw,
  RefreshCw,
  Sparkles,
  SlidersHorizontal,
  Keyboard as KeyboardIcon,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { CATEGORIES } from '@/data/sentences';
import { DifficultyLevel, PracticeMode, SentenceCategory } from '@/types/typing';
import { Button } from '../ui/Button';
import { CustomTextModal } from './CustomTextModal';

interface ControlPanelProps {
  mode: PracticeMode;
  onModeChange: (mode: PracticeMode) => void;
  difficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  category: SentenceCategory | 'all';
  onCategoryChange: (category: SentenceCategory | 'all') => void;
  durationSeconds: number;
  onDurationChange: (duration: number) => void;
  includePunctuation: boolean;
  onTogglePunctuation: (include: boolean) => void;
  includeNumbers: boolean;
  onToggleNumbers: (include: boolean) => void;
  showKeyboardGuide?: boolean;
  onToggleKeyboardGuide?: () => void;
  showPacer?: boolean;
  onTogglePacer?: () => void;
  onRestart: () => void;
  onNewPassage: () => void;
  onApplyCustomText: (text: string) => void;
  customText?: string;
}

export function ControlPanel({
  mode,
  onModeChange,
  difficulty,
  onDifficultyChange,
  category,
  onCategoryChange,
  durationSeconds,
  onDurationChange,
  includePunctuation,
  onTogglePunctuation,
  includeNumbers,
  onToggleNumbers,
  showKeyboardGuide,
  onToggleKeyboardGuide,
  showPacer,
  onTogglePacer,
  onRestart,
  onNewPassage,
  onApplyCustomText,
  customText,
}: ControlPanelProps) {
  const [customModalOpen, setCustomModalOpen] = useState(false);

  const modes: { id: PracticeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'timed', label: 'Timed', icon: Clock },
    { id: 'sentence', label: 'Sentence', icon: Type },
    { id: 'paragraph', label: 'Paragraph', icon: AlignLeft },
    { id: 'accuracy', label: 'Accuracy', icon: Target },
    { id: 'weak_keys', label: 'Weak Keys', icon: Target },
    { id: 'custom', label: 'Custom', icon: FileCode },
  ];

  const durations = [15, 30, 60, 120];

  const difficulties: { id: DifficultyLevel; label: string }[] = [
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];

  const handleModeClick = (selectedMode: PracticeMode) => {
    if (selectedMode === 'custom') {
      setCustomModalOpen(true);
    }
    onModeChange(selectedMode);
  };

  return (
    <div className="w-full space-y-3">
      {/* Primary Mode Bar & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface/80 border border-border rounded-xl p-2.5 sm:p-3 backdrop-blur-sm shadow-sm">
        {/* Practice Modes */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {modes.map(({ id, label, icon: Icon }) => {
            const isActive = mode === id;
            return (
              <button
                key={id}
                onClick={() => handleModeClick(id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all select-none shrink-0 focus-ring',
                  isActive
                    ? 'bg-primary text-background font-semibold shadow-sm'
                    : 'text-text-muted hover:text-text-main hover:bg-surface-subtle'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            );
          })}
        </div>

        {/* Timed duration selector (shown when mode is timed) */}
        {mode === 'timed' && (
          <div className="flex items-center gap-1 bg-surface-subtle border border-border/80 rounded-lg p-1">
            {durations.map((seconds) => (
              <button
                key={seconds}
                onClick={() => onDurationChange(seconds)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors focus-ring',
                  durationSeconds === seconds
                    ? 'bg-primary text-background font-bold shadow-xs'
                    : 'text-text-muted hover:text-text-main'
                )}
              >
                {seconds}s
              </button>
            ))}
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRestart}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            title="Restart current test (Tab)"
          >
            <span className="hidden sm:inline">Restart</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onNewPassage}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            title="Generate a new sentence"
          >
            <span>New Passage</span>
          </Button>
        </div>
      </div>

      {/* Secondary Customization Row (Difficulty, Category, Toggles) */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted px-1">
        {/* Difficulty Pill Selector */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-muted">Difficulty:</span>
          <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-0.5">
            {difficulties.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => onDifficultyChange(id)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium transition-colors focus-ring',
                  difficulty === id
                    ? 'bg-primary-muted text-primary font-semibold'
                    : 'text-text-muted hover:text-text-main'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-muted">Category:</span>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value as SentenceCategory | 'all')}
            className="bg-surface border border-border rounded-lg px-2.5 py-1 text-xs text-text-main focus-ring cursor-pointer hover:bg-surface-subtle"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Toggles (Punctuation, Numbers) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onTogglePunctuation(!includePunctuation)}
            className={cn(
              'px-2 py-1 rounded-md border text-xs font-medium transition-colors focus-ring',
              includePunctuation
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'bg-surface border-border text-text-subtle line-through'
            )}
          >
            Punctuation
          </button>

          <button
            type="button"
            onClick={() => onToggleNumbers(!includeNumbers)}
            className={cn(
              'px-2 py-1 rounded-md border text-xs font-medium transition-colors focus-ring',
              includeNumbers
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'bg-surface border-border text-text-subtle line-through'
            )}
          >
            Numbers
          </button>

          {onToggleKeyboardGuide && (
            <button
              type="button"
              onClick={onToggleKeyboardGuide}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium transition-colors focus-ring',
                showKeyboardGuide
                  ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
                  : 'bg-surface border-border text-text-muted hover:text-text-main'
              )}
              title="Toggle On-Screen Keyboard Guide"
            >
              <KeyboardIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keyboard</span>
            </button>
          )}

          {onTogglePacer && (
            <button
              type="button"
              onClick={onTogglePacer}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium transition-colors focus-ring',
                showPacer
                  ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
                  : 'bg-surface border-border text-text-muted hover:text-text-main'
              )}
              title="Toggle Ghost Pacer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pacer</span>
            </button>
          )}
        </div>
      </div>

      {/* Custom Text Modal */}
      <CustomTextModal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        onApplyText={onApplyCustomText}
        initialText={customText}
      />
    </div>
  );
}
