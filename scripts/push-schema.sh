#!/bin/bash

# Esta script executa o comando drizzle-kit push para criar as tabelas no banco de dados
# Usando a URL direta do Supabase

echo "Iniciando migração com drizzle-kit push..."

# Definir a URL do banco de dados Supabase
# Formato: postgresql://[user]:[password]@[host]:[port]/[db]
# Nota: Esta é apenas uma URL de exemplo e não funcionará sem as credenciais corretas
export DATABASE_URL="postgresql://postgres.tybdysmxmxzwebaooeqj:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5YmR5c214bXh6d2ViYW9vZXFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjA1MzU4MywiZXhwIjoyMDYxNjI5NTgzfQ.1cPee3mXQujnT28QzfLqfMg5ji2Jvi6JtdZdS9k_WyA@db.tybdysmxmxzwebaooeqj.supabase.co:5432/postgres"

# Executar push para criar as tabelas
npx drizzle-kit push

echo "Migração concluída!"