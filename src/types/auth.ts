export type UserAccessEntry = {
  companyCode: string;
  moduleID: string;
  groupAuthorizeCode: number;
};

export type LoginApiResponse = {
  status: "true" | "false";
  message: string;
  dataListSet?: Array<{
    userID: string;
    userName: string;
    employeeNo: string;
    fullname: string;
    email: string;
    companyCode: string;
    companyName: string;
    token: string;
    defaultCompany: boolean;
    photo: string;
    officeLocation: string | null;
    userType: string;
    groupAccessID: string;
    userAccess?: UserAccessEntry[];
  }>;
};

export type MenuEntry = {
  moduleID: string;
  moduleName: string;
  sort: number;
  icon: string;
  iconName: string;
  link: string;
  companyCode: string;
  groupAuthorizeCode: number;
};

export type AuthSession = {
  userID: string;
  userName: string;
  employeeNo: string;
  fullname: string;
  email: string;
  companyCode: string;
  companyName: string;
  token: string;
  defaultCompany: boolean;
  photo: string;
  officeLocation: string | null;
  userType: string;
  groupAccessID: string;
  menuList: MenuEntry[];
};