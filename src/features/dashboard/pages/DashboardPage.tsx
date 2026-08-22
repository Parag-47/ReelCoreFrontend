import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader as Loader2, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Brand } from '@/features/auth/components/Brand';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserOverview } from '../components/UserOverview';
import {
  AuthenticatedCard,
  ProviderCard,
  AccountCard,
  StatusCard,
} from '../components/InfoCards';
import { routes } from '@/config/routes';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      navigate(routes.login, { replace: true });
    } catch {
      navigate(routes.login, { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  }

  const providerLabel = user?.authProvider
    ? user.authProvider.charAt(0).toUpperCase() + user.authProvider.slice(1)
    : 'Email';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Brand />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <UserOverview />

        <Separator className="my-6" />

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthenticatedCard />
          <ProviderCard provider={providerLabel} />
          <AccountCard verified={user?.emailVerified ?? false} />
          <StatusCard status={user?.status ?? 'active'} />
        </div>
      </main>
    </div>
  );
}
