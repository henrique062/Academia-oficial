#!/bin/sh
# Patch de emergência para remover as dependências do Replit
set -e

echo "====================================================="
echo "🔧 PATCH DE EMERGÊNCIA - REMOVENDO PLUGIN DO REPLIT"
echo "====================================================="

# Verificar diretório dist
if [ ! -d "/app/dist" ]; then
  echo "❌ ERRO: Diretório /app/dist não encontrado!"
  exit 1
fi

# Verificar arquivo principal do servidor
SERVER_INDEX="/app/dist/server/index.js"
if [ ! -f "$SERVER_INDEX" ]; then
  echo "❌ ERRO: Arquivo principal do servidor não encontrado em $SERVER_INDEX"
  exit 1
fi

# Fazer backup do arquivo principal
echo "📦 Fazendo backup do arquivo principal..."
cp "$SERVER_INDEX" "$SERVER_INDEX.bak"
echo "✅ Backup criado em $SERVER_INDEX.bak"

# Aplicar correções no arquivo principal
echo "🔧 Aplicando correções no arquivo principal..."
sed -i 's/.*@replit\/vite-plugin-runtime-error-modal.*//g' "$SERVER_INDEX"
sed -i '/import\s*{\s*}\s*from/d' "$SERVER_INDEX"

# Verificar se o patch foi efetivo
if grep -q "@replit/vite-plugin-runtime-error-modal" "$SERVER_INDEX"; then
  echo "⚠️ AVISO: Ainda existem referências ao plugin do Replit no arquivo principal!"
else
  echo "✅ Arquivo principal corrigido com sucesso!"
fi

# Corrigir todos os arquivos JS no diretório dist
echo "🔍 Buscando outros arquivos com referências ao plugin do Replit..."
find /app/dist -type f -name "*.js" -exec grep -l "@replit/vite-plugin-runtime-error-modal" {} \; | while read file; do
  echo "  🔧 Corrigindo: $file"
  cp "$file" "$file.bak"
  sed -i 's/.*@replit\/vite-plugin-runtime-error-modal.*//g' "$file"
  sed -i '/import\s*{\s*}\s*from/d' "$file"
done

echo "🔍 Verificando se restaram referências..."
REMAINING=$(grep -r "@replit/vite-plugin-runtime-error-modal" --include="*.js" /app/dist | wc -l)
if [ "$REMAINING" -eq 0 ]; then
  echo "✅ TODAS AS REFERÊNCIAS AO PLUGIN DO REPLIT FORAM REMOVIDAS!"
else
  echo "⚠️ AVISO: Ainda existem $REMAINING referências ao plugin do Replit."
  echo "   Arquivos afetados:"
  grep -r "@replit/vite-plugin-runtime-error-modal" --include="*.js" /app/dist | cut -d: -f1 | sort | uniq
fi

echo "====================================================="
echo "🏁 PATCH CONCLUÍDO"
echo "====================================================="
echo ""
echo "Para reiniciar o servidor, execute:"
echo "node /app/dist/server/index.js"
echo "" 