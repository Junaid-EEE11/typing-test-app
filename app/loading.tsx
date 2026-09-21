import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text-muted space-y-4">
      <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-mono tracking-wider uppercase text-text-subtle">
        Loading TypeFlow...
      </p>
    </div>
  );
}
