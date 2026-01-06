import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Auth from "../../layouts/Auth";
import Notification from "../../components/overlays/Notification";
import { useLogin } from "../../hooks/auth/useLogin";
import {
  IconSpinner,
  IconGlobe,
  IconChevronDown,
  IconChevronLeft,
} from "../../components/ui/Icons";

const Login: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    errorMsg,
    setErrorMsg,
    companyInfo,
    handleLoginSubmit,
    handleBack,
  } = useLogin();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLangDropdownOpen(false);
  };

  const footer = (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Policies */}
      <div className="flex flex-row flex-nowrap items-center gap-x-4 text-xs font-medium text-neutral-500 whitespace-nowrap">
        <a
          href="#"
          className="hover:text-neutral-700 transition-colors no-underline"
        >
          {t("cookie_policy")}
        </a>
        <span className="text-neutral-300 select-none">•</span>
        <a
          href="#"
          className="hover:text-neutral-700 transition-colors no-underline"
        >
          {t("privacy_policy")}
        </a>
        <span className="text-neutral-300 select-none">•</span>
        <a
          href="#"
          className="hover:text-neutral-700 transition-colors no-underline"
        >
          {t("terms_of_use")}
        </a>
      </div>

      {/* Language Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setLangDropdownOpen(!langDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 bg-white transition-all text-xs font-semibold text-neutral-700"
        >
          <IconGlobe className="w-3.5 h-3.5 text-neutral-500" />
          <span>
            {i18n.language === "id" ? "Bahasa Indonesia" : "English (US)"}
          </span>
          <IconChevronDown
            className={`w-3 h-3 text-neutral-400 transition-transform ${
              langDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {langDropdownOpen && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-white rounded-lg shadow-lg border border-neutral-100 py-1 overflow-hidden z-10">
            <button
              onClick={() => changeLanguage("en")}
              className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-neutral-50 transition-colors ${
                i18n.language === "en"
                  ? "text-primary-600 bg-primary-50"
                  : "text-neutral-700"
              }`}
            >
              English (US)
            </button>
            <button
              onClick={() => changeLanguage("id")}
              className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-neutral-50 transition-colors ${
                i18n.language === "id"
                  ? "text-primary-600 bg-primary-50"
                  : "text-neutral-700"
              }`}
            >
              Bahasa Indonesia
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const copyright = (
    <span className="text-xs font-normal text-neutral-400">
      {t("copyright")}
    </span>
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

      <Auth footer={footer} copyright={copyright}>
        <div className="mb-8 text-left">
          {companyInfo && (
            <button
              onClick={handleBack}
              type="button"
              className="group mb-6 flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-primary-600 transition-colors"
            >
              <IconChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>{t("back")}</span>
            </button>
          )}

          <h1 className="text-display-sm font-semibold text-neutral-950 mb-3 tracking-tight">
            {t("login_title")}
          </h1>
          <p className="text-sm-150 font-normal text-neutral-500">
            {t("login_subtitle")}
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-neutral-950 mb-2"
            >
              {t("username_label")}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("username_placeholder")}
              className={`w-full px-4 py-3.5 rounded-lg border 
                ${
                  errorMsg
                    ? "border-error-500 focus:ring-error-100"
                    : "border-neutral-300 focus:border-primary-500 focus:ring-primary-100"
                }
                text-sm font-semibold text-neutral-950 bg-white
                placeholder:text-sm placeholder:font-normal placeholder:text-neutral-500 
                focus:ring-4 outline-none transition-all`}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-neutral-950 mb-2"
            >
              {t("password_label")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password_placeholder")}
              className={`w-full px-4 py-3.5 rounded-lg border 
                ${
                  errorMsg
                    ? "border-error-500 focus:ring-error-100"
                    : "border-neutral-300 focus:border-primary-500 focus:ring-primary-100"
                }
                text-sm font-semibold text-neutral-950 bg-white
                placeholder:text-sm placeholder:font-normal placeholder:text-neutral-500 
                focus:ring-4 outline-none transition-all`}
              required
              disabled={loading}
            />
          </div>

          {/* Moved outside the password div to use space-y-6 spacing */}
          <div className="flex justify-end">
            <a
              href="#"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors"
            >
              {t("forgot_password")}
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 text-white font-bold rounded-lg transition-all active:scale-[0.98] text-sm shadow-none flex justify-center items-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <IconSpinner className="animate-spin h-5 w-5 text-white" />
                {t("loading")}
              </span>
            ) : (
              t("login_button")
            )}
          </button>
        </form>
      </Auth>
    </>
  );
};

export default Login;
