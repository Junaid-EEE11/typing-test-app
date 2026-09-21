import {
  PracticeMode,
  PracticeSessionRecord,
  UserGoalStats,
  UserPreferences,
} from '@/types/typing';

const SCHEMA_VERSION = 1;
const STORAGE_KEYS = {
  VERSION: 'typeflow_schema_version',
  HISTORY: 'typeflow_history',
  PREFERENCES: 'typeflow_preferences',
  GOALS: 'typeflow_goals',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  soundEnabled: true,
  soundVolume: 0.5,
  soundType: 'typewriter',
  fontSize: 'lg',
  reducedMotion: false,
  includePunctuation: true,
  includeNumbers: true,
  defaultMode: 'timed',
  defaultDifficulty: 'beginner',
  defaultDuration: 30,
  defaultCategory: 'all',
  customWpmGoal: 30, // Beginner goal default
  showKeyboardGuide: false,
  showFingerColors: true,
  showPacer: true,
};

export const DEFAULT_GOALS: UserGoalStats = {
  beginnerGoal: 30,
  customGoal: 40,
  achievedBeginnerGoal: false,
  achievedCustomGoal: false,
};

function isClient(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Loads and validates practice history from localStorage
 */
export function loadPracticeHistory(): PracticeSessionRecord[] {
  if (!isClient()) return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Validate and sanitize records
    return parsed.filter((item): item is PracticeSessionRecord => {
      return (
        item &&
        typeof item.id === 'string' &&
        typeof item.timestamp === 'number' &&
        typeof item.mode === 'string' &&
        item.metrics &&
        typeof item.metrics.netWpm === 'number' &&
        typeof item.metrics.accuracy === 'number'
      );
    });
  } catch (err) {
    console.error('Failed to load practice history from localStorage:', err);
    return [];
  }
}

/**
 * Saves a new practice session record to history
 */
export function savePracticeSession(record: PracticeSessionRecord): PracticeSessionRecord[] {
  if (!isClient()) return [];

  try {
    const current = loadPracticeHistory();
    const updated = [record, ...current].slice(0, 500); // Keep last 500 sessions
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEYS.VERSION, String(SCHEMA_VERSION));

    // Update goals achievement status
    const goals = loadUserGoals();
    let goalsChanged = false;

    if (record.metrics.netWpm >= goals.beginnerGoal && !goals.achievedBeginnerGoal) {
      goals.achievedBeginnerGoal = true;
      goalsChanged = true;
    }
    if (record.metrics.netWpm >= goals.customGoal && !goals.achievedCustomGoal) {
      goals.achievedCustomGoal = true;
      goalsChanged = true;
    }

    if (goalsChanged) {
      saveUserGoals(goals);
    }

    return updated;
  } catch (err) {
    console.error('Failed to save practice session to localStorage:', err);
    return [];
  }
}

/**
 * Clears all saved practice history
 */
export function clearPracticeHistory(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (err) {
    console.error('Failed to clear practice history:', err);
  }
}

/**
 * Loads user preferences
 */
export function loadUserPreferences(): UserPreferences {
  if (!isClient()) return DEFAULT_PREFERENCES;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return DEFAULT_PREFERENCES;

    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to load preferences, using defaults:', err);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Saves user preferences
 */
export function saveUserPreferences(prefs: UserPreferences): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (err) {
    console.error('Failed to save preferences:', err);
  }
}

/**
 * Resets user preferences to factory defaults
 */
export function resetUserPreferences(): UserPreferences {
  if (isClient()) {
    try {
      localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    } catch (err) {
      console.error('Failed to reset preferences:', err);
    }
  }
  return DEFAULT_PREFERENCES;
}

/**
 * Loads user typing goals
 */
export function loadUserGoals(): UserGoalStats {
  if (!isClient()) return DEFAULT_GOALS;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!raw) return DEFAULT_GOALS;

    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_GOALS,
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to load user goals:', err);
    return DEFAULT_GOALS;
  }
}

/**
 * Saves user typing goals
 */
export function saveUserGoals(goals: UserGoalStats): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (err) {
    console.error('Failed to save user goals:', err);
  }
}

/**
 * Exports practice history as a CSV formatted string
 */
