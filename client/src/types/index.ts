// Tipos comuns usados no aplicativo

// Exemplo de tipo de usuário
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

// Exemplo de tipo para respostas de API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Exemplo de tipo para estado de autenticação
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Adicione aqui mais tipos conforme necessário 