import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { GhostPacer } from '@/components/typing/GhostPacer';

describe('GhostPacer component', () => {
  it('renders target pacer and lead/lag status correctly', () => {
    render(
      <GhostPacer
        cursorIndex={50}
        totalLength={100}
        elapsedSeconds={15}
        currentNetWpm={35}
        targetWpm={30}
        status="running"
      />
    );

    expect(screen.getByText('30 WPM')).toBeInTheDocument();
    expect(screen.getByText('+5 WPM ahead')).toBeInTheDocument();
    expect(screen.getByText(/You \(50%\)/)).toBeInTheDocument();
  });

  it('renders nothing when idle or text is empty', () => {
    const { container } = render(
      <GhostPacer
        cursorIndex={0}
        totalLength={0}
        elapsedSeconds={0}
        currentNetWpm={0}
        targetWpm={30}
        status="idle"
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
