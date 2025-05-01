import { STORAGE_KEYS } from '../constants';

/**
 * Utilitários para manipulação de armazenamento local
 */
export const storage = {
  /**
   * Salva um valor no localStorage
   */
  set: <T>(key: string, value: T): void => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  },

  /**
   * Recupera um valor do localStorage
   */
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(serializedValue) as T;
    } catch (error) {
      console.error('Erro ao recuperar do localStorage:', error);
      return defaultValue ?? null;
    }
  },

  /**
   * Remove um valor do localStorage
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
    }
  },

  /**
   * Limpa todo o localStorage
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar o localStorage:', error);
    }
  },

  // Helpers específicos para dados comuns
  auth: {
    /**
     * Salva informações de autenticação
     */
    saveToken: (token: string): void => {
      storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
    },

    /**
     * Recupera o token de autenticação
     */
    getToken: (): string | null => {
      return storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
    },

    /**
     * Remove o token de autenticação
     */
    removeToken: (): void => {
      storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    },

    /**
     * Salva informações do usuário
     */
    saveUser: <T>(user: T): void => {
      storage.set(STORAGE_KEYS.USER_INFO, user);
    },

    /**
     * Recupera informações do usuário
     */
    getUser: <T>(): T | null => {
      return storage.get<T>(STORAGE_KEYS.USER_INFO);
    },

    /**
     * Remove informações do usuário
     */
    removeUser: (): void => {
      storage.remove(STORAGE_KEYS.USER_INFO);
    },

    /**
     * Limpa todas as informações de autenticação
     */
    clearAll: (): void => {
      storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      storage.remove(STORAGE_KEYS.USER_INFO);
    },
  },
}; 