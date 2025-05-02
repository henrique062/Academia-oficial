#!/bin/sh
set -e

echo "====================================================="
echo "🚀 INICIANDO TRIPULANTE DASHBOARD - MODO PRODUÇÃO"
echo "====================================================="

# Executar script de correção em runtime
if [ -f "/app/scripts/fix-runtime.sh" ]; then
  echo "🔧 Executando script de correção em runtime..."
  sh /app/scripts/fix-runtime.sh
else
  echo "⚠️ Script de correção em runtime não encontrado. Executando verificações embutidas..."
  
  # Verificações básicas de diretórios
  if [ ! -d "/app/dist" ]; then
    echo "❌ ERRO CRÍTICO: Diretório /app/dist não encontrado!"
    echo "O build da aplicação falhou ou não foi copiado corretamente."
    exit 1
  fi

  if [ ! -d "/app/dist/server" ]; then
    echo "❌ ERRO CRÍTICO: Diretório /app/dist/server não encontrado!"
    echo "O build do servidor falhou ou não foi copiado corretamente."
    exit 1
  fi

  if [ ! -f "/app/dist/server/index.js" ]; then
    echo "❌ ERRO CRÍTICO: Arquivo /app/dist/server/index.js não encontrado!"
    echo "O build do servidor está incompleto."
    exit 1
  fi

  # Verificar estrutura de pasta public
  if [ ! -d "/app/dist/public" ]; then
    echo "⚠️ Diretório /app/dist/public não encontrado! Criando..."
    mkdir -p /app/dist/public
  fi

  # Verificar e instalar dependências críticas
  echo "🔍 Verificando dependências críticas..."
  
  if ! npm list swagger-jsdoc >/dev/null 2>&1; then
    echo "⚠️ swagger-jsdoc não encontrado. Instalando..."
    npm install swagger-jsdoc swagger-ui-express --save
    
    if [ $? -ne 0 ]; then
      echo "❌ Falha ao instalar swagger-jsdoc. Aplicando correção no código..."
      
      # Modificar o código para substituir importações
      echo "🔧 Modificando imports de swagger no código..."
      sed -i 's/import.*swagger-jsdoc.*from.*$/const swaggerJsdoc = () => ({ openapi: "3.0.0", info: { title: "API", version: "1.0.0" }, paths: {} });/g' /app/dist/server/index.js
      sed -i 's/import.*swagger-ui-express.*from.*$/const swaggerUi = { serve: () => (req, res) => res.status(404).json({ error: "API docs não disponíveis" }) };/g' /app/dist/server/index.js
    fi
  fi
  
  # Verificar e corrigir referências ao plugin do Replit
  if grep -q "@replit/vite-plugin-runtime-error-modal" /app/dist/server/index.js 2>/dev/null; then
    echo "⚠️ Detectada referência ao plugin do Replit no código compilado!"
    echo "🔧 Removendo referências ao plugin do Replit do servidor..."
    sed -i 's/.*@replit\/vite-plugin-runtime-error-modal.*//g' /app/dist/server/index.js
    echo "✅ Correção aplicada para o plugin do Replit."
  fi
fi

# Verificar se as variáveis do Supabase estão definidas
echo "🔍 Verificando configuração do Supabase..."

# Tentar carregar variáveis de ambiente de um arquivo .env se existir
if [ -f ".env" ]; then
  echo "🔍 Arquivo .env encontrado, carregando variáveis..."
  # Extrair variáveis do Supabase do arquivo .env (somente se não estiverem definidas)
  if [ -z "$SUPABASE_URL" ] && grep -q "SUPABASE_URL" .env; then
    export SUPABASE_URL=$(grep "SUPABASE_URL" .env | cut -d '=' -f2)
    echo "✅ SUPABASE_URL carregada do arquivo .env"
  fi
  if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ] && grep -q "SUPABASE_SERVICE_ROLE_KEY" .env; then
    export SUPABASE_SERVICE_ROLE_KEY=$(grep "SUPABASE_SERVICE_ROLE_KEY" .env | cut -d '=' -f2)
    echo "✅ SUPABASE_SERVICE_ROLE_KEY carregada do arquivo .env"
  fi
fi

# Verificar se as variáveis de ambiente do Supabase estão definidas
if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "✅ Credenciais do Supabase configuradas através das variáveis de ambiente"
  SUPABASE_URL_PREFIX=$(echo "$SUPABASE_URL" | cut -c1-20)
  SUPABASE_KEY_PREFIX=$(echo "$SUPABASE_SERVICE_ROLE_KEY" | cut -c1-10)
  echo "🔌 Conectando ao Supabase URL: ${SUPABASE_URL_PREFIX}... (chave: ${SUPABASE_KEY_PREFIX}...)"
else
  echo "⚠️ Credenciais do Supabase incompletas!"
  echo "  SUPABASE_URL: ${SUPABASE_URL:-(não definida)}"
  echo "  SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY:+configurada}${SUPABASE_SERVICE_ROLE_KEY:-(não definida)}"
  
  # Criar arquivo .env temporário se não existir
  if [ ! -f "/app/.env" ]; then
    echo "🔧 Criando arquivo .env temporário para debug..."
    cat > /app/.env << EOF
# Arquivo .env temporário criado pelo script de inicialização
# Substitua estes valores pelas suas credenciais reais do Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
NODE_ENV=production
PORT=3000
EOF
    echo "⚠️ Arquivo .env temporário criado. A aplicação pode não funcionar corretamente."
    echo "⚠️ Configure as variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no EasyPanel."
  fi
fi

# Verificação final do ambiente
echo "====================================================="
echo "TRIPULANTE DASHBOARD - INICIANDO EM MODO PRODUÇÃO"
echo "Ambiente: ${NODE_ENV:-production}"
echo "Banco de dados: Supabase (modo remoto)"
echo "Supabase: ${SUPABASE_URL:+Configurado e ativo}${SUPABASE_URL:-(não configurado)}"
echo "====================================================="

# Iniciar a aplicação
echo "Iniciando aplicação..."
exec "$@"