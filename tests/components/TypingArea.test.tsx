import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TypingArea } from '@/components/typing/TypingArea';

describe('TypingArea component', () => {
  it('renders expected characters and captures key events', () => {
    const onKeyInput = vi.fn();
    const onBackspace = vi.fn();

    render(
      <TypingArea
        expectedText="Hello world"
        typedText="Hel"
        cursorIndex={3}
        status="running"
        onKeyInput={onKeyInput}
        onBackspace={onBackspace}
      />
    );

    const input = screen.getByLabelText('Typing Practice Input');
    expect(input).toBeInTheDocument();

    // Type a key
    fireEvent.keyDown(input, { key: 'l' });
    expect(onKeyInput).toHaveBeenCalledWith('l');

    // Press backspace
    fireEvent.keyDown(input, { key: 'Backspace' });
    expect(onBackspace).toHaveBeenCalled();
  });

  it('rejects pasted text', () => {
    const onKeyInput = vi.fn();
    const onBackspace = vi.fn();

    render(
      <TypingArea
        expectedText="Hello world"
        typedText=""
        cursorIndex={0}
        status="idle"
        onKeyInput={onKeyInput}
        onBackspace={onBackspace}
      />
    );

    const input = screen.getByLabelText('Typing Practice Input');
    fireEvent.paste(input, { clipboardData: { getData: () => 'pasted string' } });

    expect(onKeyInput).not.toHaveBeenCalled();
  });
});
