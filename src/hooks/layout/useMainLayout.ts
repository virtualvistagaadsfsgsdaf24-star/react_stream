import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getStorage, removeStorage, setStorage } from "../../utils/storage";
import { getIconComponent } from "../../utils/iconMap";
import { buildMenuList } from "../../utils/menuHelper";
import api from "../../api/axiosInstance";
import type { AuthSession, UserAccount } from "../../types/auth";
import type { CompanyInfo } from "../../types/company";

export const useMainLayout = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);

  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error" | "info";
  } | null>(null);

  const [languageOpen, setLanguageOpen] = useState(false);

  const [session] = useState<AuthSession | null>(() =>
    getStorage<AuthSession>("auth_session")
  );

  const [authContexts, setAuthContexts] = useState<UserAccount[]>(
    () => getStorage<UserAccount[]>("auth_contexts") || []
  );

  const [companies, setCompanies] = useState<CompanyInfo[]>(() => {
    if (authContexts.length > 0) {
      return mapContextsToCompanies(authContexts);
    }
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
  const [companyLoading, setCompanyLoading] = useState(false);

  function mapContextsToCompanies(contexts: UserAccount[]): CompanyInfo[] {
    const unique = contexts.reduce<UserAccount[]>((acc, current) => {
      const x = acc.find((item) => item.companyCode === current.companyCode);
      if (!x) return acc.concat([current]);
      return acc;
    }, []);

    return unique.map((c) => ({
      companyCode: c.companyCode,
      companyName: c.companyName,
      apiurl: null,
    }));
  }

  useEffect(() => {
    const successMsg = sessionStorage.getItem("company_switch_success");
    if (successMsg) {
      setNotification({ message: successMsg, variant: "success" });
      sessionStorage.removeItem("company_switch_success");
    }
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!session?.userID || !session?.token) return;

      if (companies.length <= 1) setCompanyLoading(true);

      try {
        const payload = {
          userID: session.userID,
          token: session.token,
        };

        const response = await api.post("/company/holding-list", payload);
        const dataList = response.data?.dataListSet;

        if (Array.isArray(dataList) && dataList.length > 0) {
          setStorage("auth_contexts", dataList);
          setAuthContexts(dataList);

          const formattedCompanies = mapContextsToCompanies(dataList);
          setCompanies(formattedCompanies);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setCompanyLoading(false);
      }
    };

    fetchCompanies();
  }, [session?.userID, session?.token, companies.length]);

  const handleCompanyChange = (option: { code: string; label: string }) => {
    setCompanyLoading(true);

    const targetContext = authContexts.find(
      (c) => c.companyCode === option.code
    );

    if (targetContext) {
      try {
        const newCompanyInfo: CompanyInfo = {
          companyCode: targetContext.companyCode,
          companyName: targetContext.companyName,
          apiurl: null,
        };
        setStorage("company_session", newCompanyInfo);

        const nextToken = targetContext.token || session?.token || "";

        const newAuthSession: AuthSession = {
          userID: targetContext.userID,
          userName: targetContext.userName,
          employeeNo: targetContext.employeeNo,
          fullname: targetContext.fullname,
          email: targetContext.email,
          companyCode: targetContext.companyCode,
          companyName: targetContext.companyName,
          token: nextToken,
          defaultCompany: targetContext.defaultCompany,
          photo: targetContext.photo,
          officeLocation: targetContext.officeLocation,
          userType: targetContext.userType,
          groupAccessID: targetContext.groupAccessID,
          menuList: buildMenuList(targetContext.userAccess),
        };

        setStorage("auth_session", newAuthSession);
        setStorage("token", nextToken);

        setSelectedCompanyCode(option.code);

        sessionStorage.setItem(
          "company_switch_success",
          `Success switch to ${targetContext.companyName}`
        );

        window.location.reload();
      } catch (error) {
        console.error(error);
        setNotification({
          message: "Failed to switch company",
          variant: "error",
        });
        setCompanyLoading(false);
      }
    } else {
      setCompanyLoading(false);
    }
  };

  const handleSignOut = useCallback(() => {
    removeStorage("auth_session");
    removeStorage("company_session");
    removeStorage("token");
    removeStorage("auth_contexts");
    localStorage.removeItem("session_expiry");
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (!session) {
      navigate("/login", { replace: true });
      return;
    }

    const checkExpiry = () => {
      const expiry = localStorage.getItem("session_expiry");
      if (expiry && Date.now() > parseInt(expiry, 10)) {
        handleSignOut();
      }
    };
    checkExpiry();
    const interval = setInterval(checkExpiry, 60000);
    return () => clearInterval(interval);
  }, [session, navigate, handleSignOut]);

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
    i18n,
  };
};
