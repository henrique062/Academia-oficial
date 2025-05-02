#!/bin/sh
# Script de correção em runtime para o ambiente EasyPanel
set -e

echo "====================================================="
echo "🚀 INICIANDO VERIFICAÇÃO E CORREÇÃO DE RUNTIME"
echo "====================================================="

# Verificar estrutura de diretórios
if [ ! -d "/app/dist/public" ]; then
  echo "⚠️ Diretório /app/dist/public não encontrado! Criando..."
  mkdir -p /app/dist/public
  echo "✅ Diretório public criado"
fi

# Copiar arquivos estáticos se necessário
if [ -d "/app/dist/server/public" ] && [ ! "$(ls -A /app/dist/public 2>/dev/null)" ]; then
  echo "⚠️ Copiando arquivos estáticos de dist/server/public para dist/public..."
  cp -r /app/dist/server/public/* /app/dist/public/
  echo "✅ Arquivos estáticos copiados"
fi

# Verificar dependências críticas
echo "🔍 Verificando pacotes críticos..."

# 1. Verificar swagger-jsdoc
if ! npm list swagger-jsdoc >/dev/null 2>&1; then
  echo "⚠️ swagger-jsdoc não encontrado. Instalando..."
  npm install swagger-jsdoc swagger-ui-express --save
  
  if [ $? -ne 0 ]; then
    echo "❌ Falha ao instalar swagger-jsdoc. Aplicando correção no código..."
    
    # Verificar servidor compilado
    SERVER_INDEX="/app/dist/server/index.js"
    if [ -f "$SERVER_INDEX" ]; then
      # Backup
      cp "$SERVER_INDEX" "$SERVER_INDEX.bak"
      
      # Substituir importações de swagger por stubs
      sed -i 's/import.*swagger-jsdoc.*from.*$/const swaggerJsdoc = () => ({ openapi: "3.0.0", info: { title: "API", version: "1.0.0" }, paths: {} });/g' "$SERVER_INDEX"
      sed -i 's/import.*swagger-ui-express.*from.*$/const swaggerUi = { serve: () => (req, res, next) => next(), setup: () => (req, res) => res.status(404).json({ error: "API docs não disponíveis" }) };/g' "$SERVER_INDEX"
      
      echo "✅ Código do servidor corrigido"
    else
      echo "❌ Arquivo principal do servidor não encontrado em $SERVER_INDEX"
    fi
  else
    echo "✅ swagger-jsdoc instalado com sucesso"
  fi
else
  echo "✅ swagger-jsdoc já instalado"
fi

# 2. Verificar plugin do Replit
echo "🔍 Verificando referências ao plugin do Replit..."
if grep -q "@replit/vite-plugin-runtime-error-modal" /app/dist/server/index.js 2>/dev/null; then
  echo "⚠️ Referências ao plugin do Replit encontradas. Aplicando correção..."
  
  # Backup
  SERVER_INDEX="/app/dist/server/index.js"
  cp "$SERVER_INDEX" "$SERVER_INDEX.replit.bak"
  
  # Remover referências
  sed -i 's/.*@replit\/vite-plugin-runtime-error-modal.*//g' "$SERVER_INDEX"
  
  echo "✅ Referências ao plugin do Replit removidas"
else
  echo "✅ Nenhuma referência ao plugin do Replit encontrada"
fi

# 3. Verificar se o index.html está presente em dist/public
if [ ! -f "/app/dist/public/index.html" ]; then
  echo "⚠️ index.html não encontrado em dist/public. Verificando alternativas..."
  
  if [ -f "/app/dist/server/public/index.html" ]; then
    echo "🔍 index.html encontrado em dist/server/public. Copiando..."
    cp -r /app/dist/server/public/* /app/dist/public/
  else
    echo "⚠️ Criando index.html mínimo para evitar erros..."
    cat > /app/dist/public/index.html << EOF
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tripulante Dashboard</title>
</head>
<body>
  <h1>Tripulante Dashboard</h1>
  <p>Aguarde carregando recursos...</p>
</body>
</html>
EOF
  fi
  
  echo "✅ index.html criado/copiado com sucesso"
fi

echo "====================================================="
echo "✅ VERIFICAÇÃO E CORREÇÃO DE RUNTIME CONCLUÍDAS"
echo "=====================================================" 