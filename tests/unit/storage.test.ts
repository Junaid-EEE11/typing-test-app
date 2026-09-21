import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateDashboardAnalytics,
  clearPracticeHistory,
  generateHistoryCsv,
  loadPracticeHistory,
  loadUserPreferences,
  savePracticeSession,
  saveUserPreferences,
} from '@/lib/storage/localStorage';
import { PracticeSessionRecord } from '@/types/typing';

describe('Storage & Analytics', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and loads practice session history', () => {
    const dummySession: PracticeSessionRecord = {
      id: 'session-1',
      timestamp: Date.now(),
      mode: 'timed',
      difficulty: 'beginner',
      category: 'conversation',
      durationTargetSeconds: 30,
      passageSnippet: 'I drink a cup of warm tea.',
      metrics: {
        grossWpm: 40,
        netWpm: 38,
        accuracy: 95,
        finalTextAccuracy: 95,
        cpm: 200,
        totalKeystrokes: 100,
        correctKeystrokes: 95,
        incorrectKeystrokes: 5,
        backspaceCount: 3,
        correctedErrors: 3,
        uncorrectedErrors: 2,
        completedWords: 20,
        totalWords: 20,
        completionPercentage: 100,
        elapsedSeconds: 30,
        samples: [],
        mistakes: {},
      },
    };

    const saved = savePracticeSession(dummySession);
    expect(saved.length).toBe(1);

    const loaded = loadPracticeHistory();
    expect(loaded.length).toBe(1);
    expect(loaded[0].id).toBe('session-1');
    expect(loaded[0].metrics.netWpm).toBe(38);
  });

  it('generates CSV string with proper escaping', () => {
    const record: PracticeSessionRecord = {
      id: 'session-2',
      timestamp: 1700000000000,
      mode: 'sentence',
      difficulty: 'intermediate',
      category: 'workplace',
      passageSnippet: 'Let\'s collaborate.',
      metrics: {
        grossWpm: 50,
        netWpm: 50,
        accuracy: 100,
        finalTextAccuracy: 100,
        cpm: 250,
        totalKeystrokes: 50,
        correctKeystrokes: 50,
        incorrectKeystrokes: 0,
        backspaceCount: 0,
        correctedErrors: 0,
        uncorrectedErrors: 0,
        completedWords: 10,
        totalWords: 10,
        completionPercentage: 100,
        elapsedSeconds: 12,
        samples: [],
        mistakes: {},
      },
    };

    const csv = generateHistoryCsv([record]);
    expect(csv).toContain('Date & Time,Mode,Difficulty');
    expect(csv).toContain('sentence,intermediate,workplace,50,50,100');
  });

  it('calculates dashboard analytics accurately', () => {
    const session1: PracticeSessionRecord = {
      id: 's-1',
      timestamp: Date.now() - 10000,
      mode: 'timed',
      difficulty: 'beginner',
      category: 'technology',
      passageSnippet: 'Sample snippet',
      metrics: {
        grossWpm: 40,
        netWpm: 40,
        accuracy: 100,
        finalTextAccuracy: 100,
        cpm: 200,
        totalKeystrokes: 100,
        correctKeystrokes: 100,
        incorrectKeystrokes: 0,
        backspaceCount: 0,
        correctedErrors: 0,
        uncorrectedErrors: 0,
        completedWords: 20,
        totalWords: 20,
        completionPercentage: 100,
        elapsedSeconds: 30,
        samples: [],
        mistakes: {},
      },
    };

    const session2: PracticeSessionRecord = {
      id: 's-2',
      timestamp: Date.now() - 5000,
      mode: 'timed',
      difficulty: 'beginner',
      category: 'technology',
      passageSnippet: 'Sample snippet 2',
      metrics: {
        grossWpm: 60,
        netWpm: 50,
        accuracy: 90,
        finalTextAccuracy: 90,
        cpm: 300,
        totalKeystrokes: 150,
        correctKeystrokes: 135,
        incorrectKeystrokes: 15,
        backspaceCount: 5,
        correctedErrors: 5,
        uncorrectedErrors: 10,
        completedWords: 30,
        totalWords: 30,
        completionPercentage: 100,
        elapsedSeconds: 30,
        samples: [],
        mistakes: {},
      },
    };

    const analytics = calculateDashboardAnalytics([session1, session2]);
    expect(analytics.completedSessionsCount).toBe(2);
    expect(analytics.averageNetWpm).toBe(45); // (40 + 50) / 2
    expect(analytics.personalBestNetWpm).toBe(50);
    expect(analytics.averageAccuracy).toBe(95); // (100 + 90) / 2
    expect(analytics.totalPracticeSeconds).toBe(60);
  });
});
