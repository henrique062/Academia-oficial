#!/bin/sh
set -e

# Aguardar o PostgreSQL iniciar
echo "Waiting for PostgreSQL to start..."
until pg_isready -h db -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-tripulante}; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done
echo "PostgreSQL is up - executing database migrations"

# Verificar variáveis de ambiente
echo "Checking environment variables..."
if [ -z "$DATABASE_URL" ]; then
  echo "WARNING: DATABASE_URL is not set or empty."
  echo "Using default: postgres://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@db:5432/${POSTGRES_DB:-tripulante}"
  export DATABASE_URL="postgres://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@db:5432/${POSTGRES_DB:-tripulante}"
fi

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "WARNING: Supabase environment variables are not set. Some features may not work properly."
fi

# Executar migração e atualização do banco de dados
echo "Running database migrations and schema updates..."

# Primeiro, tenta fazer o push normal do schema com Drizzle
npm run db:push || {
  echo "Drizzle push failed. Check connection and database permissions."
  echo "Retrying in 5 seconds..."
  sleep 5
  npm run db:push || {
    echo "Drizzle push failed again. Trying alternative schema update method..."
    
    # Se o push falhar, tenta rodar o script de atualização personalizado
    NODE_ENV=production tsx scripts/update-schema.ts || {
      echo "Schema update script failed. Falling back to basic schema check."
      # Verificação básica de existência das tabelas usando psql direto
      echo "Attempting basic database setup with psql..."
      
      PGPASSWORD=${POSTGRES_PASSWORD:-postgres} psql -h ${DB_HOST:-db} -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-tripulante} -c "
        CREATE TABLE IF NOT EXISTS alunos (
          id_aluno SERIAL PRIMARY KEY,
          nome TEXT,
          email TEXT,
          telefone TEXT,
          situacao_atual TEXT,
          situacao_financeira TEXT,
          tripulante BOOLEAN DEFAULT FALSE,
          pais TEXT,
          cidade TEXT,
          estado TEXT,
          turma TEXT,
          data_inscricao TIMESTAMP DEFAULT NOW(),
          data_conclusao TIMESTAMP,
          certificado BOOLEAN DEFAULT FALSE,
          observacoes TEXT,
          metadata JSONB,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          email TEXT UNIQUE,
          nome_completo TEXT,
          role TEXT DEFAULT 'user',
          ativo BOOLEAN DEFAULT TRUE,
          ultimo_login TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      " || echo "Direct psql fallback failed too. Continuing anyway..."
    }
  }
}

# Verificar status do banco
echo "Verifying database access..."
node -e "const { db } = require('./server/db'); async function check() { try { await db.execute('SELECT 1'); console.log('Database connection successful'); } catch (err) { console.error('Database connection failed:', err.message); process.exit(1); } } check();" || {
  echo "Database verification failed. Please check your connection settings."
}

echo "==================================================="
echo "TRIPULANTE DASHBOARD - STARTING IN PRODUCTION MODE"
echo "Environment: ${NODE_ENV:-production}"
echo "Database: PostgreSQL"
echo "==================================================="

# Iniciar a aplicação
echo "Starting application..."
exec "$@"