import { describe, it, expect } from 'vitest';
import { generatePassage, sanitizeCustomText } from '@/lib/typing/generator';
import { SENTENCE_DATABASE } from '@/data/sentences';

describe('Sentence Generator & Database', () => {
  it('contains at least 150 unique realistic sentences', () => {
    expect(SENTENCE_DATABASE.length).toBeGreaterThanOrEqual(150);
    const uniqueIds = new Set(SENTENCE_DATABASE.map((s) => s.id));
    expect(uniqueIds.size).toBe(SENTENCE_DATABASE.length);
  });

  it('provides deterministic passage selection with fixed seed', () => {
    const passage1 = generatePassage({
      mode: 'sentence',
      difficulty: 'intermediate',
      seed: 42,
    });

    const passage2 = generatePassage({
      mode: 'sentence',
      difficulty: 'intermediate',
      seed: 42,
    });

    expect(passage1.text).toBe(passage2.text);
    expect(passage1.sentenceIds).toEqual(passage2.sentenceIds);
  });

  it('filters by category and difficulty properly', () => {
    const passage = generatePassage({
      mode: 'sentence',
      difficulty: 'beginner',
      category: 'technology',
      seed: 99,
    });

    const matched = SENTENCE_DATABASE.find((s) => s.id === passage.sentenceIds[0]);
    expect(matched?.difficulty).toBe('beginner');
    expect(matched?.category).toBe('technology');
  });

  it('sanitizes custom text and prevents HTML / Script injection', () => {
    const raw = '<script>alert("hack")</script><b>Hello</b>   world!  \n\nHow are you?';
    const sanitized = sanitizeCustomText(raw);
    expect(sanitized).toBe('alert("hack") Hello world! How are you?');
    expect(sanitized).not.toContain('<');
    expect(sanitized).not.toContain('>');
  });

  it('generates paragraph passages containing multiple sentences', () => {
    const paragraph = generatePassage({
      mode: 'paragraph',
      difficulty: 'intermediate',
      seed: 123,
    });

    expect(paragraph.sentenceIds.length).toBeGreaterThanOrEqual(3);
    expect(paragraph.text.length).toBeGreaterThan(100);
  });
});
