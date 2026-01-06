import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import api from '../../api/axiosInstance';
import { getStorage, setStorage, removeStorage } from '../../utils/storage';
import { buildMenuList } from '../../utils/menuHelper';
import type { LoginApiResponse, AuthSession } from '../../types/auth';
import type { CompanyInfo } from '../../types/company';

export const useLogin = () => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

    useEffect(() => {
        const session = getStorage<CompanyInfo>('company_session');
        if (!session || !session.apiurl) navigate('/');
        else setCompanyInfo(session);
    }, [navigate]);

    const handleBack = () => {
        removeStorage('company_session');
        navigate('/');
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyInfo || !companyInfo.apiurl) return;

        setLoading(true);
        setErrorMsg(null);

        try {
        const response = await api.post<LoginApiResponse>('/api/auth/login', {
            username,
            password,
            languageCode: i18n.language || 'en',
            baseURL: companyInfo.apiurl
        });

        const data = response.data;

        if (data.status === "true" && data.dataListSet && data.dataListSet.length > 0) {
            const account = data.dataListSet[0];

            const authSession: AuthSession = {
                userID: account.userID,
                userName: account.userName,
                employeeNo: account.employeeNo,
                fullname: account.fullname,
                email: account.email,
                companyCode: account.companyCode,
                companyName: account.companyName,
                token: account.token,
                defaultCompany: account.defaultCompany,
                photo: account.photo,
                officeLocation: account.officeLocation,
                userType: account.userType,
                groupAccessID: account.groupAccessID,
                menuList: buildMenuList(account.userAccess),
            };

            setStorage('auth_session', authSession);
            setStorage('token', account.token);
            
            const now = new Date();
            const expiryTime = now.getTime() + (24 * 60 * 60 * 1000);
            localStorage.setItem('session_expiry', expiryTime.toString());
            
            navigate('/home'); 
        } else {
            setErrorMsg(data.message || "Login failed");
        }

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) setErrorMsg(error.response?.data?.message || "Network Error");
            else if (error instanceof Error) setErrorMsg(error.message);
            else setErrorMsg("An unknown error occurred");            
        } finally {
            setLoading(false);
        }
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        loading,
        errorMsg,
        setErrorMsg,
        handleLoginSubmit,
        handleBack
    };
};