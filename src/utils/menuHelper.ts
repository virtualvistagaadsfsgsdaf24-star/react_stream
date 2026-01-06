import type { MenuEntry, UserAccessEntry } from "../types/auth";

const moduleMap: Record<
  string,
  { moduleName: string; sort: number; iconKey: string; link: string }
> = {
  HOME: { 
    moduleName: "HOME", 
    sort: 1, 
    iconKey: "Home",
    link: "/home" 
  },
  PE: { 
    moduleName: "PERSONNEL", 
    sort: 2, 
    iconKey: "Personnel", 
    link: "/personnel" 
  },
  TM: { 
    moduleName: "TIME MANAGEMENT", 
    sort: 3, 
    iconKey: "TimeManagement", 
    link: "/time_management" 
  },
  PY: { 
    moduleName: "PAYROLL", 
    sort: 4, 
    iconKey: "Payroll", 
    link: "/payroll" 
  },
  REP: { 
    moduleName: "REPORT", 
    sort: 5, 
    iconKey: "ExportReport", 
    link: "/report" 
  },
  MD: { 
    moduleName: "MEDICAL", 
    sort: 6, 
    iconKey: "Medical", 
    link: "/medical" 
  },
  RPT: { 
    moduleName: "EXPORT REPORT", 
    sort: 7, 
    iconKey: "ExportReport", 
    link: "/export" 
  },
  TRX: { 
    moduleName: "TRANSACTION", 
    sort: 8, 
    iconKey: "Transaction", 
    link: "/transaction" 
  },
  MOB: { 
    moduleName: "MOBILE MASTER DATA", 
    sort: 9, 
    iconKey: "MobileMaster", 
    link: "/master_data" 
  },
  RC: { 
    moduleName: "RECRUITMENT", 
    sort: 10, 
    iconKey: "Personnel",
    link: "/recruitment" 
  },
};

export const buildMenuList = (access: UserAccessEntry[] = []): MenuEntry[] => {
  const seenModules = new Set<string>();

  return access
    .filter((entry) => {
      if (seenModules.has(entry.moduleID)) {
        return false;
      }
      seenModules.add(entry.moduleID);
      return true;
    })
    .map((entry) => {
      const metadata = moduleMap[entry.moduleID];
      if (!metadata) return null;
      
      return {
        moduleID: entry.moduleID,
        moduleName: metadata.moduleName,
        sort: metadata.sort,
        icon: "",
        iconName: metadata.iconKey,
        link: metadata.link,
        companyCode: entry.companyCode,
        groupAuthorizeCode: entry.groupAuthorizeCode,
      };
    })
    .filter((menu): menu is MenuEntry => Boolean(menu))
    .sort((a, b) => a.sort - b.sort);
};