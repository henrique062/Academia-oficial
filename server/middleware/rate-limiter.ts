import rateLimit from 'express-rate-limit';

/**
 * Configuração de rate limiting para proteção contra ataques de força bruta
 * e para limitar o número de requisições por IP
 */

// Limiter padrão para todas as rotas da API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por janela por IP
  standardHeaders: true, // Retorna informações de rate limit nos cabeçalhos `RateLimit-*`
  legacyHeaders: false, // Desativa os cabeçalhos `X-RateLimit-*`
  message: { 
    message: 'Muitas requisições deste IP, tente novamente após 15 minutos'
  },
});

// Limiter mais restritivo para rotas sensíveis (login, registro, etc.)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Limite de 10 tentativas por hora por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    message: 'Limite de tentativas excedido, tente novamente após 1 hora'
  },
}); 