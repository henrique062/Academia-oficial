import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from '../api';

describe('API Utils', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('deve fazer uma requisição GET corretamente', async () => {
    const mockResponse = { success: true, data: { message: 'Teste' } };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const result = await api.get('/test');

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test'), expect.objectContaining({
      method: 'GET',
      credentials: 'include',
    }));
    expect(result).toEqual(mockResponse);
  });

  it('deve fazer uma requisição POST corretamente', async () => {
    const mockResponse = { success: true, data: { id: 1 } };
    const postData = { name: 'Teste' };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const result = await api.post('/test', postData);

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test'), expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(postData),
      credentials: 'include',
    }));
    expect(result).toEqual(mockResponse);
  });

  it('deve lidar com erros corretamente', async () => {
    const errorMessage = 'Erro na requisição';
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: errorMessage }),
    });

    const result = await api.get('/test');

    expect(result).toEqual({
      success: false,
      error: errorMessage,
    });
  });

  it('deve capturar exceções de rede', async () => {
    const networkError = new Error('Falha na conexão');
    global.fetch = vi.fn().mockRejectedValue(networkError);

    const result = await api.get('/test');

    expect(result).toEqual({
      success: false,
      error: 'Falha na conexão',
    });
  });
}); 