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

// Interceptor para incluir token automaticamente
api.interceptors.request.use((config) => {
    // Se já tem Authorization header, mantém
    if (config.headers.Authorization) {
        return config;
    }

    // Pega o token do localStorage
    const token = localStorage.getItem("ft_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Interceptor para tratar respostas de erro de autenticação
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log('API Error:', error.response?.status, error.config?.url);
        
        // Só redirecionar para login se for um erro 401 em rotas protegidas
        // E não durante a inicialização da app
        if (error.response?.status === 401 && !error.config?.url?.includes('/user/profile')) {
            console.log('Redirecting to login due to 401 error');
            localStorage.removeItem("ft_token");
            localStorage.removeItem("ft_user");
            // Só redirecionar se não estivermos já na página de login
            if (window.location.pathname !== '/login') {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);