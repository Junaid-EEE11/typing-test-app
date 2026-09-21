'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { TypingEngine } from '@/lib/typing/engine';
import { generatePassage } from '@/lib/typing/generator';
import { savePracticeSession } from '@/lib/storage/localStorage';
import { useSound } from './useSound';
import {
  DifficultyLevel,
  PracticeMode,
  PracticeSessionRecord,
  SentenceCategory,
  TestStatus,
  TypingMetrics,
  UserPreferences,
} from '@/types/typing';

export interface UseTypingEngineProps {
  preferences: UserPreferences;
  history?: PracticeSessionRecord[];
  onSessionComplete?: (session: PracticeSessionRecord) => void;
}

export function useTypingEngine({ preferences, history, onSessionComplete }: UseTypingEngineProps) {
  const [mode, setMode] = useState<PracticeMode>(preferences.defaultMode || 'timed');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(
    preferences.defaultDifficulty || 'beginner'
  );
  const [category, setCategory] = useState<SentenceCategory | 'all'>(
    preferences.defaultCategory || 'all'
  );
  const [durationSeconds, setDurationSeconds] = useState<number>(
    preferences.defaultDuration || 30
  );
  const [includePunctuation, setIncludePunctuation] = useState<boolean>(
    preferences.includePunctuation ?? true
  );
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(
    preferences.includeNumbers ?? true
  );
  const [customText, setCustomText] = useState<string>('');

  const [status, setStatus] = useState<TestStatus>('idle');
  const [expectedText, setExpectedText] = useState<string>('');
  const [typedText, setTypedText] = useState<string>('');
  const [lastTypedChar, setLastTypedChar] = useState<string>('');
  const [metrics, setMetrics] = useState<TypingMetrics | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(
    mode === 'timed' ? durationSeconds : null
  );
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [activeSession, setActiveSession] = useState<PracticeSessionRecord | null>(null);

  const { playKey, playComplete } = useSound(preferences);
  const engineRef = useRef<TypingEngine | null>(null);
  const recentIdsRef = useRef<string[]>([]);

  // Initialize passage and engine
  const initEngineWithPassage = useCallback(
    (newText?: string) => {
      let text = newText;
      if (!text) {
        const generated = generatePassage({
          mode,
          difficulty,
          category,
          includePunctuation,
          includeNumbers,
          customText: mode === 'custom' ? customText : undefined,
          excludeIds: recentIdsRef.current,
          history,
        });
        text = generated.text;
        recentIdsRef.current = [...recentIdsRef.current.slice(-10), ...generated.sentenceIds];
      }

      setExpectedText(text);
      setTypedText('');
      setStatus('idle');
      setRemainingSeconds(mode === 'timed' ? durationSeconds : null);
      setElapsedSeconds(0);
      setActiveSession(null);

      if (engineRef.current) {
        engineRef.current.destroy();
      }

      const engine = new TypingEngine({
        initialText: text,
        mode,
        difficulty,
        category,
        durationSeconds: mode === 'timed' ? durationSeconds : undefined,
        includePunctuation,
        includeNumbers,
        onStatusChange: (newStatus) => {
          setStatus(newStatus);
        },
        onMetricsUpdate: (updatedMetrics) => {
          setMetrics(updatedMetrics);
          setElapsedSeconds(updatedMetrics.elapsedSeconds);
          if (mode === 'timed' && updatedMetrics.durationTargetSeconds) {
            setRemainingSeconds(
              Math.max(0, updatedMetrics.durationTargetSeconds - updatedMetrics.elapsedSeconds)
            );
          }
        },
        onComplete: (finalMetrics) => {
          playComplete();
          const sessionRecord: PracticeSessionRecord = {
            id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            timestamp: Date.now(),
            mode,
            difficulty,
            category,
            durationTargetSeconds: mode === 'timed' ? durationSeconds : undefined,
            metrics: finalMetrics,
            passageSnippet: text?.slice(0, 80) || '',
          };

          savePracticeSession(sessionRecord);
          setActiveSession(sessionRecord);
          onSessionComplete?.(sessionRecord);
        },
        onReplenishText: (newFullText) => {
          setExpectedText(newFullText);
        },
      });

      engineRef.current = engine;
      setMetrics(engine.getMetrics());
    },
    [
      mode,
      difficulty,
      category,
      durationSeconds,
      includePunctuation,
      includeNumbers,
      customText,
      playComplete,
      onSessionComplete,
    ]
  );

  // Generate passage on first render or mode change
  useEffect(() => {
    initEngineWithPassage();
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };
  }, [initEngineWithPassage]);

  // Handle typing input
  const handleKeyInput = useCallback(
    (char: string) => {
      if (!engineRef.current) return;
      const isCorrect = engineRef.current.handleKeyInput(char);
      setLastTypedChar(char);
      playKey(!isCorrect);
      setTypedText(engineRef.current.getTypedText());
    },
    [playKey]
  );

  // Handle Backspace
  const handleBackspace = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.handleBackspace();
    setLastTypedChar('Backspace');
    setTypedText(engineRef.current.getTypedText());
  }, []);

  // Restart current test (keeps same passage)
  const restart = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.reset();
      setTypedText('');
      setLastTypedChar('');
      setStatus('idle');
      setRemainingSeconds(mode === 'timed' ? durationSeconds : null);
      setElapsedSeconds(0);
      setActiveSession(null);
      setMetrics(engineRef.current.getMetrics());
    }
  }, [durationSeconds, mode]);

  // Generate a brand new passage
  const newPassage = useCallback(() => {
    setLastTypedChar('');
    initEngineWithPassage();
  }, [initEngineWithPassage]);

  return {
    mode,
    setMode,
    difficulty,
    setDifficulty,
    category,
    setCategory,
    durationSeconds,
    setDurationSeconds,
    includePunctuation,
    setIncludePunctuation,
    includeNumbers,
    setIncludeNumbers,
    customText,
    setCustomText,
    status,
    expectedText,
    typedText,
    lastTypedChar,
    cursorIndex: typedText.length,
    metrics,
    remainingSeconds,
    elapsedSeconds,
    activeSession,
    handleKeyInput,
    handleBackspace,
    restart,
    newPassage,
    initEngineWithPassage,
  };
}
