#!/bin/bash
set -e

# Script para inicializar o banco de dados quando o contêiner for iniciado pela primeira vez
echo "Executando inicialização do banco de dados..."

# Verifica se a variável de ambiente DATABASE_URL está definida
if [ -z "$DATABASE_URL" ]; then
  echo "Erro: DATABASE_URL não está definida"
  exit 1
fi

# Configurações do Supabase
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Aviso: Variáveis SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidas"
fi

# Executa as migrações do banco de dados
echo "Aplicando migrações do banco de dados..."
npm run db:push

echo "Inicialização do banco de dados concluída com sucesso!" 