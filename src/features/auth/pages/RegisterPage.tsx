import { AuthCard } from '../components/AuthCard';
import { RegisterForm } from '../components/RegisterForm';
import { ThemeToggle } from '@/components/ThemeToggle';

export function RegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <AuthCard title="Create your account" description="Get started with ReelCore">
        <RegisterForm />
      </AuthCard>
    </div>
  );
}
