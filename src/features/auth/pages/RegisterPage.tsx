import { AuthCard } from '../components/AuthCard';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <AuthCard title="Create your account" description="Get started with ReelCore">
        <RegisterForm />
      </AuthCard>
    </div>
  );
}
