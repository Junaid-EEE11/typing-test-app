import { describe, it, expect } from 'vitest';
import { extractWeakKeys, generateWeakKeyPassage } from '@/lib/typing/weakKeys';
import { PracticeSessionRecord } from '@/types/typing';

describe('weakKeys module', () => {
  it('extracts and ranks most frequent mistyped keys across session history', () => {
    const mockHistory: PracticeSessionRecord[] = [
      {
        id: 's1',
        timestamp: Date.now() - 10000,
        mode: 'timed',
        difficulty: 'beginner',
        category: 'conversation',
        passageSnippet: 'test',
        metrics: {
          grossWpm: 40,
          netWpm: 38,
          accuracy: 95,
          finalTextAccuracy: 95,
          cpm: 200,
          totalKeystrokes: 100,
          correctKeystrokes: 95,
          incorrectKeystrokes: 5,
          backspaceCount: 5,
          correctedErrors: 5,
          uncorrectedErrors: 0,
          completedWords: 20,
          totalWords: 20,
          completionPercentage: 100,
          elapsedSeconds: 30,
          samples: [],
          mistakes: {
            'p->o': { expected: 'p', typed: 'o', count: 4 },
            'b->v': { expected: 'b', typed: 'v', count: 2 },
          },
        },
      },
      {
        id: 's2',
        timestamp: Date.now() - 5000,
        mode: 'sentence',
        difficulty: 'beginner',
        category: 'workplace',
        passageSnippet: 'test2',
        metrics: {
          grossWpm: 45,
          netWpm: 42,
          accuracy: 94,
          finalTextAccuracy: 94,
          cpm: 220,
          totalKeystrokes: 80,
          correctKeystrokes: 75,
          incorrectKeystrokes: 5,
          backspaceCount: 5,
          correctedErrors: 5,
          uncorrectedErrors: 0,
          completedWords: 15,
          totalWords: 15,
          completionPercentage: 100,
          elapsedSeconds: 20,
          samples: [],
          mistakes: {
            'b->v': { expected: 'b', typed: 'v', count: 3 },
            'r->e': { expected: 'r', typed: 'e', count: 1 },
          },
        },
      },
    ];

    const weakKeys = extractWeakKeys(mockHistory);
    expect(weakKeys).toHaveLength(3);
    expect(weakKeys[0].key).toBe('b'); // total count: 2 + 3 = 5
    expect(weakKeys[0].count).toBe(5);
    expect(weakKeys[1].key).toBe('p'); // total count: 4
    expect(weakKeys[1].count).toBe(4);
    expect(weakKeys[2].key).toBe('r'); // total count: 1
    expect(weakKeys[2].count).toBe(1);
  });

  it('generates a targeted weak keys passage using the extracted keys', () => {
    const mockHistory: PracticeSessionRecord[] = [
      {
        id: 's1',
        timestamp: Date.now(),
        mode: 'timed',
        difficulty: 'beginner',
        category: 'conversation',
        passageSnippet: 'test',
        metrics: {
          grossWpm: 40,
          netWpm: 38,
          accuracy: 95,
          finalTextAccuracy: 95,
          cpm: 200,
          totalKeystrokes: 100,
          correctKeystrokes: 95,
          incorrectKeystrokes: 5,
          backspaceCount: 5,
          correctedErrors: 5,
          uncorrectedErrors: 0,
          completedWords: 20,
          totalWords: 20,
          completionPercentage: 100,
          elapsedSeconds: 30,
          samples: [],
          mistakes: {
            'e->r': { expected: 'e', typed: 'r', count: 10 },
          },
        },
      },
    ];

    const drill = generateWeakKeyPassage(mockHistory, 'beginner');
    expect(drill.targetKeys).toContain('e');
    expect(typeof drill.text).toBe('string');
    expect(drill.text.length).toBeGreaterThan(10);
  });
});
