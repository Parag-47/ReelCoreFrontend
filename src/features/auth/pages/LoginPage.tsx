import { AuthCard } from '../components/AuthCard';
import { LoginForm } from '../components/LoginForm';
import { ThemeToggle } from '@/components/ThemeToggle';

export function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <AuthCard title="Welcome back" description="Sign in to your account">
        <LoginForm />
      </AuthCard>
    </div>
  );
}
