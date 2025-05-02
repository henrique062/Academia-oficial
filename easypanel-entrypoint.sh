#!/bin/sh
set -e

# Exibir informações do ambiente
echo "====================================================="
echo "🚀 INICIANDO TRIPULANTE DASHBOARD - MODO PRODUÇÃO"
echo "====================================================="

# Verificar diretórios e arquivos importantes
echo "Verificando arquivos críticos..."
ls -la /app
ls -la /app/dist || echo "❌ Diretório /app/dist não encontrado!"
ls -la /app/dist/server || echo "❌ Diretório /app/dist/server não encontrado!"
ls -la /app/dist/server/index.js || echo "❌ Arquivo /app/dist/server/index.js não encontrado!"

# Executar script de correção para o EasyPanel
if [ -f "/app/scripts/easypanel-fix.sh" ]; then
  echo "🔧 Executando script de correção para o EasyPanel..."
  sh /app/scripts/easypanel-fix.sh
else
  echo "⚠️ Script de correção para o EasyPanel não encontrado!"
fi

# Verificar se as variáveis do Supabase estão definidas
echo "Verificando configuração do Supabase..."
if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "✅ Credenciais do Supabase configuradas através das variáveis de ambiente"
  # Mostrar versão truncada das credenciais por segurança
  SUPABASE_URL_PREFIX=$(echo "$SUPABASE_URL" | cut -c1-20)
  SUPABASE_KEY_PREFIX=$(echo "$SUPABASE_SERVICE_ROLE_KEY" | cut -c1-10)
  echo "🔌 Conectando ao Supabase URL: ${SUPABASE_URL_PREFIX}... (chave: ${SUPABASE_KEY_PREFIX}...)"
else
  echo "⚠️ Credenciais do Supabase incompletas!"
  echo "  SUPABASE_URL: ${SUPABASE_URL:-(não definida)}"
  echo "  SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY:+configurada}${SUPABASE_SERVICE_ROLE_KEY:-(não definida)}"
fi

# Exibir informações importantes
echo "====================================================="
echo "Ambiente: ${NODE_ENV:-production}"
echo "Diretório atual: $(pwd)"
echo "Conteúdo do processo: $@"
echo "====================================================="

# Iniciar a aplicação
echo "🟢 Iniciando aplicação..."
exec "$@"