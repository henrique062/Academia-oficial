#!/bin/sh
# Script para resolver problemas comuns de implantação no EasyPanel

set -e  # Sair em caso de erro

echo "🔧 Verificando e corrigindo problemas de implantação..."

# Verificar estrutura de diretórios
echo "📁 Verificando diretórios..."
for dir in dist dist/server dist/public; do
  if [ ! -d "/app/$dir" ]; then
    echo "⚠️ Diretório /app/$dir não encontrado. Criando..."
    mkdir -p "/app/$dir"
  fi
done

# Verificar arquivo principal do servidor
if [ ! -f "/app/dist/server/index.js" ]; then
  echo "❌ Arquivo index.js do servidor não encontrado!"
  
  # Criar um arquivo index.js mínimo que exibe uma mensagem de erro
  echo "⚠️ Criando um arquivo index.js temporário..."
  cat > "/app/dist/server/index.js" << 'EOF'
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 3000;

// Verificar se temos acesso ao diretório de arquivos estáticos
const publicDir = path.join(__dirname, '..', 'public');
const hasPublicFiles = fs.existsSync(publicDir);

// Criar um servidor HTTP simples
const server = http.createServer((req, res) => {
  if (req.url === '/api/health') {
    // Endpoint de saúde para o healthcheck
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'maintenance', message: 'Em manutenção' }));
    return;
  }
  
  // Página de erro para todas as outras rotas
  res.writeHead(503, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Aplicação em Manutenção</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
          h1 { color: #e74c3c; }
          pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow: auto; }
        </style>
      </head>
      <body>
        <h1>Aplicação em Manutenção</h1>
        <p>O servidor está temporariamente indisponível devido a problemas de configuração.</p>
        <p>Por favor, tente novamente mais tarde ou contate o administrador.</p>
        <p>Erro: Não foi possível carregar o arquivo index.js do servidor.</p>
      </body>
    </html>
  `);
});

// Iniciar o servidor
server.listen(port, () => {
  console.error(`⚠️ MODO DE EMERGÊNCIA: Servidor iniciado na porta ${port}`);
  console.error('⚠️ O arquivo index.js original não foi encontrado!');
  console.error('⚠️ Esta é uma página temporária de manutenção.');
});
EOF
  
  echo "✅ Arquivo index.js temporário criado!"
fi

# Verificar e corrigir permissões
echo "🔐 Corrigindo permissões..."
find /app/scripts -type f -name "*.sh" -exec chmod +x {} \; 2>/dev/null || true
find /app -type f -name "*.js" -exec chmod +x {} \; 2>/dev/null || true

echo "🧹 Limpando arquivos temporários..."
find /app -name "*.bak" -delete 2>/dev/null || true

echo "✅ Verificação e correção concluídas!" 