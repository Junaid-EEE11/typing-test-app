import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { VirtualKeyboard } from '@/components/typing/VirtualKeyboard';

describe('VirtualKeyboard component', () => {
  it('renders keyboard keys and next-key indicator', () => {
    render(
      <VirtualKeyboard
        nextChar="a"
        activeChar=""
        weakKeys={[{ key: 'p', count: 3 }]}
        showFingerColors={true}
      />
    );

    // Verify next key is indicated
    expect(screen.getByText('Next Key:')).toBeInTheDocument();
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getAllByText('Left Pinky').length).toBeGreaterThan(0);

    // Verify space key label
    expect(screen.getByText('Spacebar')).toBeInTheDocument();
  });

  it('renders space guidance accurately', () => {
    render(
      <VirtualKeyboard
        nextChar=" "
        activeChar=""
        showFingerColors={true}
      />
    );

    expect(screen.getByText('␣ Space')).toBeInTheDocument();
    expect(screen.getAllByText('Thumb').length).toBeGreaterThan(0);
  });
});
