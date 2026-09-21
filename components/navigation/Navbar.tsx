'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Keyboard,
  BarChart3,
  History,
  Settings,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '../ui/Button';
import { UserPreferences } from '@/types/typing';
import { saveUserPreferences } from '@/lib/storage/localStorage';

interface NavbarProps {
  preferences?: UserPreferences;
  onPreferencesChange?: (prefs: UserPreferences) => void;
  onOpenCommandPalette?: () => void;
}

export function Navbar({ preferences, onPreferencesChange, onOpenCommandPalette }: NavbarProps) {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Practice', icon: Keyboard },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/history', label: 'History', icon: History },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const toggleSound = () => {
    if (!preferences || !onPreferencesChange) return;
    const updated = {
      ...preferences,
      soundEnabled: !preferences.soundEnabled,
    };
    saveUserPreferences(updated);
    onPreferencesChange(updated);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-text-main group focus-ring rounded-lg px-2 py-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-sky-300 flex items-center justify-center text-background shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-slate-900" />
          </div>
          <span className="flex items-center font-extrabold tracking-tight">
            Type<span className="text-primary">Flow</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors focus-ring',
                  isActive
                    ? 'bg-primary-muted text-primary font-semibold'
                    : 'text-text-muted hover:text-text-main hover:bg-surface-subtle'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Controls (Command, Sound, Theme) */}
        <div className="hidden md:flex items-center gap-2">
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text-muted hover:text-text-main hover:bg-surface focus-ring"
              title="Command Palette (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Commands</span>
              <kbd className="px-1.5 py-0.2 rounded bg-surface border border-border text-[10px] font-mono">
                ⌘K
              </kbd>
            </button>
          )}

          {preferences && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSound}
              aria-label={preferences.soundEnabled ? 'Mute sound' : 'Unmute sound'}
              className="p-2 rounded-lg text-text-muted hover:text-text-main"
            >
              {preferences.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-primary" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
            className="p-2 rounded-lg text-text-muted hover:text-text-main"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {preferences && (
            <button
              onClick={toggleSound}
              aria-label="Toggle sound"
              className="p-2 rounded-lg text-text-muted"
            >
              {preferences.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-primary" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
          )}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-text-muted"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
            className="p-2 rounded-lg text-text-main focus-ring"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 pt-2 pb-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors',
                  isActive
                    ? 'bg-primary-muted text-primary'
                    : 'text-text-muted hover:text-text-main hover:bg-surface-subtle'
                )}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
