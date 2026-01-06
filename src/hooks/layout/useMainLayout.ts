import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getStorage, removeStorage, setStorage } from "../../utils/storage";
import { getIconComponent } from "../../utils/iconMap";
import type { AuthSession } from "../../types/auth";
import type { CompanyInfo } from "../../types/company";

export const useMainLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);
  const [session] = useState<AuthSession | null>(() =>
    getStorage<AuthSession>("auth_session")
  );

  const [companies] = useState<CompanyInfo[]>(() => {
    const comp = getStorage<CompanyInfo>("company_session");
    return comp ? [comp] : [];
  });

  const [selectedCompanyCode, setSelectedCompanyCode] = useState(() => {
    const comp = getStorage<CompanyInfo>("company_session");
    return comp ? comp.companyCode : "";
  });

  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [companyLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate("/login", { replace: true });
    }
  }, [session, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigationItems = useMemo(() => {
    if (!session?.menuList) return [];

    return session.menuList.map((menu) => ({
      label: t(`menu_${menu.moduleID}`) || menu.moduleName,
      href: menu.link,
      icon: getIconComponent(menu.iconName),
      active: location.pathname.startsWith(menu.link),
    }));
  }, [session, t, location.pathname]);

  const breadcrumbSegments = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const label =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
      return { href, label, isLast: index === segments.length - 1 };
    });
  }, [location.pathname]);

  const avatarInitials = useMemo(() => {
    const name = session?.fullname || session?.userName || "U";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "U";
    return `${parts[0][0] ?? ""}${
      parts[parts.length - 1][0] ?? ""
    }`.toUpperCase();
  }, [session]);

  const companyOptions = useMemo(
    () => companies.map((c) => ({ code: c.companyCode, label: c.companyName })),
    [companies]
  );

  const selectedCompany = companies.find(
    (c) => c.companyCode === selectedCompanyCode
  );

  const handleCompanyChange = (option: { code: string; label: string }) => {
    const target = companies.find((c) => c.companyCode === option.code);
    if (target) {
      setStorage("company_session", target);
      setSelectedCompanyCode(option.code);
      window.location.reload();
    }
  };

  const handleSignOut = () => {
    removeStorage("auth_session");
    removeStorage("token");
    localStorage.removeItem("session_expiry");
    navigate("/");
  };

  const toggleSidebar = () => setSidebarExpanded((prev) => !prev);
  const toggleProfile = () => setProfileOpen((prev) => !prev);
  const closeMobileNav = () => setMobileNavOpen(false);
  const openMobileNav = () => setMobileNavOpen(true);

  return {
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
    toggleSidebar,
    toggleProfile,
    openMobileNav,
    closeMobileNav,
    handleCompanyChange,
    handleSignOut,
    t,
  };
};
