import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, MailQuestion } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Brand } from '../components/Brand';
import { routes } from '@/config/routes';

export function VerifyEmailPage() {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isSubmitting || !token.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await verifyEmail({ token: token.trim() });
      navigate(routes.dashboard);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Verification failed. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-6">
          <Brand className="justify-center" />
          <div className="space-y-1.5 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <MailQuestion className="h-5 w-5 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
            <p className="text-sm text-muted-foreground">
              We sent a verification code to your email address.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="verify-token">Verification code</Label>
              <Input
                id="verify-token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter your verification code"
                autoComplete="one-time-code"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting || !token.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Didn't receive it? Check your spam folder or{' '}
            <button
              type="button"
              className="font-medium text-foreground hover:underline"
              onClick={() => navigate(routes.register)}
            >
              try again
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
