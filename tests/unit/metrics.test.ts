import { describe, it, expect } from 'vitest';
import { computeTypingMetrics, generateFeedback } from '@/lib/typing/metrics';

describe('Typing Metrics Engine', () => {
  it('calculates Gross and Net WPM accurately with zero division safety', () => {
    // 50 characters typed in 60 seconds (1 minute) = 10 Gross WPM
    const metrics = computeTypingMetrics({
      totalKeystrokes: 50,
      correctKeystrokes: 50,
      incorrectKeystrokes: 0,
      backspaceCount: 0,
      expectedFullText: 'A short sentence for testing typing speed evaluation.',
      submittedText: 'A short sentence for testing typing speed evaluation.',
      elapsedSeconds: 60,
    });

    expect(metrics.grossWpm).toBe(10);
    expect(metrics.netWpm).toBe(10);
    expect(metrics.accuracy).toBe(100);
    expect(metrics.uncorrectedErrors).toBe(0);
    expect(metrics.correctedErrors).toBe(0);
  });

  it('calculates Net WPM with uncorrected errors deducted', () => {
    // 100 characters in 60 seconds with 5 uncorrected errors
    // Gross WPM = 100 / 5 / 1 = 20
    // Net WPM = (100 - 5) / 5 / 1 = 19
    const expected = 'This is a sample text with exactly fifty chars plus.';
    const submitted = 'This is a sample text with zzactly fifty chars plus.'; // 2 typos ("zz" vs "ex")

    const metrics = computeTypingMetrics({
      totalKeystrokes: 100,
      correctKeystrokes: 98,
      incorrectKeystrokes: 2,
      backspaceCount: 0,
      expectedFullText: expected,
      submittedText: submitted,
      elapsedSeconds: 60,
    });

    expect(metrics.grossWpm).toBe(20);
    expect(metrics.netWpm).toBe(19.6);
    expect(metrics.accuracy).toBe(98);
    expect(metrics.uncorrectedErrors).toBe(2);
  });

  it('clamps Net WPM to zero when uncorrected errors exceed total keystrokes', () => {
    const metrics = computeTypingMetrics({
      totalKeystrokes: 10,
      correctKeystrokes: 0,
      incorrectKeystrokes: 10,
      backspaceCount: 0,
      expectedFullText: 'Hello world',
      submittedText: 'xxxxxxxxxx',
      elapsedSeconds: 30,
    });

    expect(metrics.netWpm).toBe(0);
  });

  it('handles corrected mistakes vs uncorrected mistakes accurately', () => {
    // User typed 5 wrong characters, but backspaced 5 times and submitted clean text
    const expected = 'Practice makes perfect.';
    const submitted = 'Practice makes perfect.';

    const metrics = computeTypingMetrics({
      totalKeystrokes: expected.length + 5, // 23 + 5 = 28
      correctKeystrokes: expected.length, // 23
      incorrectKeystrokes: 5,
      backspaceCount: 5,
      expectedFullText: expected,
      submittedText: submitted,
      elapsedSeconds: 30,
    });

    expect(metrics.uncorrectedErrors).toBe(0);
    expect(metrics.correctedErrors).toBe(5);
    // Keystroke accuracy = 23 / 28 * 100 = 82.1%
    expect(metrics.accuracy).toBeCloseTo(82.1, 1);
    expect(metrics.finalTextAccuracy).toBe(100);
  });

  it('handles empty input and very short test duration safely', () => {
    const metrics = computeTypingMetrics({
      totalKeystrokes: 0,
      correctKeystrokes: 0,
      incorrectKeystrokes: 0,
      backspaceCount: 0,
      expectedFullText: 'Some passage',
      submittedText: '',
      elapsedSeconds: 0,
    });

    expect(metrics.grossWpm).toBe(0);
    expect(metrics.netWpm).toBe(0);
    expect(metrics.accuracy).toBe(100);
    expect(metrics.finalTextAccuracy).toBe(0);
  });

  it('generates practical feedback based on performance', () => {
    const feedback = generateFeedback({
      grossWpm: 45,
      netWpm: 43,
      accuracy: 96,
      finalTextAccuracy: 98,
      cpm: 225,
      totalKeystrokes: 225,
      correctKeystrokes: 216,
      incorrectKeystrokes: 9,
      backspaceCount: 7,
      correctedErrors: 7,
      uncorrectedErrors: 2,
      completedWords: 40,
      totalWords: 42,
      completionPercentage: 95,
      elapsedSeconds: 60,
      samples: [],
      mistakes: { 'e->r': { expected: 'e', typed: 'r', count: 3 } },
    }, { netWpm: 40, accuracy: 94 });

    expect(feedback.length).toBeGreaterThan(0);
    expect(feedback.some((f) => f.includes('improved by +3 WPM'))).toBe(true);
  });
});
