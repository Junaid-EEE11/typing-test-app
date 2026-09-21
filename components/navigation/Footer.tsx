import React from 'react';
import { ShieldCheck, Sparkles, Command } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center text-primary">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="font-medium text-text-main">TypeFlow</span>
          <span>• Realistic typing practice for everyone</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border text-[10px] font-mono font-semibold">
              Tab
            </kbd>
            <span>Restart</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border text-[10px] font-mono font-semibold">
              Esc
            </kbd>
            <span>Reset</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Private (Local Storage)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
