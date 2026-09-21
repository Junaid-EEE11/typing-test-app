import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'surface' | 'subtle' | 'elevated';
}

export function Card({
  className,
  variant = 'default',
  children,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-surface border border-border shadow-sm',
    surface: 'bg-surface border border-border',
    subtle: 'bg-surface-subtle border border-border/50',
    elevated: 'bg-surface border border-border/80 shadow-md',
  };

  return (
    <div className={cn('rounded-xl p-5', variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
