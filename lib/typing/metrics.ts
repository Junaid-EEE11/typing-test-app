import { calculateFinalTextAccuracy, normalizeText } from './levenshtein';
import { MistakeDetail, TypingMetrics, WpmSample } from '@/types/typing';

export interface ComputeMetricsParams {
  totalKeystrokes: number; // Total printable characters typed (excluding Backspace)
  correctKeystrokes: number; // Printable keystrokes that matched expected char at time of typing
  incorrectKeystrokes: number; // Printable keystrokes that were wrong at time of typing
  backspaceCount: number; // Number of backspace key presses
  expectedFullText: string; // The complete expected passage
  submittedText: string; // The final buffer content typed by the user
  elapsedSeconds: number; // Monotonic elapsed seconds (> 0)
  durationTargetSeconds?: number;
  samples?: WpmSample[];
  mistakes?: Record<string, MistakeDetail>;
  isTimedMode?: boolean;
}

/**
 * Calculates typing evaluation metrics with mathematical precision.
 * Adheres strictly to the typing engine specifications:
 * - Gross WPM = Total printable characters entered / 5 / elapsed minutes
 * - Net WPM = max(0, (total printable characters entered - uncorrected errors) / 5 / elapsed minutes)
 * - Keystroke Accuracy = (correct printable keystrokes / total printable keystrokes) * 100
 * - Final Text Accuracy = (1 - Levenshtein distance / max(expectedLength, submittedLength)) * 100
 */
export function computeTypingMetrics(params: ComputeMetricsParams): TypingMetrics {
  const {
    totalKeystrokes,
    correctKeystrokes,
    incorrectKeystrokes,
    backspaceCount,
    expectedFullText,
    submittedText,
    elapsedSeconds,
    durationTargetSeconds,
    samples = [],
    mistakes = {},
    isTimedMode = false,
  } = params;

  const safeElapsedSeconds = Math.max(0.001, elapsedSeconds);
  const elapsedMinutes = safeElapsedSeconds / 60;

  // Uncorrected errors calculation:
  // Compare current submittedText against the corresponding prefix of expectedFullText
  const normalizedExpected = normalizeText(expectedFullText);
  const normalizedSubmitted = normalizeText(submittedText);

  let uncorrectedErrors = 0;
  const compareLen = Math.min(normalizedExpected.length, normalizedSubmitted.length);
  for (let i = 0; i < compareLen; i++) {
    if (normalizedExpected[i] !== normalizedSubmitted[i]) {
      uncorrectedErrors++;
    }
  }
  // Any extra submitted characters beyond expected length are also uncorrected errors
  if (normalizedSubmitted.length > normalizedExpected.length) {
    uncorrectedErrors += normalizedSubmitted.length - normalizedExpected.length;
  }

  // Corrected errors = errors that were made during keystrokes but are no longer in the final buffer
  // Note: max(0, incorrectKeystrokes - uncorrectedErrors)
  const correctedErrors = Math.max(0, incorrectKeystrokes - uncorrectedErrors);

  // Gross WPM
  const grossWpm = elapsedMinutes > 0 && totalKeystrokes > 0
    ? (totalKeystrokes / 5) / elapsedMinutes
    : 0;

  // Net WPM (Clamped to 0 minimum)
  const netWpm = elapsedMinutes > 0 && totalKeystrokes > 0
    ? Math.max(0, ((totalKeystrokes - uncorrectedErrors) / 5) / elapsedMinutes)
    : 0;

  // Characters per minute (CPM)
  const cpm = elapsedMinutes > 0 && totalKeystrokes > 0
    ? totalKeystrokes / elapsedMinutes
    : 0;

  // Keystroke Accuracy (Based on all printable keystrokes)
  const accuracy = totalKeystrokes > 0
    ? Math.min(100, Math.max(0, (correctKeystrokes / totalKeystrokes) * 100))
    : 100;

  // Final Text Accuracy (Levenshtein based)
  let expectedAttemptedText = normalizedExpected;
  if (isTimedMode && normalizedSubmitted.length < normalizedExpected.length) {
    // For timed tests that ended early, compare submitted text against the attempted prefix
    expectedAttemptedText = normalizedExpected.slice(0, normalizedSubmitted.length);
  }
  const finalTextAccuracy = calculateFinalTextAccuracy(
    expectedAttemptedText,
    normalizedSubmitted
  );

  // Completed words calculation (counting words cleanly delimited in submitted text)
  const trimmedSubmitted = normalizedSubmitted.trim();
  const completedWords = trimmedSubmitted.length > 0
    ? trimmedSubmitted.split(/\s+/).length
    : 0;

  const totalWords = normalizedExpected.trim().length > 0
    ? normalizedExpected.trim().split(/\s+/).length
    : 0;

  // Completion percentage
  const completionPercentage = normalizedExpected.length > 0
    ? Math.min(100, Math.max(0, (normalizedSubmitted.length / normalizedExpected.length) * 100))
    : 100;

  return {
    grossWpm: Math.round(grossWpm * 100) / 100,
    netWpm: Math.round(netWpm * 100) / 100,
    accuracy: Math.round(accuracy * 10) / 10,
    finalTextAccuracy: Math.round(finalTextAccuracy * 10) / 10,
    cpm: Math.round(cpm * 10) / 10,
    totalKeystrokes,
    correctKeystrokes,
    incorrectKeystrokes,
    backspaceCount,
    correctedErrors,
    uncorrectedErrors,
    completedWords,
    totalWords,
    completionPercentage: Math.round(completionPercentage * 10) / 10,
    elapsedSeconds: Math.round(safeElapsedSeconds * 100) / 100,
    durationTargetSeconds,
    samples,
    mistakes,
  };
}

