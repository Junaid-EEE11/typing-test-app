'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { sanitizeCustomText } from '@/lib/typing/generator';
import { FileText, Sparkles } from 'lucide-react';

interface CustomTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyText: (text: string) => void;
  initialText?: string;
}

export function CustomTextModal({
  isOpen,
  onClose,
  onApplyText,
  initialText = '',
}: CustomTextModalProps) {
  const [text, setText] = useState(initialText);
  const sanitized = sanitizeCustomText(text);
  const charCount = sanitized.length;
  const wordCount = sanitized ? sanitized.split(/\s+/).length : 0;

  const handleApply = () => {
    if (charCount < 5) return;
    onApplyText(sanitized);
    onClose();
  };

  const samplePresets = [
    'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    'Clear thinking requires courage rather than intelligence. Write down your thoughts to clarify your mind.',
    'Technology is best when it brings people together and empowers meaningful collaboration.',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Custom Practice Passage"
      description="Paste or type any text you want to practice. All HTML is safely stripped."
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="custom-text-area" className="sr-only">
            Custom Practice Text
          </label>
          <textarea
            id="custom-text-area"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your custom paragraph, article, or notes here..."
            className="w-full bg-surface-subtle border border-border rounded-xl p-3.5 text-sm text-text-main placeholder-text-muted focus-ring resize-none"
            maxLength={3000}
          />
        </div>

        {/* Counter and presets */}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-3">
            <span>{charCount} / 3000 chars</span>
            <span>•</span>
            <span>{wordCount} words</span>
          </div>

          <button
            type="button"
            onClick={() => setText('')}
            className="hover:text-text-main transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Quick sample presets */}
        <div>
          <div className="text-xs font-semibold text-text-muted mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Or try a quick preset:</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setText(preset)}
                className="text-left text-xs p-2 rounded-lg bg-surface-subtle hover:bg-surface border border-border/60 text-text-muted hover:text-text-main transition-colors truncate"
              >
                "{preset}"
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleApply}
            disabled={charCount < 5}
            leftIcon={<FileText className="w-4 h-4" />}
          >
            Use Custom Text
          </Button>
        </div>
      </div>
    </Modal>
  );
}
