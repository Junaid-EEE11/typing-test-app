'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils/cn';

interface VirtualKeyboardProps {
  activeChar?: string;
  nextChar?: string;
  weakKeys?: { key: string; count: number }[];
  showFingerColors?: boolean;
}

type Finger =
  | 'l-pinky'
  | 'l-ring'
  | 'l-middle'
  | 'l-index'
  | 'thumb'
  | 'r-index'
  | 'r-middle'
  | 'r-ring'
  | 'r-pinky';

interface KeyConfig {
  key: string;
  shiftKey?: string;
  label: string;
  finger: Finger;
  width?: string;
  isHomeRow?: boolean;
}

const FINGER_STYLES: Record<Finger, { bg: string; text: string; border: string; name: string }> = {
  'l-pinky': {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    name: 'Left Pinky',
  },
  'l-ring': {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    name: 'Left Ring',
  },
  'l-middle': {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    name: 'Left Middle',
  },
  'l-index': {
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
    name: 'Left Index',
  },
  thumb: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/30',
    name: 'Thumb',
  },
  'r-index': {
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
    name: 'Right Index',
  },
  'r-middle': {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    name: 'Right Middle',
  },
  'r-ring': {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    name: 'Right Ring',
  },
  'r-pinky': {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    name: 'Right Pinky',
  },
};

const KEYBOARD_ROWS: KeyConfig[][] = [
  // Row 1
  [
    { key: '`', shiftKey: '~', label: '`', finger: 'l-pinky' },
    { key: '1', shiftKey: '!', label: '1', finger: 'l-pinky' },
    { key: '2', shiftKey: '@', label: '2', finger: 'l-ring' },
    { key: '3', shiftKey: '#', label: '3', finger: 'l-middle' },
    { key: '4', shiftKey: '$', label: '4', finger: 'l-index' },
    { key: '5', shiftKey: '%', label: '5', finger: 'l-index' },
    { key: '6', shiftKey: '^', label: '6', finger: 'r-index' },
    { key: '7', shiftKey: '&', label: '7', finger: 'r-index' },
    { key: '8', shiftKey: '*', label: '8', finger: 'r-middle' },
    { key: '9', shiftKey: '(', label: '9', finger: 'r-ring' },
    { key: '0', shiftKey: ')', label: '0', finger: 'r-pinky' },
    { key: '-', shiftKey: '_', label: '-', finger: 'r-pinky' },
    { key: '=', shiftKey: '+', label: '=', finger: 'r-pinky' },
    { key: 'Backspace', label: '⌫', finger: 'r-pinky', width: 'w-14' },
  ],
  // Row 2
  [
    { key: 'Tab', label: 'Tab', finger: 'l-pinky', width: 'w-12' },
    { key: 'q', shiftKey: 'Q', label: 'Q', finger: 'l-pinky' },
    { key: 'w', shiftKey: 'W', label: 'W', finger: 'l-ring' },
    { key: 'e', shiftKey: 'E', label: 'E', finger: 'l-middle' },
    { key: 'r', shiftKey: 'R', label: 'R', finger: 'l-index' },
    { key: 't', shiftKey: 'T', label: 'T', finger: 'l-index' },
    { key: 'y', shiftKey: 'Y', label: 'Y', finger: 'r-index' },
    { key: 'u', shiftKey: 'U', label: 'U', finger: 'r-index' },
    { key: 'i', shiftKey: 'I', label: 'I', finger: 'r-middle' },
    { key: 'o', shiftKey: 'O', label: 'O', finger: 'r-ring' },
    { key: 'p', shiftKey: 'P', label: 'P', finger: 'r-pinky' },
    { key: '[', shiftKey: '{', label: '[', finger: 'r-pinky' },
    { key: ']', shiftKey: '}', label: ']', finger: 'r-pinky' },
    { key: '\\', shiftKey: '|', label: '\\', finger: 'r-pinky' },
  ],
  // Row 3
  [
    { key: 'CapsLock', label: 'Caps', finger: 'l-pinky', width: 'w-14' },
    { key: 'a', shiftKey: 'A', label: 'A', finger: 'l-pinky', isHomeRow: true },
    { key: 's', shiftKey: 'S', label: 'S', finger: 'l-ring', isHomeRow: true },
    { key: 'd', shiftKey: 'D', label: 'D', finger: 'l-middle', isHomeRow: true },
    { key: 'f', shiftKey: 'F', label: 'F', finger: 'l-index', isHomeRow: true },
    { key: 'g', shiftKey: 'G', label: 'G', finger: 'l-index' },
    { key: 'h', shiftKey: 'H', label: 'H', finger: 'r-index' },
    { key: 'j', shiftKey: 'J', label: 'J', finger: 'r-index', isHomeRow: true },
    { key: 'k', shiftKey: 'K', label: 'K', finger: 'r-middle', isHomeRow: true },
    { key: 'l', shiftKey: 'L', label: 'L', finger: 'r-ring', isHomeRow: true },
    { key: ';', shiftKey: ':', label: ';', finger: 'r-pinky', isHomeRow: true },
    { key: "'", shiftKey: '"', label: "'", finger: 'r-pinky' },
    { key: 'Enter', label: 'Enter', finger: 'r-pinky', width: 'w-16' },
  ],
  // Row 4
  [
    { key: 'Shift', label: 'Shift', finger: 'l-pinky', width: 'w-16' },
    { key: 'z', shiftKey: 'Z', label: 'Z', finger: 'l-pinky' },
    { key: 'x', shiftKey: 'X', label: 'X', finger: 'l-ring' },
    { key: 'c', shiftKey: 'C', label: 'C', finger: 'l-middle' },
    { key: 'v', shiftKey: 'V', label: 'V', finger: 'l-index' },
    { key: 'b', shiftKey: 'B', label: 'B', finger: 'l-index' },
    { key: 'n', shiftKey: 'N', label: 'N', finger: 'r-index' },
    { key: 'm', shiftKey: 'M', label: 'M', finger: 'r-index' },
    { key: ',', shiftKey: '<', label: ',', finger: 'r-middle' },
    { key: '.', shiftKey: '>', label: '.', finger: 'r-ring' },
    { key: '/', shiftKey: '?', label: '/', finger: 'r-pinky' },
    { key: 'Shift', label: 'Shift', finger: 'r-pinky', width: 'w-16' },
  ],
  // Row 5
  [
    { key: ' ', label: 'Spacebar', finger: 'thumb', width: 'w-72' },
  ],
];

