import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { cn } from "../utils/cn";
import { useMainLayout } from "../hooks/layout/useMainLayout";
import { SearchableOptionDropdown } from "../components/fields/SearchableOptionDropdown";
import Notification from "../components/overlays/Notification";
import Language from "../components/overlays/Language";
import {
  IconMenu,
  IconCaretRight,
  IconGlobe,
  IconPassword,
  IconGear,
  IconSignOut,
  LogoWhite,
  LogoFullWhite,
} from "../components/ui/Icons";

export default function Main({ children }: { children: React.ReactNode }) {
  const {
    session,
    navigationItems,
    breadcrumbSegments,
    avatarInitials,
    companyOptions,
    selectedCompany,
    selectedCompanyCode,
    companyLoading,
    sidebarExpanded,
    mobileNavOpen,
    profileOpen,
    profileRef,
    notification,
    languageOpen,
    setLanguageOpen,
    setNotification,
    toggleSidebar,
    toggleProfile,
    openMobileNav,
    closeMobileNav,
    handleCompanyChange,
    handleSignOut,
    t,
  } = useMainLayout();

  const profileMenu = useMemo(
    () => [
      { label: t("change_language"), icon: IconGlobe, action: "language" },
      { label: t("change_password"), icon: IconPassword, action: "password" },
      { label: t("settings"), icon: IconGear, action: "settings" },
      { label: t("logout"), icon: IconSignOut, action: "signout" },
    ],
    [t]
  );

  if (!session) return null;

  return (
    <div className="flex min-h-screen flex-col bg-neutral-100 md:h-screen md:flex-row md:overflow-hidden font-sans">
      {notification && (
        <Notification
          message={notification.message}
          variant={notification.variant}
          onClose={() => setNotification(null)}
        />
      )}

      <Language isOpen={languageOpen} onClose={() => setLanguageOpen(false)} />

      <aside
        className={cn(
          "hidden flex-col items-center gap-8 bg-primary-600 py-8 text-white transition-all duration-200 md:flex",
          sidebarExpanded ? "md:w-64" : "md:w-20"
        )}
      >
        <div className="flex w-full items-center justify-center px-3 h-12">
          {sidebarExpanded ? (
            <LogoFullWhite className="h-8 w-auto" />
          ) : (
            <LogoWhite className="h-8 w-auto" />
          )}
        </div>

        <nav className="flex w-full flex-1 flex-col items-center gap-3 px-2 mt-4">
          {navigationItems.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex w-full items-center rounded-2xl p-3 transition hover:bg-white/20",
                sidebarExpanded ? "justify-start gap-3" : "justify-center gap-0"
              )}
              title={label}
            >
              <Icon className="w-[15px] h-[15.62px] text-white" />
              {sidebarExpanded && (
                <span className="text-sm font-semibold text-white">
                  {label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex h-full flex-1 flex-col bg-white min-w-0">
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-300 bg-white px-4 py-4 sm:gap-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="flex flex-1 items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="hidden h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 transition hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-300 md:flex"
            >
              <IconMenu className="h-5 w-5 text-neutral-800" />
            </button>

            <button
              type="button"
              onClick={openMobileNav}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 md:hidden"
            >
              <IconMenu className="h-5 w-5 text-neutral-800" />
            </button>

            <nav className="hidden flex-wrap items-center gap-2 text-sm font-medium text-neutral-700 md:flex">
              {breadcrumbSegments.length === 0 ? (
                <span className="text-neutral-500">Home</span>
              ) : (
                breadcrumbSegments.map((segment, index) => (
                  <span key={segment.href} className="flex items-center gap-2">
                    {segment.isLast ? (
                      <span className="text-primary-700">{segment.label}</span>
                    ) : (
                      <Link
                        to={segment.href}
                        className="text-neutral-700 transition hover:text-primary-700"
                      >
                        {segment.label}
                      </Link>
                    )}
                    {index < breadcrumbSegments.length - 1 && (
                      <IconCaretRight className="h-3.5 w-3.5 text-neutral-400" />
                    )}
                  </span>
                ))
              )}
            </nav>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 sm:gap-5 md:w-auto">
            <div className="min-w-0 flex-1 sm:flex-none sm:w-72">
              <SearchableOptionDropdown
                options={companyOptions}
                selectedCode={selectedCompanyCode}
                selectedLabel={selectedCompany?.companyName}
                placeholder={t("choose_company") || "Choose company"}
                buttonClassName="bg-primary-100 border border-primary-600 text-primary-600"
                panelClassName="w-full sm:w-[360px]"
                matchTriggerWidth
                onSelectAction={handleCompanyChange}
                loading={companyLoading}
              />
            </div>

            <span className="hidden h-8 w-px bg-neutral-200 md:block" />

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={toggleProfile}
                className="flex cursor-pointer items-center gap-4 focus:outline-none"
              >
                {session?.photo ? (
                  <img
                    src={session.photo}
                    alt={session.userName}
                    className="h-12 w-12 rounded-full border border-neutral-100 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-base font-semibold text-primary-700">
                    {avatarInitials}
                  </div>
                )}
                <div className="text-left text-sm hidden sm:block">
                  <p className="font-semibold text-neutral-900">
                    {session?.fullname || session?.userName}
                  </p>
                  <p className="text-neutral-500">{session?.userType}</p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={cn(
                    "h-4 w-4 text-neutral-500 transition hidden sm:block",
                    profileOpen ? "rotate-180" : ""
                  )}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m6 9 6 6 6-6"
                  />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-56 rounded-2xl border border-neutral-200 bg-white p-3 shadow-lg">
                  {profileMenu.map((item) => {
                    const MenuIcon = item.icon;
                    const isSignOut = item.action === "signout";
                    const isLanguage = item.action === "language";

                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          toggleProfile();
                          if (isSignOut) handleSignOut();
                          if (isLanguage) setLanguageOpen(true);
                        }}
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                          isSignOut
                            ? "text-error-600 hover:bg-error-50"
                            : "text-neutral-700 hover:bg-neutral-50"
                        )}
                      >
                        <MenuIcon
                          className={cn(
                            "h-4 w-4",
                            isSignOut ? "text-error-500" : "text-neutral-500"
                          )}
                        />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col min-w-0 bg-neutral-100 px-4 pb-28 pt-6 sm:px-6 lg:px-8 md:overflow-y-auto md:pb-0">
          <div className="flex min-h-full flex-col">
            <div className="flex-1">{children}</div>
            <div className="mt-auto p-6 text-right text-xs text-neutral-400">
              {t("copyright")}
            </div>
          </div>
        </main>
      </div>

      {mobileNavOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={closeMobileNav}
          />
          <aside className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col gap-4 bg-white py-6 md:hidden">
            <div className="flex items-center justify-between px-6">
              <div className="text-sm font-semibold text-neutral-700">
                Navigation
              </div>
              <button
                type="button"
                onClick={closeMobileNav}
                className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-2 px-4">
              {navigationItems.map(({ icon: Icon, label, href }) => (
                <Link
                  key={href}
                  to={href}
                  onClick={closeMobileNav}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-primary-50"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50">
                    <Icon className="h-5 w-5 text-primary-700" />
                  </span>
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around gap-1 border-t border-primary-500 bg-primary-600 text-white md:hidden">
        {navigationItems.slice(0, 5).map(({ icon: Icon, label, href }) => (
          <Link
            key={href}
            to={href}
            className="flex flex-1 flex-col items-center justify-center transition hover:bg-white/10"
          >
            <Icon className="h-5 w-5 text-white" />
            <span className="sr-only">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
