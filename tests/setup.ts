import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Estende o Vitest's expect com matchers do jest-dom
expect.extend(matchers);

// Limpa o ambiente após cada teste
afterEach(() => {
  cleanup();
});

// Mock do localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(() => null),
    removeItem: vi.fn(() => null),
    clear: vi.fn(() => null),
  },
  writable: true,
});

// Mock de funções globais conforme necessário
global.fetch = vi.fn();
global.console.error = vi.fn();
global.console.warn = vi.fn(); 