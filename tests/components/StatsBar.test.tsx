import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { StatsBar } from '@/components/typing/StatsBar';
import { TypingMetrics } from '@/types/typing';

describe('StatsBar component', () => {
  it('renders stats properly with valid metrics', () => {
    const mockMetrics: TypingMetrics = {
      grossWpm: 45,
      netWpm: 42,
      accuracy: 96.5,
      finalTextAccuracy: 98,
      cpm: 210,
      totalKeystrokes: 150,
      correctKeystrokes: 145,
      incorrectKeystrokes: 5,
      backspaceCount: 4,
      correctedErrors: 4,
      uncorrectedErrors: 1,
      completedWords: 30,
      totalWords: 35,
      completionPercentage: 85,
      elapsedSeconds: 40,
      samples: [],
      mistakes: {},
    };

    render(
      <StatsBar
        metrics={mockMetrics}
        mode="timed"
        remainingSeconds={20}
        elapsedSeconds={40}
        durationTargetSeconds={60}
      />
    );

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('96.5%')).toBeInTheDocument();
    expect(screen.getByText('20s')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders default values when metrics are null initially', () => {
    render(
      <StatsBar
        metrics={null}
        mode="sentence"
        remainingSeconds={null}
        elapsedSeconds={0}
      />
    );

    expect(screen.getByText('Net WPM')).toBeInTheDocument();
    expect(screen.getByText('100.0%')).toBeInTheDocument();
    expect(screen.getByText('0s')).toBeInTheDocument();
  });
});
