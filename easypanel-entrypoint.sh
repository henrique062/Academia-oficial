#!/bin/sh
set -e

# Verificar se as variáveis do Supabase estão definidas
echo "Verificando configuração do Supabase..."
if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "✅ Credenciais do Supabase configuradas através das variáveis de ambiente"
else
  # Se não estiverem definidas nas variáveis de ambiente, usar as definidas no Dockerfile
  if [ -z "$SUPABASE_URL" ]; then
    echo "⚠️ SUPABASE_URL não definida nas variáveis de ambiente, usando valor padrão do Dockerfile"
  fi
  
  if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "⚠️ SUPABASE_SERVICE_ROLE_KEY não definida nas variáveis de ambiente, usando valor padrão do Dockerfile"
  fi
fi

# Exibir informações parciais do Supabase para verificação
if [ -n "$SUPABASE_URL" ]; then
  SUPABASE_URL_PREFIX=$(echo "$SUPABASE_URL" | cut -c1-20)
  echo "🔌 Conectando ao Supabase: ${SUPABASE_URL_PREFIX}..."
fi

echo "==================================================="
echo "TRIPULANTE DASHBOARD - INICIANDO EM MODO PRODUÇÃO"
echo "Ambiente: ${NODE_ENV:-production}"
echo "Banco de dados: Supabase (modo remoto)"
if [ -n "$SUPABASE_URL" ]; then
  echo "Supabase: Configurado e ativo"
else
  echo "Supabase: Não configurado ou usando valores padrão"
fi
echo "==================================================="

# Iniciar a aplicação
echo "Iniciando aplicação..."
exec "$@"