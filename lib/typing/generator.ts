import { SENTENCE_DATABASE } from '@/data/sentences';
import { DifficultyLevel, PracticeMode, PracticeSessionRecord, SentenceCategory, SentenceItem } from '@/types/typing';
import { generateWeakKeyPassage } from './weakKeys';

export interface PassageGenerationOptions {
  mode: PracticeMode;
  difficulty?: DifficultyLevel;
  category?: SentenceCategory | 'all';
  includePunctuation?: boolean;
  includeNumbers?: boolean;
  customText?: string;
  seed?: number;
  excludeIds?: string[];
  targetWordCount?: number;
  history?: PracticeSessionRecord[];
}

export interface GeneratedPassage {
  text: string;
  sentenceIds: string[];
  seed: number;
}

/**
 * Simple pseudo-random number generator (LCG) for deterministic selection
 */
export function createSeededRandom(seed: number): () => number {
  let currentSeed = Math.abs(Math.floor(seed)) || 12345;
  return () => {
    currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
    return currentSeed / 4294967296;
  };
}

/**
 * Filter available sentences according to preferences
 */
export function filterSentences(
  pool: SentenceItem[],
  options: {
    difficulty?: DifficultyLevel;
    category?: SentenceCategory | 'all';
    includePunctuation?: boolean;
    includeNumbers?: boolean;
  }
): SentenceItem[] {
  const {
    difficulty,
    category = 'all',
    includePunctuation = true,
    includeNumbers = true,
  } = options;

  return pool.filter((item) => {
    if (difficulty && item.difficulty !== difficulty) {
      return false;
    }
    if (category && category !== 'all' && item.category !== category) {
      return false;
    }
    if (!includeNumbers && /\d/.test(item.text)) {
      return false;
    }
    if (!includePunctuation && /[,;:'"()#%$\-—/]/.test(item.text)) {
      return false;
    }
    return true;
  });
}

/**
 * Generates a practice passage tailored to practice mode and preferences
 */
export function generatePassage(options: PassageGenerationOptions): GeneratedPassage {
  const {
    mode,
    difficulty = 'beginner',
    category = 'all',
    includePunctuation = true,
    includeNumbers = true,
    customText,
    seed = Math.floor(Math.random() * 1000000),
    excludeIds = [],
  } = options;

  // Mode E: Custom Text
  if (mode === 'custom') {
    const sanitized = sanitizeCustomText(customText || '');
    if (sanitized.length > 0) {
      return {
        text: sanitized,
        sentenceIds: ['custom'],
        seed,
      };
    }
    return {
      text: 'TypeFlow helps you improve your typing speed and accuracy through realistic sentences.',
      sentenceIds: ['custom-default'],
      seed,
    };
  }

  // Mode F: Weak Keys Targeted Drill
  if (mode === 'weak_keys') {
    const drill = generateWeakKeyPassage(options.history || [], difficulty);
    return {
      text: drill.text,
      sentenceIds: ['weak-keys-drill'],
      seed,
    };
  }

  const random = createSeededRandom(seed);

  // Filter pool
  let candidates = filterSentences(SENTENCE_DATABASE, {
    difficulty,
    category,
    includePunctuation,
    includeNumbers,
  });

  // Fallback if filters are too strict
  if (candidates.length === 0) {
    candidates = filterSentences(SENTENCE_DATABASE, { difficulty });
  }
  if (candidates.length === 0) {
    candidates = SENTENCE_DATABASE;
  }

  // Filter out recent exclusions to prevent consecutive repetition
  const nonExcluded = candidates.filter((c) => !excludeIds.includes(c.id));
  const activePool = nonExcluded.length > 0 ? nonExcluded : candidates;

  if (mode === 'sentence' || mode === 'accuracy') {
    // Mode B & D: Single sentence
    const selectedIndex = Math.floor(random() * activePool.length);
    const selected = activePool[selectedIndex];
    return {
      text: selected.text,
      sentenceIds: [selected.id],
      seed,
    };
  }

  if (mode === 'paragraph') {
    // Mode C: 3 to 4 related sentences
    const targetCount = 3;
    const selectedSentences: SentenceItem[] = [];
    const usedIds = new Set<string>(excludeIds);

    for (let i = 0; i < targetCount; i++) {
      const remainingPool = candidates.filter((c) => !usedIds.has(c.id));
      const pool = remainingPool.length > 0 ? remainingPool : candidates;
      const idx = Math.floor(random() * pool.length);
      const chosen = pool[idx];
      selectedSentences.push(chosen);
      usedIds.add(chosen.id);
    }

    return {
      text: selectedSentences.map((s) => s.text).join(' '),
      sentenceIds: selectedSentences.map((s) => s.id),
      seed,
    };
  }

  // Mode A: Timed Practice (requires longer passage that can be replenished)
  const initialSentenceCount = options.targetWordCount
    ? Math.max(3, Math.ceil(options.targetWordCount / 10))
    : 6;

  const selectedSentences: SentenceItem[] = [];
  const usedIds = new Set<string>(excludeIds);

  for (let i = 0; i < initialSentenceCount; i++) {
    const remainingPool = candidates.filter((c) => !usedIds.has(c.id));
    const pool = remainingPool.length > 0 ? remainingPool : candidates;
    const idx = Math.floor(random() * pool.length);
    const chosen = pool[idx];
    selectedSentences.push(chosen);
    usedIds.add(chosen.id);
  }

  return {
    text: selectedSentences.map((s) => s.text).join(' '),
    sentenceIds: selectedSentences.map((s) => s.id),
    seed,
  };
}

/**
 * Replenishes a passage by appending new natural sentences seamlessly
 */
export function replenishPassage(
  currentText: string,
  options: {
    difficulty?: DifficultyLevel;
    category?: SentenceCategory | 'all';
    includePunctuation?: boolean;
    includeNumbers?: boolean;
    excludeIds?: string[];
  }
): { addedText: string; newText: string } {
  const {
    difficulty = 'beginner',
    category = 'all',
    includePunctuation = true,
    includeNumbers = true,
    excludeIds = [],
  } = options;

  let candidates = filterSentences(SENTENCE_DATABASE, {
    difficulty,
    category,
    includePunctuation,
    includeNumbers,
  });

  if (candidates.length === 0) {
    candidates = SENTENCE_DATABASE;
  }

  const nonExcluded = candidates.filter((c) => !excludeIds.includes(c.id));
  const pool = nonExcluded.length > 0 ? nonExcluded : candidates;

  const randomIdx = Math.floor(Math.random() * pool.length);
  const additional = pool[randomIdx];

  const addedText = ` ${additional.text}`;
  const newText = `${currentText}${addedText}`;

  return { addedText, newText };
}

/**
 * Sanitizes and normalizes custom user-provided text safely:
 * - Strips HTML tags and script injections
 * - Collapses multiple spaces and newlines into single spaces
 * - Enforces length limits (up to 3000 chars)
 */
export function sanitizeCustomText(rawText: string): string {
  if (!rawText) return '';
  const noHtml = rawText.replace(/<[^>]*>?/gm, ' ');
  const normalizedSpaces = noHtml.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ');
  return normalizedSpaces.trim().slice(0, 3000);
}
