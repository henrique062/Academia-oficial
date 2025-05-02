#!/bin/sh
# Script para remover manualmente todas as referências ao plugin do Replit
set -e

echo "====================================================="
echo "🔧 PATCH DE EMERGÊNCIA - REMOVENDO PLUGIN DO REPLIT"
echo "====================================================="

if [ ! -d "/app/dist" ]; then
  echo "❌ Diretório /app/dist não encontrado!"
  exit 1
fi

# Remover referências ao plugin do Replit em todos os arquivos JS
echo "🔍 Buscando arquivos que mencionam o plugin do Replit..."

# Contar ocorrências antes da correção
COUNT_BEFORE=$(grep -r "@replit/vite-plugin-runtime-error-modal" --include="*.js" /app/dist | wc -l)
echo "📊 Encontradas $COUNT_BEFORE referências ao plugin do Replit"

# Arquivos específicos conhecidos
SERVER_INDEX="/app/dist/server/index.js"
if [ -f "$SERVER_INDEX" ]; then
  echo "🔧 Corrigindo arquivo principal do servidor: $SERVER_INDEX"
  # Fazer backup do arquivo original
  cp "$SERVER_INDEX" "$SERVER_INDEX.bak"
  
  # Remover linhas com import do plugin do Replit
  sed -i 's/.*@replit\/vite-plugin-runtime-error-modal.*//g' "$SERVER_INDEX"
  
  # Remover imports vazios resultantes
  sed -i '/import\s*{\s*}\s*from/d' "$SERVER_INDEX"
  
  # Verificar se ainda há referências ao plugin
  if grep -q "@replit/vite-plugin-runtime-error-modal" "$SERVER_INDEX"; then
    echo "⚠️ Ainda existem referências ao plugin do Replit no arquivo $SERVER_INDEX"
  else
    echo "✅ Arquivo $SERVER_INDEX corrigido com sucesso"
  fi
else
  echo "⚠️ Arquivo principal do servidor não encontrado em $SERVER_INDEX"
fi

# Aplicar correção em todos os arquivos
find /app/dist -type f -name "*.js" -exec grep -l "@replit/vite-plugin-runtime-error-modal" {} \; | while read file; do
  echo "🔧 Corrigindo arquivo: $file"
  # Fazer backup do arquivo original
  cp "$file" "$file.bak"
  
  # Remover linhas com import do plugin do Replit
  sed -i 's/.*@replit\/vite-plugin-runtime-error-modal.*//g' "$file"
  
  # Remover imports vazios resultantes
  sed -i '/import\s*{\s*}\s*from/d' "$file"
  
  echo "✅ Arquivo corrigido: $file"
done

# Contar ocorrências após a correção
COUNT_AFTER=$(grep -r "@replit/vite-plugin-runtime-error-modal" --include="*.js" /app/dist | wc -l)
echo "📊 Restaram $COUNT_AFTER referências ao plugin do Replit"

if [ "$COUNT_AFTER" -eq 0 ]; then
  echo "✅ TODAS AS REFERÊNCIAS AO PLUGIN DO REPLIT FORAM REMOVIDAS!"
else
  echo "⚠️ AINDA EXISTEM $COUNT_AFTER REFERÊNCIAS AO PLUGIN DO REPLIT"
  grep -r "@replit/vite-plugin-runtime-error-modal" --include="*.js" /app/dist
fi

echo "====================================================="
echo "🏁 PATCH CONCLUÍDO"
echo "=====================================================" 