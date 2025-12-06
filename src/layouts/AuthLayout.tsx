import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AuthLayout = () => {
  const { isAuth } = useAuth();
  
  // If user is already authenticated, redirect to dashboard
  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Panel de Administración
          </h2>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
