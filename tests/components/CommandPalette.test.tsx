import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CommandPalette } from '@/components/navigation/CommandPalette';

// Mock Next.js navigation router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/',
}));

describe('CommandPalette component', () => {
  it('renders commands when open and filters by search query', () => {
    const onSelectMode = vi.fn();
    const onClose = vi.fn();

    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        onSelectMode={onSelectMode}
      />
    );

    expect(screen.getByPlaceholderText('Type a command or search...')).toBeInTheDocument();
    expect(screen.getByText('Switch to Timed Practice')).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Type a command or search...');
    fireEvent.change(input, { target: { value: 'Weak' } });

    expect(screen.getByText('Start Weak Keys Targeted Drill')).toBeInTheDocument();
    expect(screen.queryByText('Switch to Timed Practice')).not.toBeInTheDocument();

    // Click command
    fireEvent.click(screen.getByText('Start Weak Keys Targeted Drill'));
    expect(onSelectMode).toHaveBeenCalledWith('weak_keys');
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <CommandPalette isOpen={false} onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });
});
