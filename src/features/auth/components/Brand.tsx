import { Film } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandProps {
  className?: string;
  showText?: boolean;
}

export function Brand({ className, showText = true }: BrandProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Film className="h-5 w-5" aria-hidden="true" />
      </div>
      {showText && (
        <span className="text-lg font-semibold tracking-tight">ReelCore</span>
      )}
    </div>
  );
}
