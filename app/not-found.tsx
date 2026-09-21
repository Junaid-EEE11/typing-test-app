import Link from 'next/link';
import { Sparkles, Keyboard, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-text-main text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold font-mono tracking-tight text-primary">404</h1>
          <h2 className="text-xl font-bold text-text-main">Page Not Found</h2>
          <p className="text-sm text-text-muted">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Button variant="primary" leftIcon={<Keyboard className="w-4 h-4" />}>
              Back to Practice
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