/**
 * Generates insightful, encouraging feedback based on metrics and historical trends
 */
export function generateFeedback(
  metrics: TypingMetrics,
  previousSession?: { netWpm: number; accuracy: number }
): string[] {
  const feedback: string[] = [];
  const { netWpm, accuracy, correctedErrors, uncorrectedErrors, mistakes } = metrics;

  // Accuracy-driven guidance
  if (accuracy >= 98) {
    feedback.push(
      `Outstanding accuracy of ${accuracy}%! Your precision is excellent. You can comfortably push your speed now.`
    );
  } else if (accuracy >= 95) {
    feedback.push(
      `Great job maintaining ${accuracy}% accuracy. Aim for 98% to build solid muscle memory.`
    );
  } else if (accuracy < 90) {
    feedback.push(
      `Your accuracy was ${accuracy}%. Prioritize typing without looking at the keyboard and slow down slightly to eliminate errors.`
    );
  }

  // Mistake corrections
  if (correctedErrors > 3 && uncorrectedErrors === 0) {
    feedback.push(
      `You caught and corrected all ${correctedErrors} mistakes! Great vigilance.`
    );
  } else if (uncorrectedErrors > 3) {
    feedback.push(
      `You had ${uncorrectedErrors} uncorrected errors. Try using Backspace immediately when you feel a mistype.`
    );
  }

  // Frequent mistake keys
  const topMistakes = Object.values(mistakes)
    .sort((a, b) => b.count - a.count)
    .slice(0, 2);

  if (topMistakes.length > 0 && topMistakes[0].count >= 2) {
    const errorChars = topMistakes
      .map((m) => `"${m.expected}" (typed "${m.typed}")`)
      .join(' and ');
    feedback.push(`Key areas to watch: struggled with ${errorChars}.`);
  }

  // Comparison with previous session
  if (previousSession && typeof previousSession.netWpm === 'number') {
    const wpmDiff = Math.round(netWpm - previousSession.netWpm);
    if (wpmDiff > 0) {
      feedback.push(`Your speed improved by +${wpmDiff} WPM compared to your previous session!`);
    } else if (wpmDiff < -3) {
      feedback.push(`A bit slower than your previous test (-${Math.abs(wpmDiff)} WPM), but consistency matters most!`);
    }
  }

  return feedback;
}
