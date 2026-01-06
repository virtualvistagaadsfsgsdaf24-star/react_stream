import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api/axiosInstance";
import { getStorage, setStorage } from "../../utils/storage";
import type { CompanyApiResponse, CompanyInfo } from "../../types/company";

export const useCompanyCode = () => {
  const navigate = useNavigate();
  const [companyCode, setCompanyCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const session = getStorage<CompanyInfo>("company_session");

    if (session && session.companyCode) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await api.post<CompanyApiResponse>("/api/company/info", {
        companyCode: companyCode,
      });

      const data = response.data;

      if (data.status === "true" && data.company) {
        setStorage("company_session", data.company);
        navigate("/login");
      } else setErrorMsg(data.message || "Unknown Error");
    } catch (error: unknown) {
      if (axios.isAxiosError(error))
        setErrorMsg(error.response?.data?.message || error.message);
      else if (error instanceof Error) setErrorMsg(error.message);
      else setErrorMsg("An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    companyCode,
    setCompanyCode,
    loading,
    errorMsg,
    setErrorMsg,
    handleCompanySubmit,
  };
};
