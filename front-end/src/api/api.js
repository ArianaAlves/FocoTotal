import axios from "axios";

// Configuração da API - detectar ambiente automaticamente
const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = isLocalDev
    ? "http://localhost:3001/api"  // Desenvolvimento local
    : import.meta.env.VITE_API_BASE_URL || "https://focototal.onrender.com/api";  // Produção

console.log("🔗 API Base URL:", API_BASE);
console.log("🛠️ Development mode:", isLocalDev);
console.log("🌐 Current hostname:", window.location.hostname);
console.log("📦 Environment API URL:", import.meta.env.VITE_API_BASE_URL);

export const api = axios.create({
    baseURL: API_BASE,
    timeout: 30000, // 30 segundos de timeout
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    withCredentials: false
});

// Interceptor para retry automático em caso de falha de rede
api.interceptors.request.use(
    (config) => {
        // Log da requisição para debug
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            baseURL: config.baseURL,
            fullURL: `${config.baseURL}${config.url}`
        });
        return config;
    },
    (error) => Promise.reject(error)
);

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
        console.log('API Error Details:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.message,
            code: error.code,
            isNetworkError: !error.response
        });

        // Se for erro de rede (sem response), criar uma mensagem mais clara
        if (!error.response) {
            const networkError = new Error('Network Error');
            networkError.message = 'Erro de conexão. Verifique sua internet ou tente novamente.';
            networkError.isNetworkError = true;
            return Promise.reject(networkError);
        }

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

export default api;