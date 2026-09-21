import { describe, it, expect } from 'vitest';
import {
  calculateFinalTextAccuracy,
  calculateLevenshteinDistance,
  normalizeText,
} from '@/lib/typing/levenshtein';

describe('Levenshtein distance & Final Text Accuracy', () => {
  it('handles empty strings correctly', () => {
    expect(calculateLevenshteinDistance('', '')).toBe(0);
    expect(calculateLevenshteinDistance('hello', '')).toBe(5);
    expect(calculateLevenshteinDistance('', 'world')).toBe(5);

    expect(calculateFinalTextAccuracy('', '')).toBe(100);
    expect(calculateFinalTextAccuracy('hello', '')).toBe(0);
  });

  it('computes exact match accuracy as 100%', () => {
    const text = 'The quick brown fox jumps over the lazy dog.';
    expect(calculateLevenshteinDistance(text, text)).toBe(0);
    expect(calculateFinalTextAccuracy(text, text)).toBe(100);
  });

  it('calculates substitutions correctly', () => {
    // "kitten" -> "sitten" (1 sub)
    expect(calculateLevenshteinDistance('kitten', 'sitten')).toBe(1);
    // "kitten" -> "sitting" (1 sub, 1 sub, 1 ins = 3)
    expect(calculateLevenshteinDistance('kitten', 'sitting')).toBe(3);
  });

  it('calculates final text accuracy with insertions and deletions', () => {
    const expected = 'Hello world';
    const submitted = 'Hello word'; // 1 deletion ('l' missing), max len = 11, dist = 1
    // (1 - 1/11) * 100 = 90.9%
    const acc = calculateFinalTextAccuracy(expected, submitted);
    expect(acc).toBeCloseTo(90.9, 1);
  });

  it('performs consistent Unicode NFC normalization', () => {
    const text1 = 'café'; // composed
    const text2 = 'cafe\u0301'; // decomposed 'e' + acute
    expect(normalizeText(text1)).toBe(normalizeText(text2));
    expect(calculateLevenshteinDistance(text1, text2)).toBe(0);
  });

  it('preserves case differences and punctuation without silently ignoring them', () => {
    expect(calculateLevenshteinDistance('Hello', 'hello')).toBe(1);
    expect(calculateLevenshteinDistance('hello,', 'hello.')).toBe(1);
  });
});
