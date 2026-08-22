import { Loader2, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PasskeyButtonProps {
  onClick: () => Promise<void>;
  disabled?: boolean;
}

export function PasskeyButton({ onClick, disabled }: PasskeyButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={onClick}
      disabled={disabled}
    >
      <Fingerprint className="h-4 w-4" />
      Continue with Passkey
    </Button>
  );
}

export function PasskeyButtonLoading() {
  return (
    <Button type="button" variant="outline" className="w-full" disabled>
      <Loader2 className="h-4 w-4 animate-spin" />
      Waiting for passkey...
    </Button>
  );
}
