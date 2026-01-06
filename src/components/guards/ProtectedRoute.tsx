import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getStorage } from '../../utils/storage';
import type { AuthSession } from '../../types/auth';


const ProtectedRoute: React.FC = () => {
  const companySession = getStorage('company_session');
  const session = getStorage<AuthSession>('auth_session');

  if (!companySession || !session || !session.token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;