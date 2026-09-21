export type PracticeMode = 'timed' | 'sentence' | 'paragraph' | 'accuracy' | 'custom' | 'weak_keys';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type SentenceCategory =
  | 'conversation'
  | 'workplace'
  | 'emails'
  | 'education'
  | 'technology'
  | 'travel'
  | 'shopping'
  | 'productivity'
  | 'general'
  | 'storytelling';

export interface SentenceItem {
  id: string;
  text: string;
  category: SentenceCategory;
  difficulty: DifficultyLevel;
  charCount: number;
  wordCount: number;
}

export type TestStatus = 'idle' | 'running' | 'paused' | 'completed' | 'cancelled';

export interface KeystrokeEvent {
  timestamp: number; // monotonic timestamp in ms
  key: string;
  expectedChar: string;
  isCorrect: boolean;
  isBackspace: boolean;
}

export interface WpmSample {
  time: number; // seconds from start
  wpm: number; // gross WPM at this sample
  netWpm: number; // net WPM at this sample
  accuracy: number; // keystroke accuracy %
  rawCpm: number;
}

export interface MistakeDetail {
  expected: string;
  typed: string;
  count: number;
}

export interface TypingMetrics {
  grossWpm: number;
  netWpm: number;
  accuracy: number; // Keystroke Accuracy % (0-100)
  finalTextAccuracy: number; // Levenshtein final text accuracy % (0-100)
  cpm: number; // Characters per minute
  totalKeystrokes: number; // Total printable keystrokes
  correctKeystrokes: number;
  incorrectKeystrokes: number;
  backspaceCount: number;
  correctedErrors: number;
  uncorrectedErrors: number;
  completedWords: number;
  totalWords: number;
  completionPercentage: number;
  elapsedSeconds: number;
  durationTargetSeconds?: number;
  samples: WpmSample[];
  mistakes: Record<string, MistakeDetail>;
}

export interface PracticeSessionRecord {
  id: string;
  timestamp: number; // Date.now()
  mode: PracticeMode;
  difficulty: DifficultyLevel;
  category: SentenceCategory | 'all' | 'custom';
  durationTargetSeconds?: number;
  metrics: TypingMetrics;
  passageSnippet: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  soundType: 'typewriter' | 'soft-click' | 'mechanical' | 'beep';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  reducedMotion: boolean;
  includePunctuation: boolean;
  includeNumbers: boolean;
  defaultMode: PracticeMode;
  defaultDifficulty: DifficultyLevel;
  defaultDuration: number; // 15, 30, 60, 120
  defaultCategory: SentenceCategory | 'all';
  customWpmGoal: number; // e.g. 30 (beginner default) or 60
  showKeyboardGuide: boolean;
  showFingerColors: boolean;
  showPacer: boolean;
}

export interface UserGoalStats {
  beginnerGoal: number; // 30 WPM
  customGoal: number;
  achievedBeginnerGoal: boolean;
  achievedCustomGoal: boolean;
}
