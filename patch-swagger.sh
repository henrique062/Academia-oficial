#!/bin/sh
# Patch de emergência para instalar e corrigir o swagger-jsdoc
set -e

echo "====================================================="
echo "🔧 PATCH DE EMERGÊNCIA - INSTALANDO SWAGGER-JSDOC"
echo "====================================================="

# Verificar diretório app
if [ ! -d "/app" ]; then
  echo "❌ ERRO: Diretório /app não encontrado!"
  exit 1
fi

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

# Instalar swagger-jsdoc e swagger-ui-express
echo "📦 Instalando pacotes swagger..."
cd /app
npm install swagger-jsdoc swagger-ui-express --save

# Verificar se a instalação foi bem-sucedida
if [ $? -eq 0 ]; then
  echo "✅ Pacotes swagger instalados com sucesso!"
else
  echo "⚠️ Falha ao instalar pacotes swagger. Tentando solução alternativa..."
  
  # Fazer backup do arquivo principal
  echo "📦 Fazendo backup do arquivo principal..."
  cp "$SERVER_INDEX" "$SERVER_INDEX.bak"
  echo "✅ Backup criado em $SERVER_INDEX.bak"
  
  # Script Node.js para corrigir as importações
  echo "🔧 Criando script de correção..."
  cat > /app/fix-swagger.js << 'EOF'
const fs = require('fs');
const path = require('path');

const serverIndexPath = '/app/dist/server/index.js';
const serverCode = fs.readFileSync(serverIndexPath, 'utf8');

// Tornar o swagger-jsdoc opcional
const modifiedCode = serverCode.replace(
  /import\s+.*?swagger-jsdoc.*?from\s+['"]swagger-jsdoc['"];?/g,
  `
// Importação condicional do swagger-jsdoc
let swaggerJsdoc;
try {
  swaggerJsdoc = await import('swagger-jsdoc');
  swaggerJsdoc = swaggerJsdoc.default || swaggerJsdoc;
  console.log('✅ swagger-jsdoc carregado com sucesso');
} catch (err) {
  console.warn('⚠️ swagger-jsdoc não encontrado, API docs não estarão disponíveis');
  swaggerJsdoc = () => ({ openapi: '3.0.0', info: { title: 'API', version: '1.0.0' }, paths: {} });
}
`
);

// Tornar o swagger-ui-express opcional
const finalCode = modifiedCode.replace(
  /import\s+.*?swagger-ui-express.*?from\s+['"]swagger-ui-express['"];?/g,
  `
// Importação condicional do swagger-ui-express
let swaggerUi;
try {
  swaggerUi = await import('swagger-ui-express');
  swaggerUi = swaggerUi.default || swaggerUi;
  console.log('✅ swagger-ui-express carregado com sucesso');
} catch (err) {
  console.warn('⚠️ swagger-ui-express não encontrado, API docs não estarão disponíveis');
  swaggerUi = { 
    serve: () => (req, res, next) => next(),
    setup: () => (req, res) => res.status(404).json({ error: 'API docs não disponíveis' })
  };
}
`
);

fs.writeFileSync(serverIndexPath, finalCode);
console.log('✅ Arquivo corrigido com sucesso!');
EOF
  
  # Executar script de correção
  echo "🔧 Executando script de correção..."
  node /app/fix-swagger.js
  
  if [ $? -eq 0 ]; then
    echo "✅ Script de correção executado com sucesso!"
  else
    echo "❌ Falha ao executar script de correção."
    echo "🔧 Restaurando backup..."
    cp "$SERVER_INDEX.bak" "$SERVER_INDEX"
    echo "✅ Backup restaurado."
  fi
fi

echo "====================================================="
echo "🏁 PATCH CONCLUÍDO"
echo "====================================================="
echo ""
echo "Para reiniciar o servidor, execute:"
echo "node /app/dist/server/index.js"
echo "" 