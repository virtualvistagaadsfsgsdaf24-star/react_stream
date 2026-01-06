import { useTranslation } from 'react-i18next';
import { getStorage } from '../../utils/storage';
import type { AuthSession } from '../../types/auth';

export const useHome = () => {
  const { t } = useTranslation();
  const session = getStorage<AuthSession>('auth_session');

  return {
    t,
    session
  };
};