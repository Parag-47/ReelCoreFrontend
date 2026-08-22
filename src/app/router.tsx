import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/features/auth/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageLoader } from '@/components/PageLoader';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmailPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { routes } from '@/config/routes';

function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  return (
    <Navigate to={isAuthenticated ? routes.dashboard : routes.login} replace />
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path={routes.root} element={<RootRedirect />} />
          <Route path={routes.login} element={<LoginPage />} />
          <Route path={routes.register} element={<RegisterPage />} />
          <Route path={routes.verifyEmail} element={<VerifyEmailPage />} />
          <Route
            path={routes.dashboard}
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={routes.root} replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
