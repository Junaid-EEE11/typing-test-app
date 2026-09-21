/**
 * Formats seconds into MM:SS or S format
 */
export function formatDuration(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  return `${secs}s`;
}

/**
 * Formats total seconds into human-readable practice time (e.g., "1h 15m" or "4m 20s")
 */
export function formatTotalPracticeTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Formats a timestamp into a localized date/time string
 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats a timestamp into a short date (e.g., "Sep 20")
 */
export function formatShortDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats WPM display value
 */
export function formatWpm(wpm: number, decimals: number = 0): string {
  if (isNaN(wpm) || !isFinite(wpm) || wpm < 0) return '0';
  return decimals === 0 ? Math.round(wpm).toString() : wpm.toFixed(decimals);
}

/**
 * Formats accuracy percentage
 */
export function formatAccuracy(accuracy: number, decimals: number = 1): string {
  if (isNaN(accuracy) || !isFinite(accuracy) || accuracy < 0) return '0%';
  const clamped = Math.min(100, Math.max(0, accuracy));
  return `${clamped.toFixed(decimals)}%`;
}
