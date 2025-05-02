#!/bin/sh
set -e

# Verificar variáveis de ambiente
echo "Checking environment variables..."
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set or empty."
  echo "Please configure the DATABASE_URL environment variable in EasyPanel."
  exit 1
fi

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "WARNING: Supabase environment variables are not set. Some features may not work properly."
fi

# Executar migração e atualização do banco de dados
echo "Running database migrations and schema updates..."

# Verificar se podemos conectar ao banco de dados
echo "Testing database connection..."
if pg_isready -d "$DATABASE_URL"; then
  echo "Database connection successful"
else
  echo "WARNING: Could not connect to the database using pg_isready."
  echo "Continuing anyway, will try to connect using the application."
fi

# Primeiro, tenta fazer o push normal do schema com Drizzle
npm run db:push || {
  echo "Drizzle push failed. Check connection and database permissions."
  echo "Retrying in 5 seconds..."
  sleep 5
  npm run db:push || {
    echo "Drizzle push failed again. Trying alternative schema update method..."
    
    # Se o push falhar, tenta rodar o script de atualização personalizado
    NODE_ENV=production tsx scripts/update-schema.ts || {
      echo "Schema update script failed. Will attempt to run application anyway."
    }
  }
}

# Verificar status do banco
echo "Verifying database access..."
node -e "const { db } = require('./server/db'); async function check() { try { await db.execute('SELECT 1'); console.log('Database connection successful'); } catch (err) { console.error('Database connection failed:', err.message); console.error('Will try to start application anyway...'); } } check();"

echo "==================================================="
echo "TRIPULANTE DASHBOARD - STARTING IN PRODUCTION MODE"
echo "Environment: ${NODE_ENV:-production}"
echo "Database: External PostgreSQL (via DATABASE_URL)"
echo "==================================================="

# Iniciar a aplicação
echo "Starting application..."
exec "$@"