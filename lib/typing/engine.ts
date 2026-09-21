import { MonotonicTimer } from './timer';
import { computeTypingMetrics } from './metrics';
import { replenishPassage } from './generator';
import {
  DifficultyLevel,
  MistakeDetail,
  PracticeMode,
  SentenceCategory,
  TestStatus,
  TypingMetrics,
  WpmSample,
} from '@/types/typing';

export interface TypingEngineConfig {
  initialText: string;
  mode: PracticeMode;
  difficulty?: DifficultyLevel;
  category?: SentenceCategory | 'all';
  durationSeconds?: number;
  includePunctuation?: boolean;
  includeNumbers?: boolean;
  onStatusChange?: (status: TestStatus) => void;
  onMetricsUpdate?: (metrics: TypingMetrics) => void;
  onComplete?: (metrics: TypingMetrics) => void;
  onReplenishText?: (newFullText: string) => void;
}

export class TypingEngine {
  private config: TypingEngineConfig;
  private expectedText: string;
  private typedText: string = '';
  private status: TestStatus = 'idle';

  private totalKeystrokes: number = 0;
  private correctKeystrokes: number = 0;
  private incorrectKeystrokes: number = 0;
  private backspaceCount: number = 0;

  private mistakes: Record<string, MistakeDetail> = {};
  private samples: WpmSample[] = [];
  private lastSampleSecond: number = 0;

  private timer: MonotonicTimer;
  private elapsedSeconds: number = 0;
  private remainingSeconds: number | null = null;

  constructor(config: TypingEngineConfig) {
    this.config = config;
    this.expectedText = config.initialText;

    const durationSeconds = config.mode === 'timed' ? (config.durationSeconds ?? 60) : undefined;
    this.remainingSeconds = durationSeconds ?? null;

    this.timer = new MonotonicTimer(
      {
        durationSeconds,
        intervalMs: 100,
      },
      {
        onTick: (elapsed, remaining) => this.handleTimerTick(elapsed, remaining),
        onExpire: () => this.handleTimerExpire(),
      }
    );
  }

  public getStatus(): TestStatus {
    return this.status;
  }

  public getExpectedText(): string {
    return this.expectedText;
  }

  public getTypedText(): string {
    return this.typedText;
  }

  public getCursorIndex(): number {
    return this.typedText.length;
  }

  public getElapsedSeconds(): number {
    return this.elapsedSeconds;
  }

  public getRemainingSeconds(): number | null {
    return this.remainingSeconds;
  }

  public getSamples(): WpmSample[] {
    return [...this.samples];
  }

  public getMistakes(): Record<string, MistakeDetail> {
    return { ...this.mistakes };
  }

  /**
   * Process a printable character or backspace input
   */
  public handleKeyInput(char: string): boolean {
    if (this.status === 'completed' || this.status === 'cancelled') {
      return false;
    }

    // Ignore pasting or multi-character programmatic insertions
    if (char.length > 1) {
      return false;
    }

    // Start timer on first valid typing input
    if (this.status === 'idle') {
      this.status = 'running';
      this.timer.start();
      this.config.onStatusChange?.('running');
    }

    const currentIndex = this.typedText.length;
    const expectedChar = this.expectedText[currentIndex] ?? '';

    // Keystroke evaluation
    this.totalKeystrokes++;
    const isCorrect = char === expectedChar;

    if (isCorrect) {
      this.correctKeystrokes++;
    } else {
      this.incorrectKeystrokes++;
      // Track mistake detail
      const mistakeKey = `${expectedChar}->${char}`;
      if (!this.mistakes[mistakeKey]) {
        this.mistakes[mistakeKey] = {
          expected: expectedChar,
          typed: char,
          count: 0,
        };
      }
      this.mistakes[mistakeKey].count++;
    }

    this.typedText += char;

    // Check if timed mode needs replenishing passage
    if (this.config.mode === 'timed') {
      const remainingChars = this.expectedText.length - this.typedText.length;
      if (remainingChars < 30) {
        const { newText } = replenishPassage(this.expectedText, {
          difficulty: this.config.difficulty,
          category: this.config.category,
          includePunctuation: this.config.includePunctuation,
          includeNumbers: this.config.includeNumbers,
        });
        this.expectedText = newText;
        this.config.onReplenishText?.(newText);
      }
    }

    // Check completion for non-timed modes
    if (this.config.mode !== 'timed' && this.typedText.length >= this.expectedText.length) {
      this.finish();
      return isCorrect;
    }

    this.notifyMetricsUpdate();
    return isCorrect;
  }

