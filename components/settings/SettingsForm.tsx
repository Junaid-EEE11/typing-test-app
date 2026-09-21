'use client';

import React, { useState } from 'react';
import {
  Volume2,
  Type,
  Sliders,
  RotateCcw,
  Sparkles,
  SunMoon,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { UserPreferences } from '@/types/typing';
import { resetUserPreferences, saveUserPreferences } from '@/lib/storage/localStorage';
import { CATEGORIES } from '@/data/sentences';
import { Button } from '../ui/Button';
import { Toggle } from '../ui/Toggle';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import { soundEngine } from '@/lib/typing/sound';

interface SettingsFormProps {
  preferences: UserPreferences;
  onPreferencesChange: (prefs: UserPreferences) => void;
}

export function SettingsForm({ preferences, onPreferencesChange }: SettingsFormProps) {
  const [prefs, setPrefs] = useState<UserPreferences>(preferences);
  const [savedNotice, setSavedNotice] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    saveUserPreferences(updated);
    onPreferencesChange(updated);

    // Audio preview if sound changed
    if (key === 'soundType' || key === 'soundVolume') {
      soundEngine.setSoundType(updated.soundType);
      soundEngine.setVolume(updated.soundVolume);
      soundEngine.playKeypress(false);
    }

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleReset = () => {
    const defaults = resetUserPreferences();
    setPrefs(defaults);
    onPreferencesChange(defaults);
    setResetModalOpen(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Toast Notice */}
      {savedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings saved</span>
        </div>
      )}

      {/* 1. Appearance & Display */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border">
          <SunMoon className="w-5 h-5 text-primary" />
          <h3 className="text-base font-bold text-text-main">Appearance & Display</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Theme */}
          <Select
            label="Theme"
            value={prefs.theme}
            onChange={(e) => updatePreference('theme', e.target.value as 'dark' | 'light' | 'system')}
            options={[
              { value: 'dark', label: 'Dark Mode (Slate)' },
              { value: 'light', label: 'Light Mode (Clean)' },
              { value: 'system', label: 'Match System Preference' },
            ]}
          />

          {/* Font Size */}
          <Select
            label="Typing Text Font Size"
            value={prefs.fontSize}
            onChange={(e) => updatePreference('fontSize', e.target.value as 'sm' | 'md' | 'lg' | 'xl')}
            options={[
              { value: 'sm', label: 'Small (Compact)' },
              { value: 'md', label: 'Medium (Standard)' },
              { value: 'lg', label: 'Large (Recommended)' },
              { value: 'xl', label: 'Extra Large' },
            ]}
          />
        </div>

        {/* Reduced Motion Toggle */}
        <Toggle
          label="Reduced Motion"
          description="Disables cursor blink and smooth transitions for accessibility"
          checked={prefs.reducedMotion}
          onChange={(checked) => updatePreference('reducedMotion', checked)}
        />

        {/* Virtual Keyboard Guide */}
        <Toggle
          label="Show Virtual Keyboard Guide"
          description="Displays an on-screen keyboard showing the next key and recommended finger placement"
          checked={prefs.showKeyboardGuide}
          onChange={(checked) => updatePreference('showKeyboardGuide', checked)}
        />

        {/* Finger Zone Colors */}
        {prefs.showKeyboardGuide && (
          <Toggle
            label="Color-Coded Finger Zones"
            description="Highlights keys matching standard touch-typing finger assignments"
            checked={prefs.showFingerColors}
            onChange={(checked) => updatePreference('showFingerColors', checked)}
          />
        )}

        {/* Ghost Pacer Speed Bar */}
        <Toggle
          label="Show Ghost Pacer Racing Bar"
          description="Displays live pacing progress against your target WPM during practice tests"
          checked={prefs.showPacer}
          onChange={(checked) => updatePreference('showPacer', checked)}
        />
      </div>

      {/* 2. Audio & Sound Effects */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border">
          <Volume2 className="w-5 h-5 text-sky-400" />
          <h3 className="text-base font-bold text-text-main">Audio & Sound Effects</h3>
        </div>

        <Toggle
          label="Keyboard Keystroke Sounds"
          description="Synthesized audio feedback on keystrokes and error alerts"
          checked={prefs.soundEnabled}
          onChange={(checked) => updatePreference('soundEnabled', checked)}
        />

        {prefs.soundEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Select
              label="Sound Profile"
              value={prefs.soundType}
              onChange={(e) =>
                updatePreference('soundType', e.target.value as 'typewriter' | 'soft-click' | 'mechanical' | 'beep')
              }
              options={[
                { value: 'typewriter', label: 'Classic Typewriter' },
                { value: 'soft-click', label: 'Soft Tactile Bubble' },
                { value: 'mechanical', label: 'Mechanical Blue Switch' },
                { value: 'beep', label: 'Minimal Sine Tap' },
              ]}
            />

            <div>
              <label htmlFor="sound-volume-slider" className="block text-sm font-medium text-text-muted mb-2">
                Sound Volume: {Math.round(prefs.soundVolume * 100)}%
              </label>
              <input
                id="sound-volume-slider"
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={prefs.soundVolume}
                onChange={(e) => updatePreference('soundVolume', parseFloat(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Practice Defaults & Goals */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border">
          <Target className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-text-main">Practice Defaults & Target Goal</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Default Mode"
            value={prefs.defaultMode}
            onChange={(e) => updatePreference('defaultMode', e.target.value as any)}
            options={[
              { value: 'timed', label: 'Timed Practice' },
              { value: 'sentence', label: 'Single Sentence' },
              { value: 'paragraph', label: 'Paragraph' },
              { value: 'accuracy', label: 'Accuracy Training' },
              { value: 'custom', label: 'Custom Text' },
            ]}
          />

          <Select
            label="Default Difficulty"
            value={prefs.defaultDifficulty}
            onChange={(e) => updatePreference('defaultDifficulty', e.target.value as any)}
            options={[
              { value: 'beginner', label: 'Beginner (15-25 WPM)' },
              { value: 'intermediate', label: 'Intermediate (30-50 WPM)' },
              { value: 'advanced', label: 'Advanced (50+ WPM)' },
            ]}
          />

          <Select
            label="Default Duration"
            value={prefs.defaultDuration}
            onChange={(e) => updatePreference('defaultDuration', parseInt(e.target.value, 10))}
            options={[
              { value: 15, label: '15 Seconds' },
              { value: 30, label: '30 Seconds' },
              { value: 60, label: '60 Seconds' },
              { value: 120, label: '120 Seconds (2 min)' },
            ]}
          />
        </div>

        {/* Custom WPM Target Goal */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="custom-wpm-goal-input" className="text-sm font-medium text-text-main">
              Personal Net WPM Goal: <span className="font-bold text-primary">{prefs.customWpmGoal} WPM</span>
            </label>
            <span className="text-xs text-text-muted">Beginner foundation is 30 WPM</span>
          </div>
          <input
            id="custom-wpm-goal-input"
            type="range"
            min="20"
            max="120"
            step="5"
            value={prefs.customWpmGoal}
            onChange={(e) => updatePreference('customWpmGoal', parseInt(e.target.value, 10))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>
      </div>

      {/* 4. Reset Preferences */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-text-main">Reset Settings</h4>
          <p className="text-xs text-text-muted mt-0.5">
            Restore all user preferences back to factory defaults
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setResetModalOpen(true)}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Reset Defaults
        </Button>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset All Settings?"
        description="Are you sure you want to reset your preferences to default? Your typing history and records will remain safe."
      >
        <div className="flex items-center justify-end gap-2.5 pt-4">
          <Button variant="ghost" onClick={() => setResetModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReset}>
            Reset to Defaults
          </Button>
        </div>
      </Modal>
    </div>
  );
}
