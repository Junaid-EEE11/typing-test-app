'use client';

import React, { useState } from 'react';
import { Download, Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { downloadCsv, generateHistoryCsv } from '@/lib/storage/localStorage';
import { PracticeSessionRecord } from '@/types/typing';

interface ExportControlsProps {
  history: PracticeSessionRecord[];
  onClearHistory: () => void;
}

export function ExportControls({ history, onClearHistory }: ExportControlsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleExport = () => {
    if (history.length === 0) return;
    const csvContent = generateHistoryCsv(history);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadCsv(`typeflow-history-${dateStr}.csv`, csvContent);
  };

  const handleConfirmClear = () => {
    onClearHistory();
    setConfirmOpen(false);
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Button
        variant="secondary"
        size="sm"
        disabled={history.length === 0}
        onClick={handleExport}
        leftIcon={<Download className="w-4 h-4" />}
      >
        Export History (CSV)
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={history.length === 0}
        onClick={() => setConfirmOpen(true)}
        leftIcon={<Trash2 className="w-4 h-4 text-red-400" />}
        className="hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
      >
        Clear History
      </Button>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Clear Practice History?"
        description="This will permanently delete all saved typing sessions from your browser storage. This action cannot be undone."
      >
        <div className="space-y-4 pt-2">
          <div className="flex items-start gap-3 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
            <p>
              Your local typing stats, streaks, and personal records will be reset. Make sure to export your CSV first if you want a backup.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmClear}>
              Yes, Clear History
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
