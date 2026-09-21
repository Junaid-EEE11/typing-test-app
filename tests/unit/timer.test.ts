import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MonotonicTimer } from '@/lib/typing/timer';

describe('MonotonicTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts and accumulates elapsed time', () => {
    const onTick = vi.fn();
    const timer = new MonotonicTimer({ intervalMs: 100 }, { onTick });

    expect(timer.getIsRunning()).toBe(false);
    expect(timer.getElapsedSeconds()).toBe(0);

    timer.start();
    expect(timer.getIsRunning()).toBe(true);

    vi.advanceTimersByTime(1000);
    expect(timer.getElapsedSeconds()).toBeGreaterThanOrEqual(1);
    expect(onTick).toHaveBeenCalled();

    timer.pause();
    expect(timer.getIsRunning()).toBe(false);

    timer.destroy();
  });

  it('triggers onExpire when duration countdown expires', () => {
    const onExpire = vi.fn();
    const timer = new MonotonicTimer({ durationSeconds: 5, intervalMs: 100 }, { onExpire });

    timer.start();
    vi.advanceTimersByTime(5100);

    expect(onExpire).toHaveBeenCalled();
    expect(timer.getIsExpired()).toBe(true);

    timer.destroy();
  });

  it('resets time correctly', () => {
    const timer = new MonotonicTimer();
    timer.start();
    vi.advanceTimersByTime(2000);
    expect(timer.getElapsedSeconds()).toBeGreaterThanOrEqual(2);

    timer.reset();
    expect(timer.getElapsedSeconds()).toBe(0);
    expect(timer.getIsRunning()).toBe(false);

    timer.destroy();
  });
});