  /**
   * Process Backspace key
   */
  public handleBackspace(): void {
    if (this.status === 'completed' || this.status === 'cancelled') {
      return;
    }

    if (this.typedText.length === 0) {
      return;
    }

    this.backspaceCount++;
    this.typedText = this.typedText.slice(0, -1);
    this.notifyMetricsUpdate();
  }

  /**
   * Compute current live or final metrics
   */
  public getMetrics(): TypingMetrics {
    return computeTypingMetrics({
      totalKeystrokes: this.totalKeystrokes,
      correctKeystrokes: this.correctKeystrokes,
      incorrectKeystrokes: this.incorrectKeystrokes,
      backspaceCount: this.backspaceCount,
      expectedFullText: this.expectedText,
      submittedText: this.typedText,
      elapsedSeconds: this.elapsedSeconds,
      durationTargetSeconds: this.config.durationSeconds,
      samples: this.samples,
      mistakes: this.mistakes,
      isTimedMode: this.config.mode === 'timed',
    });
  }

  /**
   * Completes the test and triggers callbacks
   */
  public finish(): void {
    if (this.status === 'completed') return;

    this.timer.pause();
    this.status = 'completed';
    this.elapsedSeconds = this.timer.getElapsedSeconds();
    this.remainingSeconds = this.timer.getRemainingSeconds();

    // Final sample capture
    this.recordSample(this.elapsedSeconds);

    const finalMetrics = this.getMetrics();
    this.config.onStatusChange?.('completed');
    this.config.onComplete?.(finalMetrics);
  }

  /**
   * Resets the typing engine with optional new text or configuration
   */
  public reset(newConfig?: Partial<TypingEngineConfig>): void {
    if (newConfig) {
      this.config = { ...this.config, ...newConfig };
    }

    this.expectedText = this.config.initialText;
    this.typedText = '';
    this.status = 'idle';
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.incorrectKeystrokes = 0;
    this.backspaceCount = 0;
    this.mistakes = {};
    this.samples = [];
    this.lastSampleSecond = 0;
    this.elapsedSeconds = 0;

    const durationSeconds = this.config.mode === 'timed' ? (this.config.durationSeconds ?? 60) : undefined;
    this.remainingSeconds = durationSeconds ?? null;

    this.timer.reset(durationSeconds);
    this.config.onStatusChange?.('idle');
  }

  public destroy(): void {
    this.timer.destroy();
  }

  private handleTimerTick(elapsed: number, remaining: number | null): void {
    this.elapsedSeconds = elapsed;
    this.remainingSeconds = remaining;

    // Record performance sample every second
    const currentSecond = Math.floor(elapsed);
    if (currentSecond > this.lastSampleSecond && currentSecond > 0) {
      this.lastSampleSecond = currentSecond;
      this.recordSample(elapsed);
    }

    this.notifyMetricsUpdate();
  }

  private handleTimerExpire(): void {
    this.finish();
  }

  private recordSample(elapsed: number): void {
    const elapsedMinutes = Math.max(0.001, elapsed) / 60;
    const grossWpm = this.totalKeystrokes > 0 ? (this.totalKeystrokes / 5) / elapsedMinutes : 0;
    
    // calculate uncorrected errors for the sample
    let uncorrected = 0;
    const compareLen = Math.min(this.expectedText.length, this.typedText.length);
    for (let i = 0; i < compareLen; i++) {
      if (this.expectedText[i] !== this.typedText[i]) uncorrected++;
    }
    if (this.typedText.length > this.expectedText.length) {
      uncorrected += this.typedText.length - this.expectedText.length;
    }

    const netWpm = this.totalKeystrokes > 0 ? Math.max(0, ((this.totalKeystrokes - uncorrected) / 5) / elapsedMinutes) : 0;
    const accuracy = this.totalKeystrokes > 0 ? (this.correctKeystrokes / this.totalKeystrokes) * 100 : 100;
    const rawCpm = this.totalKeystrokes > 0 ? this.totalKeystrokes / elapsedMinutes : 0;

    this.samples.push({
      time: Math.round(elapsed),
      wpm: Math.round(grossWpm * 10) / 10,
      netWpm: Math.round(netWpm * 10) / 10,
      accuracy: Math.round(accuracy * 10) / 10,
      rawCpm: Math.round(rawCpm * 10) / 10,
    });
  }

  private notifyMetricsUpdate(): void {
    if (this.config.onMetricsUpdate) {
      this.config.onMetricsUpdate(this.getMetrics());
    }
  }
}
