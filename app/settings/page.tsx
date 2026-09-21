'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { SettingsForm } from '@/components/settings/SettingsForm';
import { DEFAULT_PREFERENCES, loadUserPreferences, saveUserPreferences } from '@/lib/storage/localStorage';
import { UserPreferences } from '@/types/typing';

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setPreferences(loadUserPreferences());
  }, []);

  const handlePreferencesChange = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    saveUserPreferences(newPrefs);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-main">
      <Navbar preferences={preferences} onPreferencesChange={handlePreferencesChange} />

      <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="pb-4 border-b border-border">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight">
            Preferences & Settings
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Customize your typing experience, sound effects, visual themes, and target speed goals.
          </p>
        </div>

        <SettingsForm
          preferences={preferences}
          onPreferencesChange={handlePreferencesChange}
        />
      </main>

      <Footer />
    </div>
  );
}
