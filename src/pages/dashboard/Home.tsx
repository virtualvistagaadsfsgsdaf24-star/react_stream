import React from 'react';
import Main from '../../layouts/Main';
import { useHome } from '../../hooks/dashboard/useHome';

const Home: React.FC = () => {
  const { t, session } = useHome();

  if (!session) return null;

  return (
    <Main>
      <div className="flex h-full flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {t('dashboard_title')}
          </h1>
          <p className="text-sm text-neutral-500">
            {t('dashboard_subtitle')}
          </p>
        </div>
        
        <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 text-neutral-400 min-h-[400px]">
          {t('dashboard_placeholder')}
        </div>
      </div>
    </Main>
  );
};

export default Home;