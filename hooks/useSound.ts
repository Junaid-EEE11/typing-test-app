'use client';

import { useEffect, useCallback } from 'react';
import { soundEngine, SoundType } from '@/lib/typing/sound';
import { UserPreferences } from '@/types/typing';

export function useSound(preferences: UserPreferences) {
  useEffect(() => {
    soundEngine.setEnabled(preferences.soundEnabled);
    soundEngine.setVolume(preferences.soundVolume);
    soundEngine.setSoundType(preferences.soundType);
  }, [preferences.soundEnabled, preferences.soundVolume, preferences.soundType]);

  const playKey = useCallback((isError = false) => {
    soundEngine.playKeypress(isError);
  }, []);

  const playComplete = useCallback(() => {
    soundEngine.playComplete();
  }, []);

  return {
    playKey,
    playComplete,
  };
}
