import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getStorage } from '../../utils/storage';
import type { AuthSession } from '../../types/auth';

const PublicRoute: React.FC = () => {
  const companySession = getStorage('company_session');
  const session = getStorage<AuthSession>('auth_session');

  if (companySession && session && session.token) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;