import axios from "axios";

// Força a URL de produção se estivermos no Vercel ou produção
const API_BASE = (import.meta.env.MODE === 'production' || window.location.hostname.includes('vercel.app'))
    ? "https://focototal.onrender.com/api"
    : (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api");

export const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

api.interceptors.request.use((config) => {

    if (config.headers.Authorization) {
        return config;
    }

    const token = localStorage.getItem("ft_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});