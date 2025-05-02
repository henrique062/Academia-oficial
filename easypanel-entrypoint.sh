#!/bin/sh
set -e

# Verificar variáveis de ambiente
echo "Checking environment variables..."
if [ -z "$DATABASE_URL" ]; then
  # Se DATABASE_URL não estiver definido, tentar construí-lo
  if [ -z "$DB_HOST" ] || [ -z "$POSTGRES_PASSWORD" ]; then
    echo "ERRO: Nem DATABASE_URL nem DB_HOST/POSTGRES_PASSWORD estão definidos."
    echo "Configure corretamente as variáveis de ambiente no EasyPanel."
    echo "Continuando com configuração padrão, mas provavelmente falhará..."
    export DB_HOST="localhost"
    export POSTGRES_PASSWORD="postgres"
  fi
  
  echo "Construindo DATABASE_URL com DB_HOST=$DB_HOST"
  export DATABASE_URL="postgres://postgres:${POSTGRES_PASSWORD}@${DB_HOST}:5432/tripulante"
fi

echo "DATABASE_URL configurado (oculto por segurança)"

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

# Aguardar pela disponibilidade do banco de dados
echo "Tentando conectar ao PostgreSQL..."
MAX_RETRIES=30
RETRY_COUNT=0

# Extrair o host do DATABASE_URL
DB_HOST_FROM_URL=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\).*/\1/p')
if [ -z "$DB_HOST_FROM_URL" ]; then
  DB_HOST_FROM_URL=${DB_HOST:-localhost}
fi

echo "Verificando conexão com banco de dados em $DB_HOST_FROM_URL..."

until pg_isready -h "$DB_HOST_FROM_URL" -U postgres; do
  RETRY_COUNT=$((RETRY_COUNT+1))
  if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo "PostgreSQL indisponível após $MAX_RETRIES tentativas - continuando mesmo assim"
    break
  fi
  echo "PostgreSQL indisponível - tentativa $RETRY_COUNT de $MAX_RETRIES, aguardando..."
  sleep 5
done

if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
  echo "PostgreSQL está respondendo - executando migrações do banco de dados"
else
  echo "AVISO: Não foi possível verificar a conexão com o PostgreSQL. A aplicação pode falhar."
fi

# Executar migração e atualização do banco de dados
echo "Executando migrações do banco de dados..."

# Primeiro, tenta fazer o push normal do schema com Drizzle
npm run db:push || {
  echo "Falha no push do Drizzle. Verificando conexão e permissões do banco de dados."
  echo "Tentando novamente em 5 segundos..."
  sleep 5
  npm run db:push || {
    echo "Falha no push do Drizzle novamente. Tentando método alternativo de atualização de schema..."
    
    # Se o push falhar, tenta rodar o script de atualização personalizado
    NODE_ENV=production node dist/scripts/update-schema.js || {
      echo "Falha no script de atualização de schema. A aplicação será iniciada mesmo assim."
    }
  }
}

echo "==================================================="
echo "TRIPULANTE DASHBOARD - INICIANDO EM MODO PRODUÇÃO"
echo "Ambiente: ${NODE_ENV:-production}"
echo "Banco de dados: PostgreSQL externo (via DATABASE_URL)"
echo "Host do Banco: $DB_HOST_FROM_URL"
if [ -n "$SUPABASE_URL" ]; then
  echo "Supabase: Configurado e ativo"
else
  echo "Supabase: Não configurado ou usando valores padrão"
fi
echo "==================================================="

# Iniciar a aplicação
echo "Iniciando aplicação..."
exec "$@"