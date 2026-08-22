import { AuthCard } from '../components/AuthCard';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <AuthCard title="Welcome back" description="Sign in to your account">
        <LoginForm />
      </AuthCard>
    </div>
  );
}
