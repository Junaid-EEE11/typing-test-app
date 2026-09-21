'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { StatsBar } from '@/components/typing/StatsBar';
import { TypingArea } from '@/components/typing/TypingArea';
import { ControlPanel } from '@/components/typing/ControlPanel';
import { ResultsModal } from '@/components/results/ResultsModal';
import { VirtualKeyboard } from '@/components/typing/VirtualKeyboard';
import { GhostPacer } from '@/components/typing/GhostPacer';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import {
  DEFAULT_PREFERENCES,
  loadPracticeHistory,
  loadUserPreferences,
  saveUserPreferences,
} from '@/lib/storage/localStorage';
import { extractWeakKeys } from '@/lib/typing/weakKeys';
import { PracticeSessionRecord, UserPreferences } from '@/types/typing';

export default function PracticePage() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [history, setHistory] = useState<PracticeSessionRecord[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [previousSession, setPreviousSession] = useState<PracticeSessionRecord | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Load preferences and history once on client mount
  useEffect(() => {
    setIsMounted(true);
    const loadedPrefs = loadUserPreferences();
    setPreferences(loadedPrefs);

    const loadedHistory = loadPracticeHistory();
    setHistory(loadedHistory);
    if (loadedHistory.length > 0) {
      setPreviousSession(loadedHistory[0]);
    }
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSessionComplete = useCallback((session: PracticeSessionRecord) => {
    const updatedHistory = loadPracticeHistory();
    setHistory(updatedHistory);
    if (updatedHistory.length > 1) {
      setPreviousSession(updatedHistory[1]);
    }
  }, []);

  const {
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
    cursorIndex,
    metrics,
    remainingSeconds,
    elapsedSeconds,
    activeSession,
    handleKeyInput,
    handleBackspace,
    restart,
    newPassage,
    initEngineWithPassage,
  } = useTypingEngine({
    preferences,
    history,
    onSessionComplete: handleSessionComplete,
  });

  // Global keyboard shortcuts (Tab to restart, Esc to reset)
  useKeyboardShortcuts({
    onRestart: restart,
    onReset: restart,
  });

  const handlePreferencesChange = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    saveUserPreferences(newPrefs);
  };

  const handleToggleKeyboardGuide = () => {
    const updated = {
      ...preferences,
      showKeyboardGuide: !preferences.showKeyboardGuide,
    };
    handlePreferencesChange(updated);
  };

  const handleTogglePacer = () => {
    const updated = {
      ...preferences,
      showPacer: !preferences.showPacer,
    };
    handlePreferencesChange(updated);
  };

  const handleApplyCustomText = (text: string) => {
    setCustomText(text);
    setMode('custom');
    initEngineWithPassage(text);
  };

  // Extract weak keys from user history
  const weakKeys = useMemo(() => {
    return extractWeakKeys(history, 6);
  }, [history]);

  // Next expected character for keyboard finger guidance
  const nextChar = expectedText[cursorIndex] || '';

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-main">
      <Navbar
        preferences={preferences}
        onPreferencesChange={handlePreferencesChange}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col items-center justify-center space-y-6">
        {status === 'completed' && activeSession ? (
          /* Results View when test is completed */
          <ResultsModal
            session={activeSession}
            previousSession={previousSession}
            onTryAgain={restart}
            onNewPassage={newPassage}
            onStartWeakKeyDrill={() => {
              setMode('weak_keys');
              newPassage();
            }}
          />
        ) : (
          /* Active Typing Practice View */
          <div className="w-full space-y-4">
            {/* Control Panel */}
            <ControlPanel
              mode={mode}
              onModeChange={setMode}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              category={category}
              onCategoryChange={setCategory}
              durationSeconds={durationSeconds}
              onDurationChange={setDurationSeconds}
              includePunctuation={includePunctuation}
              onTogglePunctuation={setIncludePunctuation}
              includeNumbers={includeNumbers}
              onToggleNumbers={setIncludeNumbers}
              showKeyboardGuide={preferences.showKeyboardGuide}
              onToggleKeyboardGuide={handleToggleKeyboardGuide}
              showPacer={preferences.showPacer}
              onTogglePacer={handleTogglePacer}
              onRestart={restart}
              onNewPassage={newPassage}
              onApplyCustomText={handleApplyCustomText}
              customText={customText}
            />

            {/* Ghost Pacer Target Speed Bar */}
            {preferences.showPacer && status !== 'idle' && (
              <GhostPacer
                cursorIndex={cursorIndex}
                totalLength={expectedText.length}
                elapsedSeconds={elapsedSeconds}
                currentNetWpm={metrics?.netWpm || 0}
                targetWpm={preferences.customWpmGoal || 30}
                status={status}
              />
            )}

            {/* Live Stats Bar */}
            <StatsBar
              metrics={metrics}
              mode={mode}
              remainingSeconds={remainingSeconds}
              elapsedSeconds={elapsedSeconds}
              durationTargetSeconds={durationSeconds}
            />

            {/* Main Interactive Typing Area */}
            <TypingArea
              expectedText={expectedText}
              typedText={typedText}
              cursorIndex={cursorIndex}
              status={status}
              fontSize={preferences.fontSize}
              onKeyInput={handleKeyInput}
              onBackspace={handleBackspace}
              onRestart={restart}
            />

            {/* Virtual Keyboard & Finger Placement Guide */}
            {preferences.showKeyboardGuide && (
              <VirtualKeyboard
                activeChar={lastTypedChar}
                nextChar={nextChar}
                weakKeys={weakKeys}
                showFingerColors={preferences.showFingerColors}
              />
            )}
          </div>
        )}
      </main>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectMode={(m) => setMode(m)}
        onRestart={restart}
        onNewPassage={newPassage}
        onToggleSound={() => {
          handlePreferencesChange({
            ...preferences,
            soundEnabled: !preferences.soundEnabled,
          });
        }}
        onToggleKeyboardGuide={handleToggleKeyboardGuide}
      />

      <Footer />
    </div>
  );
}