export function generateHistoryCsv(history: PracticeSessionRecord[]): string {
  const headers = [
    'Date & Time',
    'Mode',
    'Difficulty',
    'Category',
    'Net WPM',
    'Gross WPM',
    'Keystroke Accuracy (%)',
    'Final Text Accuracy (%)',
    'CPM',
    'Elapsed Seconds',
    'Completed Words',
    'Total Keystrokes',
    'Errors',
    'Corrected Errors',
    'Uncorrected Errors',
  ];

  const escapeCsv = (val: string | number) => {
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = history.map((record) => {
    const dateStr = new Date(record.timestamp).toISOString();
    return [
      escapeCsv(dateStr),
      escapeCsv(record.mode),
      escapeCsv(record.difficulty),
      escapeCsv(record.category),
      escapeCsv(record.metrics.netWpm),
      escapeCsv(record.metrics.grossWpm),
      escapeCsv(record.metrics.accuracy),
      escapeCsv(record.metrics.finalTextAccuracy),
      escapeCsv(record.metrics.cpm),
      escapeCsv(record.metrics.elapsedSeconds),
      escapeCsv(record.metrics.completedWords),
      escapeCsv(record.metrics.totalKeystrokes),
      escapeCsv(record.metrics.incorrectKeystrokes),
      escapeCsv(record.metrics.correctedErrors),
      escapeCsv(record.metrics.uncorrectedErrors),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Triggers browser download of CSV file
 */
export function downloadCsv(filename: string, csvContent: string): void {
  if (!isClient()) return;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface AggregatedDashboardStats {
  averageNetWpm: number;
  averageGrossWpm: number;
  personalBestNetWpm: number;
  averageAccuracy: number;
  totalPracticeSeconds: number;
  completedSessionsCount: number;
  streakDays: number;
  wpmTrend: { date: string; netWpm: number; grossWpm: number; accuracy: number; mode: string }[];
  accuracyTrend: { date: string; accuracy: number; finalTextAccuracy: number }[];
  dailyPracticeMinutes: { date: string; minutes: number; sessions: number }[];
}

/**
 * Computes dashboard analytics from history and filter range
 */
export function calculateDashboardAnalytics(
  history: PracticeSessionRecord[],
  filterRange: '7d' | '30d' | 'all' = 'all'
): AggregatedDashboardStats {
  if (!history || history.length === 0) {
    return {
      averageNetWpm: 0,
      averageGrossWpm: 0,
      personalBestNetWpm: 0,
      averageAccuracy: 0,
      totalPracticeSeconds: 0,
      completedSessionsCount: 0,
      streakDays: 0,
      wpmTrend: [],
      accuracyTrend: [],
      dailyPracticeMinutes: [],
    };
  }

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const filtered = history.filter((session) => {
    if (filterRange === '7d') {
      return now - session.timestamp <= 7 * dayMs;
    }
    if (filterRange === '30d') {
      return now - session.timestamp <= 30 * dayMs;
    }
    return true;
  });

  if (filtered.length === 0) {
    return {
      averageNetWpm: 0,
      averageGrossWpm: 0,
      personalBestNetWpm: 0,
      averageAccuracy: 0,
      totalPracticeSeconds: 0,
      completedSessionsCount: 0,
      streakDays: calculateStreak(history),
      wpmTrend: [],
      accuracyTrend: [],
      dailyPracticeMinutes: [],
    };
  }

  let totalNetWpm = 0;
  let totalGrossWpm = 0;
  let totalAccuracy = 0;
  let personalBestNetWpm = 0;
  let totalPracticeSeconds = 0;

  // Chronological order for trend charts
  const chronological = [...filtered].reverse();

  const wpmTrend = chronological.map((s) => ({
    date: new Date(s.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    netWpm: s.metrics.netWpm,
    grossWpm: s.metrics.grossWpm,
    accuracy: s.metrics.accuracy,
    mode: s.mode,
  }));

  const accuracyTrend = chronological.map((s) => ({
    date: new Date(s.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    accuracy: s.metrics.accuracy,
    finalTextAccuracy: s.metrics.finalTextAccuracy,
  }));

  // Daily practice grouping
  const dailyMap = new Map<string, { minutes: number; sessions: number }>();

  filtered.forEach((session) => {
    const net = session.metrics.netWpm;
    const gross = session.metrics.grossWpm;
    const acc = session.metrics.accuracy;
    const sec = session.metrics.elapsedSeconds;

    totalNetWpm += net;
    totalGrossWpm += gross;
    totalAccuracy += acc;
    totalPracticeSeconds += sec;

    if (net > personalBestNetWpm) {
      personalBestNetWpm = net;
    }

    const dayKey = new Date(session.timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });

    const currentDaily = dailyMap.get(dayKey) || { minutes: 0, sessions: 0 };
    currentDaily.minutes += sec / 60;
    currentDaily.sessions += 1;
    dailyMap.set(dayKey, currentDaily);
  });

  const dailyPracticeMinutes = Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      minutes: Math.round(data.minutes * 10) / 10,
      sessions: data.sessions,
    }))
    .reverse();

  const count = filtered.length;
  const streakDays = calculateStreak(history);

  return {
    averageNetWpm: Math.round((totalNetWpm / count) * 10) / 10,
    averageGrossWpm: Math.round((totalGrossWpm / count) * 10) / 10,
    personalBestNetWpm: Math.round(personalBestNetWpm * 10) / 10,
    averageAccuracy: Math.round((totalAccuracy / count) * 10) / 10,
    totalPracticeSeconds: Math.round(totalPracticeSeconds),
    completedSessionsCount: count,
    streakDays,
    wpmTrend,
    accuracyTrend,
    dailyPracticeMinutes,
  };
}

/**
 * Calculates current consecutive practice day streak
 */
function calculateStreak(history: PracticeSessionRecord[]): number {
  if (!history || history.length === 0) return 0;

  const dayDates = new Set<string>();
  history.forEach((session) => {
    const d = new Date(session.timestamp);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    dayDates.add(key);
  });

  let streak = 0;
  const current = new Date();

  // Check if practiced today
  const todayKey = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;
  const yesterday = new Date(current.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

  let checkDate = current;
  if (!dayDates.has(todayKey)) {
    // If not practiced today, check if streak from yesterday is active
    if (!dayDates.has(yesterdayKey)) {
      return 0;
    }
    checkDate = yesterday;
  }

  while (true) {
    const key = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
    if (dayDates.has(key)) {
      streak++;
      checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
    } else {
      break;
    }
  }

  return streak;
}
