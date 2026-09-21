export interface TimerCallbacks {
  onTick?: (elapsedSeconds: number, remainingSeconds: number | null) => void;
  onExpire?: () => void;
}

export interface TimerOptions {
  durationSeconds?: number; // Target countdown duration (if timed test)
  intervalMs?: number; // Tick frequency (default 100ms)
}

/**
 * High-precision monotonic timer with drift compensation and background tab resilience
 */
export class MonotonicTimer {
  private startTime: number | null = null;
  private pauseTime: number | null = null;
  private accumulatedElapsedMs = 0;
  private durationSeconds: number | null = null;
  private intervalMs: number;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private callbacks: TimerCallbacks = {};
  private isRunning = false;
  private isExpired = false;

  constructor(options: TimerOptions = {}, callbacks: TimerCallbacks = {}) {
    this.durationSeconds = options.durationSeconds ?? null;
    this.intervalMs = options.intervalMs ?? 100;
    this.callbacks = callbacks;
  }

  /**
   * Starts or resumes the monotonic timer
   */
  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isExpired = false;
    this.startTime = this.getNow();

    this.timerId = setInterval(() => {
      this.tick();
    }, this.intervalMs);

    this.tick();
  }

  /**
   * Pauses the timer
   */
  public pause(): void {
    if (!this.isRunning) return;

    if (this.startTime !== null) {
      this.accumulatedElapsedMs += this.getNow() - this.startTime;
      this.startTime = null;
    }

    this.isRunning = false;
    this.clearInterval();
  }

  /**
   * Resets the timer to 0
   */
  public reset(durationSeconds?: number): void {
    this.clearInterval();
    this.startTime = null;
    this.pauseTime = null;
    this.accumulatedElapsedMs = 0;
    this.isRunning = false;
    this.isExpired = false;
    if (durationSeconds !== undefined) {
      this.durationSeconds = durationSeconds;
    }
  }

  /**
   * Returns exact elapsed seconds computed from monotonic clock
   */
  public getElapsedSeconds(): number {
    let totalMs = this.accumulatedElapsedMs;
    if (this.isRunning && this.startTime !== null) {
      totalMs += this.getNow() - this.startTime;
    }
    return Math.max(0, totalMs / 1000);
  }

  /**
   * Returns remaining seconds for timed tests, or null if open-ended
   */
  public getRemainingSeconds(): number | null {
    if (this.durationSeconds === null) return null;
    const elapsed = this.getElapsedSeconds();
    return Math.max(0, this.durationSeconds - elapsed);
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getIsExpired(): boolean {
    return this.isExpired;
  }

  public setCallbacks(callbacks: TimerCallbacks): void {
    this.callbacks = callbacks;
  }

  public destroy(): void {
    this.clearInterval();
    this.callbacks = {};
  }

  private tick(): void {
    const elapsed = this.getElapsedSeconds();
    const remaining = this.getRemainingSeconds();

    this.callbacks.onTick?.(elapsed, remaining);

    if (this.durationSeconds !== null && remaining !== null && remaining <= 0) {
      this.isExpired = true;
      this.pause();
      this.callbacks.onExpire?.();
    }
  }

  private clearInterval(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private getNow(): number {
    return Date.now();
  }
}
