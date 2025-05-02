#!/bin/bash
# Script para configurar funções SQL no Supabase

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ Erro: Variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar definidas"
  exit 1
fi

SCRIPT_DIR="$(dirname "$0")"
SQL_FILE="${SCRIPT_DIR}/setup-functions.sql"

if [ ! -f "$SQL_FILE" ]; then
  echo "❌ Erro: Arquivo SQL não encontrado em: $SQL_FILE"
  exit 1
fi

echo "🚀 Iniciando configuração do Supabase..."
echo "📋 URL: ${SUPABASE_URL}"

# Ler o conteúdo do arquivo SQL
SQL_CONTENT=$(cat "$SQL_FILE")

# Enviar requisição para o endpoint REST para executar as funções SQL
echo "📡 Enviando funções SQL para o Supabase..."
curl -s -X POST "${SUPABASE_URL}/rest/v1/rpc/execute_sql" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"sql_query\": $(echo "$SQL_CONTENT" | jq -Rs .)}" | jq .

echo ""
echo "✅ Configuração das funções SQL concluída!"

# Testar se a função get_tables está funcionando
echo "🔍 Testando a função get_tables..."
curl -s -X POST "${SUPABASE_URL}/rest/v1/rpc/get_tables" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{}" | jq .

echo ""
echo "✅ Setup do Supabase concluído com sucesso!" 