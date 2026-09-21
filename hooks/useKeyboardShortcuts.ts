'use client';

import { useEffect } from 'react';

export interface ShortcutHandlers {
  onRestart?: () => void;
  onReset?: () => void;
  onFocusInput?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't hijack shortcuts if user is typing in a textarea or input outside the typing engine
      const target = e.target as HTMLElement | null;
      const isCustomTextArea = target?.tagName === 'TEXTAREA' || (target?.tagName === 'INPUT' && target.id !== 'typing-real-input');

      if (isCustomTextArea) {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        handlers.onReset?.();
        return;
      }

      if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        // Tab shortcut for quick test restart
        // If the focused element is a specific interactive modal or form, let Tab work normally
        if (target?.getAttribute('role') === 'dialog' || target?.closest('[role="dialog"]')) {
          return;
        }
        e.preventDefault();
        handlers.onRestart?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers, enabled]);
}
