import axios from 'axios';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (config.data) {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(config.data), ENCRYPTION_KEY).toString();
      config.data = { payload: encrypted };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.payload) {
      try {
        const bytes = CryptoJS.AES.decrypt(response.data.payload, ENCRYPTION_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        
        response.data = decryptedData;
      } catch (e) {
        console.error("Failed to decrypt response", e);
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;