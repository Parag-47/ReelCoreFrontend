import { Mail, AtSign, Calendar, Clock } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Separator } from '@/components/ui/separator';

function formatDate(value: string | null): string {
  if (!value) return 'Not available';
  try {
    return new Date(value).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return value;
  }
}

export function UserOverview() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-1">
      <h2 className="text-xl font-semibold tracking-tight">
        Welcome back, {user.username || user.email}
      </h2>
      <p className="text-sm text-muted-foreground">
        You are signed in with an active server-side session.
      </p>
      <Separator className="my-4" />
      <dl className="space-y-3">
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <dt className="text-sm text-muted-foreground">Email</dt>
          <dd className="ml-auto text-sm font-medium">{user.email}</dd>
        </div>
        <div className="flex items-center gap-3">
          <AtSign className="h-4 w-4 text-muted-foreground" />
          <dt className="text-sm text-muted-foreground">Username</dt>
          <dd className="ml-auto text-sm font-medium">
            {user.username || 'Not set'}
          </dd>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <dt className="text-sm text-muted-foreground">Joined</dt>
          <dd className="ml-auto text-sm font-medium">
            {formatDate(user.createdAt)}
          </dd>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <dt className="text-sm text-muted-foreground">Last login</dt>
          <dd className="ml-auto text-sm font-medium">
            {formatDate(user.lastLoginAt)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
