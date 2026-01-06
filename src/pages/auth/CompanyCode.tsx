import React from 'react';
import { useTranslation } from 'react-i18next';
import Auth from '../../layouts/Auth';
import Notification from '../../components/overlays/Notification';
import { useCompanyCode } from '../../hooks/auth/useCompanyCode';

const CompanyCode: React.FC = () => {
  const { t } = useTranslation();
  
  const {
    companyCode,
    setCompanyCode,
    loading,
    errorMsg,
    setErrorMsg,
    handleCompanySubmit
  } = useCompanyCode();

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
        <div className="mb-10 text-left">
          <h1 className="text-display-sm font-semibold text-neutral-950 mb-3 tracking-tight">
            {t('org_code_title')}
          </h1>
          <p className="text-sm-150 font-normal text-neutral-500">
            {t('org_code_subtitle')}
          </p>
        </div>

        <form onSubmit={handleCompanySubmit} className="space-y-6">
          <div>
            <label htmlFor="companyCode" className="block text-sm font-semibold text-neutral-950 mb-2">
              {t('org_code_label')}
            </label>
            
            <input
              id="companyCode"
              type="text"
              value={companyCode}
              onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
              placeholder={t('org_code_placeholder')}
              className={`w-full px-4 py-3.5 rounded-lg border 
                ${errorMsg ? 'border-error-500 focus:ring-error-100' : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-100'}
                text-sm font-semibold text-neutral-950 bg-white
                placeholder:text-sm placeholder:font-normal placeholder:text-neutral-500 
                focus:ring-4 outline-none transition-all`}
              required
              disabled={loading}
            />
          </div>

          <div className="text-right">
            <a href="#" className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors">
              {t('how_to_find_code')}
            </a>
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
            ) : t('next')}
          </button>
        </form>
      </Auth>
    </>
  );
};

export default CompanyCode;