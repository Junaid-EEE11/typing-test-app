import { SENTENCE_DATABASE } from '@/data/sentences';
import { DifficultyLevel, PracticeSessionRecord } from '@/types/typing';

export interface WeakKeyStats {
  key: string;
  count: number;
  expectedKey: string;
  typedKey: string;
}

/**
 * Extracts the user's most frequently mistyped keys across historical sessions
 */
export function extractWeakKeys(
  history: PracticeSessionRecord[],
  limit = 5
): { key: string; count: number }[] {
  const counts: Record<string, number> = {};

  for (const session of history) {
    if (!session.metrics?.mistakes) continue;
    for (const detail of Object.values(session.metrics.mistakes)) {
      if (!detail.expected) continue;
      const char = detail.expected.toLowerCase();
      // Ignore spaces for weak key character drills
      if (char === ' ' || char === '\n' || char === '\t') continue;
      counts[char] = (counts[char] || 0) + detail.count;
    }
  }

  return Object.entries(counts)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Finds realistic sentences from the database that emphasize the target weak keys
 */
export function generateWeakKeyPassage(
  history: PracticeSessionRecord[],
  difficulty: DifficultyLevel = 'beginner'
): { text: string; targetKeys: string[] } {
  const weakKeys = extractWeakKeys(history, 4).map((w) => w.key);

  // If user has no historical mistakes yet, use common troublesome letters
  const activeTargetKeys =
    weakKeys.length > 0 ? weakKeys : ['p', 'q', 'b', 'v', 'z'];

  // Score sentences by density of target characters
  const candidates = SENTENCE_DATABASE.filter(
    (s) => s.difficulty === difficulty || difficulty === 'beginner'
  );

  const scored = candidates.map((sentence) => {
    const lower = sentence.text.toLowerCase();
    let matchCount = 0;
    for (const key of activeTargetKeys) {
      const occurrences = lower.split(key).length - 1;
      matchCount += occurrences;
    }
    const score = matchCount / Math.max(1, sentence.charCount);
    return { sentence, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Take top 2-3 sentences to form a coherent drill
  const topSentences = scored.slice(0, 2).map((item) => item.sentence.text);
  const drillText = topSentences.join(' ');

  return {
    text: drillText || 'Practice focusing on smooth finger rhythm and precise keystrokes.',
    targetKeys: activeTargetKeys,
  };
}
