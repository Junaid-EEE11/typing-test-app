/**
 * Unicode normalization policy:
 * All strings are normalized to Unicode NFC (Canonical Composition)
 * to ensure that combining characters are treated consistently
 * without stripping case, punctuation, or whitespace.
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text.normalize('NFC');
}

/**
 * Computes Levenshtein edit distance between two strings.
 * Uses a single-row DP array for O(min(m,n)) space complexity.
 */
export function calculateLevenshteinDistance(str1: string, str2: string): number {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);

  const len1 = s1.length;
  const len2 = s2.length;

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  // Optimize memory by making s2 the shorter string
  let a = s1;
  let b = s2;
  let m = len1;
  let n = len2;

  if (m < n) {
    a = s2;
    b = s1;
    m = len2;
    n = len1;
  }

  // Row of distances
  const prevRow = new Int32Array(n + 1);
  for (let j = 0; j <= n; j++) {
    prevRow[j] = j;
  }

  for (let i = 1; i <= m; i++) {
    let prevDiagonal = prevRow[0];
    prevRow[0] = i;

    const charA = a.charCodeAt(i - 1);

    for (let j = 1; j <= n; j++) {
      const temp = prevRow[j];
      const charB = b.charCodeAt(j - 1);
      const cost = charA === charB ? 0 : 1;

      prevRow[j] = Math.min(
        prevRow[j] + 1,        // deletion
        prevRow[j - 1] + 1,    // insertion
        prevDiagonal + cost    // substitution
      );

      prevDiagonal = temp;
    }
  }

  return prevRow[n];
}

/**
 * Calculates Final Text Accuracy percentage based on Levenshtein distance.
 * Formula: (1 - distance / max(expected.length, submitted.length)) * 100
 * Clamped strictly to [0, 100].
 * If both expected and submitted are empty, returns 100%.
 * If expected is non-empty and submitted is empty, returns 0%.
 */
export function calculateFinalTextAccuracy(
  expectedText: string,
  submittedText: string
): number {
  const expected = normalizeText(expectedText);
  const submitted = normalizeText(submittedText);

  if (expected.length === 0 && submitted.length === 0) {
    return 100;
  }

  const maxLength = Math.max(expected.length, submitted.length);
  if (maxLength === 0) return 100;

  const distance = calculateLevenshteinDistance(expected, submitted);
  const rawRatio = 1 - distance / maxLength;
  const accuracy = rawRatio * 100;

  return Math.min(100, Math.max(0, accuracy));
}