export function VirtualKeyboard({
  activeChar = '',
  nextChar = '',
  weakKeys = [],
  showFingerColors = true,
}: VirtualKeyboardProps) {
  const weakKeysMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of weakKeys) {
      map.set(item.key.toLowerCase(), item.count);
    }
    return map;
  }, [weakKeys]);

  // Find recommended finger for next expected character
  const nextKeyFingerInfo = useMemo(() => {
    if (!nextChar) return null;
    const target = nextChar.toLowerCase();
    for (const row of KEYBOARD_ROWS) {
      for (const config of row) {
        if (
          config.key.toLowerCase() === target ||
          config.shiftKey === nextChar ||
          (nextChar === ' ' && config.key === ' ')
        ) {
          return {
            keyLabel: config.label,
            finger: config.finger,
            fingerName: FINGER_STYLES[config.finger].name,
            isShiftNeeded: config.shiftKey === nextChar,
          };
        }
      }
    }
    return null;
  }, [nextChar]);

  const isKeyTarget = (config: KeyConfig) => {
    if (!nextChar) return false;
    if (nextChar === ' ' && config.key === ' ') return true;
    return (
      config.key.toLowerCase() === nextChar.toLowerCase() ||
      config.shiftKey === nextChar
    );
  };

  const isKeyActive = (config: KeyConfig) => {
    if (!activeChar) return false;
    if (activeChar === ' ' && config.key === ' ') return true;
    return (
      config.key.toLowerCase() === activeChar.toLowerCase() ||
      config.shiftKey === activeChar
    );
  };

  return (
    <div className="w-full bg-surface/80 border border-border rounded-xl p-4 shadow-sm backdrop-blur-sm space-y-3 select-none">
      {/* Header Guidance with Next Key & Finger Indicator */}
      <div className="flex items-center justify-between text-xs pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-muted">Next Key:</span>
          {nextChar ? (
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-primary text-background font-mono font-bold">
                {nextChar === ' ' ? '␣ Space' : nextChar}
              </span>
              {nextKeyFingerInfo && (
                <span className="text-text-muted">
                  Use: <strong className="text-primary">{nextKeyFingerInfo.fingerName}</strong>
                  {nextKeyFingerInfo.isShiftNeeded && ' (+ Shift)'}
                </span>
              )}
            </div>
          ) : (
            <span className="text-text-muted italic">Ready</span>
          )}
        </div>

        {/* Finger Legend */}
        {showFingerColors && (
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-text-muted">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Pinky
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Ring
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Middle
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-500" /> Index
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" /> Thumb
            </span>
          </div>
        )}
      </div>

      {/* Keyboard Grid */}
      <div className="flex flex-col items-center gap-1.5 overflow-x-auto py-1">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex items-center gap-1 sm:gap-1.5 justify-center">
            {row.map((config, colIdx) => {
              const isTarget = isKeyTarget(config);
              const isActive = isKeyActive(config);
              const isWeak = weakKeysMap.has(config.key.toLowerCase());
              const weakCount = weakKeysMap.get(config.key.toLowerCase()) || 0;
              const fingerStyle = FINGER_STYLES[config.finger];

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={cn(
                    'relative h-9 sm:h-10 min-w-[32px] sm:min-w-[38px] px-2 rounded-lg border text-xs sm:text-sm font-mono flex items-center justify-center transition-all duration-100',
                    config.width || 'w-8 sm:w-10',
                    // Base finger coloring vs default
                    showFingerColors && !isTarget
                      ? `${fingerStyle.bg} ${fingerStyle.border} ${fingerStyle.text}`
                      : 'bg-surface-subtle border-border/80 text-text-main',
                    // Active pressed key
                    isActive && 'scale-95 bg-primary text-background font-bold shadow-md ring-2 ring-primary',
                    // Target next key
                    isTarget && 'bg-primary text-background font-extrabold shadow-lg ring-2 ring-primary scale-105 animate-pulse',
                    // Weak key error border
                    isWeak && !isTarget && 'border-red-500/50'
                  )}
                >
                  {/* Home row tactile bump dot */}
                  {config.isHomeRow && (config.key === 'f' || config.key === 'j') && (
                    <span className="absolute bottom-1 w-2 h-0.5 rounded-full bg-current opacity-70" />
                  )}

                  {/* Key Label */}
                  <span>{config.label}</span>

                  {/* Weak key mistake badge */}
                  {isWeak && weakCount > 1 && !isTarget && (
                    <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded-full bg-red-500 text-white text-[9px] font-bold leading-none">
                      {weakCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
