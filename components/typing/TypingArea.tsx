'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import { TestStatus } from '@/types/typing';
import { AlertCircle, MousePointerClick } from 'lucide-react';

interface TypingAreaProps {
  expectedText: string;
  typedText: string;
  cursorIndex: number;
  status: TestStatus;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  onKeyInput: (char: string) => void;
  onBackspace: () => void;
  onRestart?: () => void;
}

export function TypingArea({
  expectedText,
  typedText,
  cursorIndex,
  status,
  fontSize = 'lg',
  onKeyInput,
  onBackspace,
  onRestart,
}: TypingAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const [isFocused, setIsFocused] = useState(true);
  const [isComposing, setIsComposing] = useState(false);

  // Focus input automatically on mount or restart
  useEffect(() => {
    inputRef.current?.focus();
  }, [expectedText]);

  // Keep active cursor line scrolled into view smoothly
  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const activeEl = activeCharRef.current;
      const container = containerRef.current;
      const activeTop = activeEl.offsetTop;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      // If active character is below mid-point of container, scroll container
      if (activeTop - containerScrollTop > containerHeight * 0.6) {
        container.scrollTo({
          top: activeTop - containerHeight * 0.4,
          behavior: 'smooth',
        });
      } else if (activeTop < containerScrollTop) {
        container.scrollTo({
          top: Math.max(0, activeTop - 20),
          behavior: 'smooth',
        });
      }
    }
  }, [cursorIndex]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
    setIsFocused(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (status === 'completed' || isComposing) {
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      onBackspace();
      return;
    }

    // Handle normal single character keys
    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      onKeyInput(e.key);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    // Fallback for mobile / IME keyboards
    if (isComposing) return;
    const target = e.currentTarget;
    const val = target.value;
    if (val.length > 0) {
      const char = val.slice(-1);
      onKeyInput(char);
      target.value = '';
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    // Programmatic text paste is explicitly forbidden
  };

  // Font size classes
  const fontSizes = {
    sm: 'text-base sm:text-lg leading-relaxed',
    md: 'text-lg sm:text-xl leading-relaxed',
    lg: 'text-xl sm:text-2xl leading-loose',
    xl: 'text-2xl sm:text-3xl leading-loose',
  };

  // Pre-render characters array with visual state
  const renderedCharacters = useMemo(() => {
    const chars: React.ReactNode[] = [];
    const totalLen = Math.max(expectedText.length, typedText.length);

    for (let i = 0; i < totalLen; i++) {
      const isCursor = i === cursorIndex;
      const expectedChar = expectedText[i] || '';
      const typedChar = typedText[i];
      const isTyped = i < typedText.length;

      let charStateClass = 'text-char-pending';
      let displayChar = expectedChar;

      if (isTyped) {
        if (typedChar === expectedChar) {
          charStateClass = 'text-char-correct';
        } else {
          charStateClass = 'text-char-incorrect bg-red-500/15 rounded-sm';
          // If typed an extra character past expected length
          if (!expectedChar) {
            displayChar = typedChar;
            charStateClass = 'text-char-incorrectExtra bg-red-500/25 rounded-sm';
          }
        }
      }

      chars.push(
        <span
          key={i}
          ref={isCursor ? activeCharRef : null}
          className={cn(
            'transition-colors duration-75 relative inline-block',
            charStateClass,
            isCursor && 'caret-cursor text-char-active'
          )}
        >
          {displayChar === ' ' ? '\u00A0' : displayChar}
        </span>
      );
    }

    // Trailing cursor if at the very end
    if (cursorIndex >= totalLen) {
      chars.push(
        <span
          key="end-cursor"
          ref={activeCharRef}
          className="caret-cursor text-char-active inline-block"
        >
          &nbsp;
        </span>
      );
    }

    return chars;
  }, [expectedText, typedText, cursorIndex]);

  return (
    <div
      onClick={handleContainerClick}
      className={cn(
        'relative w-full rounded-2xl border bg-surface/70 backdrop-blur-md p-6 sm:p-8 cursor-text transition-all duration-200 shadow-lg min-h-[220px] max-h-[360px] flex flex-col justify-center overflow-hidden',
        isFocused ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border opacity-90'
      )}
    >
      {/* Hidden real accessible text input */}
      <input
        ref={inputRef}
        id="typing-real-input"
        type="text"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        value=""
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onPaste={handlePaste}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        aria-label="Typing Practice Input"
        className="absolute inset-0 opacity-0 cursor-text pointer-events-auto h-full w-full z-10"
      />

      {/* Focus reminder overlay if user clicked away */}
      {!isFocused && status !== 'completed' && (
        <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-20 flex items-center justify-center gap-2 text-text-muted font-medium pointer-events-none animate-fade-in">
          <MousePointerClick className="w-5 h-5 text-primary animate-bounce" />
          <span>Click here or start typing to focus</span>
        </div>
      )}

      {/* Main scrolling text container */}
      <div
        ref={containerRef}
        className={cn(
          'w-full font-mono tracking-wide select-none overflow-y-auto max-h-[280px] pr-2 break-words',
          fontSizes[fontSize]
        )}
      >
        {renderedCharacters}
      </div>

      {/* Idle starter guidance badge */}
      {status === 'idle' && (
        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-text-muted select-none">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Start typing anytime — the timer starts on your first keypress
          </span>
          <span className="hidden sm:inline-block">
            Press <kbd className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border font-mono text-[10px]">Tab</kbd> to restart
          </span>
        </div>
      )}
    </div>
  );
}
