// Constantes da aplicação

// URLs de API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Rotas da aplicação
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
};

// Mensagens de erro
export const ERROR_MESSAGES = {
  GENERIC_ERROR: 'Ocorreu um erro. Por favor, tente novamente.',
  AUTHENTICATION_ERROR: 'Erro de autenticação. Por favor, faça login novamente.',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet e tente novamente.',
};

// Configurações de local storage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  THEME: 'app_theme',
};

// Configurações da aplicação
export const APP_CONFIG = {
  PAGE_SIZE: 10,
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
};

// Adicione mais constantes conforme necessário 