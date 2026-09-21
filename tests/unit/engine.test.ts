import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TypingEngine } from '@/lib/typing/engine';

describe('TypingEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes in idle state and starts on first keypress', () => {
    const onStatusChange = vi.fn();
    const engine = new TypingEngine({
      initialText: 'Hello world',
      mode: 'sentence',
      onStatusChange,
    });

    expect(engine.getStatus()).toBe('idle');
    expect(engine.getCursorIndex()).toBe(0);

    const handled = engine.handleKeyInput('H');
    expect(handled).toBe(true);
    expect(engine.getStatus()).toBe('running');
    expect(onStatusChange).toHaveBeenCalledWith('running');
    expect(engine.getCursorIndex()).toBe(1);

    engine.destroy();
  });

  it('tracks correct and incorrect keystrokes and mistakes', () => {
    const engine = new TypingEngine({
      initialText: 'Hello world',
      mode: 'sentence',
    });

    engine.handleKeyInput('H'); // correct
    engine.handleKeyInput('a'); // wrong, expected 'e'

    const metrics = engine.getMetrics();
    expect(metrics.correctKeystrokes).toBe(1);
    expect(metrics.incorrectKeystrokes).toBe(1);
    expect(metrics.totalKeystrokes).toBe(2);

    const mistakes = engine.getMistakes();
    expect(mistakes['e->a']).toBeDefined();
    expect(mistakes['e->a'].count).toBe(1);

    engine.destroy();
  });

  it('handles backspace correction correctly', () => {
    const engine = new TypingEngine({
      initialText: 'Hello',
      mode: 'sentence',
    });

    engine.handleKeyInput('H');
    engine.handleKeyInput('x'); // typo
    expect(engine.getCursorIndex()).toBe(2);

    engine.handleBackspace();
    expect(engine.getCursorIndex()).toBe(1);
    expect(engine.getTypedText()).toBe('H');

    engine.handleKeyInput('e'); // correct
    expect(engine.getTypedText()).toBe('He');

    const metrics = engine.getMetrics();
    expect(metrics.backspaceCount).toBe(1);
    expect(metrics.uncorrectedErrors).toBe(0);
    expect(metrics.correctedErrors).toBe(1);

    engine.destroy();
  });

  it('rejects pasted multi-character input', () => {
    const engine = new TypingEngine({
      initialText: 'Hello world',
      mode: 'sentence',
    });

    const handled = engine.handleKeyInput('Pasted text string');
    expect(handled).toBe(false);
    expect(engine.getCursorIndex()).toBe(0);

    engine.destroy();
  });

  it('completes sentence mode when full text is typed', () => {
    const onComplete = vi.fn();
    const engine = new TypingEngine({
      initialText: 'Hi',
      mode: 'sentence',
      onComplete,
    });

    engine.handleKeyInput('H');
    engine.handleKeyInput('i');

    expect(engine.getStatus()).toBe('completed');
    expect(onComplete).toHaveBeenCalled();

    engine.destroy();
  });

  it('resets session cleanly', () => {
    const engine = new TypingEngine({
      initialText: 'Hello',
      mode: 'sentence',
    });

    engine.handleKeyInput('H');
    engine.handleKeyInput('e');
    expect(engine.getCursorIndex()).toBe(2);

    engine.reset({ initialText: 'New text' });
    expect(engine.getStatus()).toBe('idle');
    expect(engine.getCursorIndex()).toBe(0);
    expect(engine.getExpectedText()).toBe('New text');

    engine.destroy();
  });
});
