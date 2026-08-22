import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Brand } from '@/features/auth/components/Brand';
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
      // logout() clears local state even on network failure
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
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <UserOverview />

        <Separator className="my-6" />

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthenticatedCard />
          <ProviderCard provider={providerLabel} />
          <AccountCard verified={user?.isVerified ?? false} />
          <StatusCard />
        </div>
      </main>
    </div>
  );
}
