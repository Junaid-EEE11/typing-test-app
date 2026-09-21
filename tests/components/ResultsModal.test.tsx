import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ResultsModal } from '@/components/results/ResultsModal';
import { PracticeSessionRecord } from '@/types/typing';

// Mock recharts responsive container for jsdom
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div style={{ width: 500, height: 300 }}>{children}</div>,
  };
});

describe('ResultsModal component', () => {
  it('renders session statistics correctly', () => {
    const mockSession: PracticeSessionRecord = {
      id: 'test-session-1',
      timestamp: Date.now(),
      mode: 'sentence',
      difficulty: 'beginner',
      category: 'conversation',
      passageSnippet: 'I drink a cup of warm tea.',
      metrics: {
        grossWpm: 45,
        netWpm: 40,
        accuracy: 94.5,
        finalTextAccuracy: 97,
        cpm: 225,
        totalKeystrokes: 120,
        correctKeystrokes: 114,
        incorrectKeystrokes: 6,
        backspaceCount: 5,
        correctedErrors: 5,
        uncorrectedErrors: 1,
        completedWords: 24,
        totalWords: 24,
        completionPercentage: 100,
        elapsedSeconds: 32,
        samples: [],
        mistakes: { 'e->r': { expected: 'e', typed: 'r', count: 2 } },
      },
    };

    render(
      <ResultsModal
        session={mockSession}
        onTryAgain={() => {}}
        onNewPassage={() => {}}
      />
    );

    expect(screen.getByText('Session Completed!')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument(); // Net WPM
    expect(screen.getByText('94.5%')).toBeInTheDocument(); // Accuracy
    expect(screen.getByText('32s')).toBeInTheDocument(); // Duration
    expect(screen.getByText('120')).toBeInTheDocument(); // Keystrokes
  });
});
