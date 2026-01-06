export interface CompanyInfo {
  companyCode: string;
  companyName: string;
  apiurl: string | null;
}

export interface CompanyApiResponse {
  status: string;
  message?: string;
  company?: CompanyInfo;
}