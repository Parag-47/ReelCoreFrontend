import { ShieldCheck, KeyRound, CircleUser as UserCircle, BadgeCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { DashboardInfo } from '../dashboard.types';

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  info: DashboardInfo;
}

export function InfoCard({ icon, title, info }: InfoCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="text-sm font-semibold">{info.label}</p>
          <p className="text-xs text-muted-foreground">{info.value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function AuthenticatedCard() {
  return (
    <InfoCard
      icon={<ShieldCheck className="h-4 w-4" />}
      title="Authentication"
      info={{ label: 'Authenticated', value: 'Server-side session' }}
    />
  );
}

export function ProviderCard({ provider }: { provider: string }) {
  return (
    <InfoCard
      icon={<KeyRound className="h-4 w-4" />}
      title="Provider"
      info={{ label: provider, value: 'Sign-in method' }}
    />
  );
}

export function AccountCard({ verified }: { verified: boolean }) {
  return (
    <InfoCard
      icon={<UserCircle className="h-4 w-4" />}
      title="Account"
      info={{
        label: verified ? 'Verified' : 'Not verified',
        value: 'Email verification status',
      }}
    />
  );
}

export function StatusCard({ status }: { status: string }) {
  return (
    <InfoCard
      icon={<BadgeCheck className="h-4 w-4" />}
      title="Status"
      info={{
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: 'Account status',
      }}
    />
  );
}
