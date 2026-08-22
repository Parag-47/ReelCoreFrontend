import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader as Loader2, CircleCheck as CheckCircle2, Circle as XCircle, MailWarning } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '@/lib/api-client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Brand } from '../components/Brand';
import { ThemeToggle } from '@/components/ThemeToggle';
import { routes } from '@/config/routes';

type VerifyState = 'loading' | 'success' | 'error' | 'missing';

export function VerifyEmailPage() {
  const { verifyEmail, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState<VerifyState>(token ? 'loading' : 'missing');
  const [message, setMessage] = useState<string | null>(null);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    if (!token) {
      setState('missing');
      return;
    }
    ranRef.current = true;

    (async () => {
      try {
        await verifyEmail({ token });
        setState('success');
      } catch (err) {
        setState('error');
        setMessage(
          err instanceof ApiError
            ? err.message
            : 'Verification failed. Please try again.',
        );
      }
    })();
  }, [token, verifyEmail]);

  useEffect(() => {
    if (state === 'success') {
      const t = setTimeout(() => {
        navigate(isAuthenticated ? routes.dashboard : routes.login, {
          replace: true,
        });
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [state, navigate, isAuthenticated]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-6">
          <Brand className="justify-center" />
        </CardHeader>
        <CardContent>
          {state === 'loading' && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <div className="space-y-1">
                <h1 className="text-lg font-semibold tracking-tight">
                  Verifying your email...
                </h1>
                <p className="text-sm text-muted-foreground">
                  Please wait while we confirm your account.
                </p>
              </div>
            </div>
          )}

          {state === 'success' && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-1">
                <h1 className="text-lg font-semibold tracking-tight">
                  Email verified successfully.
                </h1>
                <p className="text-sm text-muted-foreground">
                  Redirecting you to your dashboard...
                </p>
              </div>
            </div>
          )}

          {state === 'error' && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div className="space-y-1">
                <h1 className="text-lg font-semibold tracking-tight">
                  Verification failed
                </h1>
                <p className="text-sm text-muted-foreground">
                  {message ??
                    'The verification link is invalid or has expired.'}
                </p>
              </div>
            </div>
          )}

          {state === 'missing' && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <MailWarning className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h1 className="text-lg font-semibold tracking-tight">
                  Invalid verification link
                </h1>
                <p className="text-sm text-muted-foreground">
                  The verification link is missing a token. Please use the link
                  from your email.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
