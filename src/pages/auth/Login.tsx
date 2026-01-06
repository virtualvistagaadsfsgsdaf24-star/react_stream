import React from 'react';
import { useTranslation } from 'react-i18next';
import Auth from '../../layouts/Auth';
import Notification from '../../components/overlays/Notification';
import { useLogin } from '../../hooks/auth/useLogin';

const Login: React.FC = () => {
  const { t } = useTranslation();
  
  const {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    errorMsg,
    setErrorMsg,
    handleLoginSubmit,
    handleBack
  } = useLogin();

  const footer = (
    <div className="flex flex-col items-center gap-y-8">
      <div className="flex justify-center gap-6 text-xs font-medium text-neutral-500">
        <a href="#" className="hover:text-neutral-700 transition-colors no-underline">
          {t('cookie_policy')}
        </a>
        <a href="#" className="hover:text-neutral-700 transition-colors no-underline">
          {t('privacy_policy')}
        </a>
        <a href="#" className="hover:text-neutral-700 transition-colors no-underline">
          {t('terms_of_use')}
        </a>
      </div>
      <div className="text-xs font-medium text-neutral-500">
        {t('copyright')}
      </div>
    </div>
  );

  return (
    <>
      {errorMsg && (
        <Notification 
          variant="error" 
          message={errorMsg} 
          onClose={() => setErrorMsg(null)} 
        />
      )}

      <Auth footer={footer}>
        <div className="mb-8 text-left">
          <button 
            onClick={handleBack}
            className="mb-6 flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-4 h-4 mr-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {t('back')}
          </button>

          <h1 className="text-display-sm font-semibold text-neutral-950 mb-3 tracking-tight">
            {t('login_title')}
          </h1>
          <p className="text-sm-150 font-normal text-neutral-500">
            {t('login_subtitle')}
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-neutral-950 mb-2">
              {t('username_label')}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('username_placeholder')}
              className={`w-full px-4 py-3.5 rounded-lg border 
                ${errorMsg ? 'border-error-500 focus:ring-error-100' : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-100'}
                text-sm font-semibold text-neutral-950 bg-white
                placeholder:text-sm placeholder:font-normal placeholder:text-neutral-500 
                focus:ring-4 outline-none transition-all`}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-neutral-950 mb-2">
              {t('password_label')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password_placeholder')}
              className={`w-full px-4 py-3.5 rounded-lg border 
                ${errorMsg ? 'border-error-500 focus:ring-error-100' : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-100'}
                text-sm font-semibold text-neutral-950 bg-white
                placeholder:text-sm placeholder:font-normal placeholder:text-neutral-500 
                focus:ring-4 outline-none transition-all`}
              required
              disabled={loading}
            />
             <div className="flex justify-end mt-2">
              <a href="#" className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors">
                {t('forgot_password')}
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 text-white font-bold rounded-lg transition-all active:scale-[0.98] text-sm shadow-none flex justify-center items-center"
          >
            {loading ? (
               <span className="flex items-center gap-2">
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 {t('loading')}
               </span>
            ) : t('login_button')}
          </button>
        </form>
      </Auth>
    </>
  );
};

export default Login;