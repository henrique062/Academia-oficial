#!/bin/sh
set -e

# Exibir informações do ambiente
echo "====================================================="
echo "🚀 INICIANDO TRIPULANTE DASHBOARD - MODO PRODUÇÃO"
echo "====================================================="

# Verificar diretórios e arquivos importantes
echo "Verificando arquivos críticos..."
ls -la /app

if [ ! -d "/app/dist" ]; then
  echo "❌ ERRO CRÍTICO: Diretório /app/dist não encontrado!"
  echo "O build da aplicação falhou ou não foi copiado corretamente."
  exit 1
fi

if [ ! -d "/app/dist/server" ]; then
  echo "❌ ERRO CRÍTICO: Diretório /app/dist/server não encontrado!"
  echo "O build do servidor falhou ou não foi copiado corretamente."
  exit 1
fi

if [ ! -f "/app/dist/server/index.js" ]; then
  echo "❌ ERRO CRÍTICO: Arquivo /app/dist/server/index.js não encontrado!"
  echo "O build do servidor está incompleto."
  exit 1
fi

# Verificar se o pacote @vitejs/plugin-react está na pasta node_modules
echo "Verificando dependências críticas..."
if [ ! -d "/app/node_modules/@vitejs" ] || [ ! -d "/app/node_modules/@vitejs/plugin-react" ]; then
  echo "⚠️ Aviso: Pacote @vitejs/plugin-react não encontrado em node_modules."
  
  # Verificar se temos permissão para instalar (apenas se não estiver rodando como usuário não-root)
  if [ "$(id -u)" = "0" ]; then
    echo "🔧 Tentando instalar @vitejs/plugin-react..."
    npm install @vitejs/plugin-react --no-save || echo "❌ Falha ao instalar o pacote."
  else
    echo "ℹ️ Executando como usuário não-root, não é possível instalar pacotes."
  fi
fi

# Verificar se as pastas public e assets existem
if [ ! -d "/app/dist/public" ]; then
  echo "⚠️ Aviso: Diretório /app/dist/public não encontrado!"
  echo "Criando diretório para assets estáticos..."
  mkdir -p /app/dist/public
else
  echo "✅ Diretório de assets públicos encontrado."
  if [ -d "/app/dist/public/assets" ]; then
    echo "✅ Assets da aplicação encontrados."
  else
    echo "⚠️ Aviso: Pasta assets não encontrada em dist/public."
  fi
fi

# Verificar se temos arquivos estáticos em /app/dist/server/public
if [ -d "/app/dist/server/public" ] && [ "$(ls -A /app/dist/server/public 2>/dev/null)" ]; then
  echo "⚠️ Detectados arquivos estáticos em /app/dist/server/public, copiando para /app/dist/public..."
  cp -r /app/dist/server/public/* /app/dist/public/ 2>/dev/null || echo "❌ Falha ao copiar arquivos estáticos"
fi

# Verificar que temos arquivos estáticos em /app/dist/public
if [ ! "$(ls -A /app/dist/public 2>/dev/null)" ]; then
  echo "⚠️ Diretório /app/dist/public está vazio! Isso pode causar problemas de renderização."
  # Tentar criar um index.html mínimo para evitar erros críticos
  echo "<html><body><h1>Placeholder Page</h1><p>Este é um arquivo temporário. Os arquivos estáticos não foram encontrados.</p></body></html>" > /app/dist/public/index.html
fi

# Executar script de correção para o EasyPanel, se existir
if [ -f "/app/scripts/easypanel-fix.sh" ]; then
  echo "🔧 Executando script de correção para o EasyPanel..."
  sh /app/scripts/easypanel-fix.sh
else
  echo "ℹ️ Script de correção para o EasyPanel não encontrado (opcional)."
  
  # Criar script fix-easypanel.sh se não existir
  mkdir -p /app/scripts
  cat > /app/scripts/easypanel-fix.sh << 'EOF'
#!/bin/sh
# Script de correção para EasyPanel
echo "Verificando possíveis problemas conhecidos..."

# Verificar imports no arquivo server/index.js
if grep -q "@vitejs/plugin-react" /app/dist/server/index.js; then
  echo "⚠️ Detectada referência a @vitejs/plugin-react no código compilado!"
  echo "🔧 Removendo referências a @vitejs/plugin-react do servidor..."
  sed -i 's/.*@vitejs\/plugin-react.*//g' /app/dist/server/index.js
  echo "✅ Correção aplicada ao servidor."
fi

# Outros problemas conhecidos podem ser corrigidos aqui
echo "✅ Verificação completa."
EOF
  chmod +x /app/scripts/easypanel-fix.sh
  echo "🔧 Script de correção criado. Executando..."
  sh /app/scripts/easypanel-fix.sh
fi

# Verificar se as variáveis do Supabase estão definidas
echo "Verificando configuração do Supabase..."

# Tentar carregar variáveis de ambiente de um arquivo .env se existir
if [ -f ".env" ]; then
  echo "🔍 Arquivo .env encontrado, carregando variáveis..."
  # Extrair variáveis do Supabase do arquivo .env (somente se não estiverem definidas)
  if [ -z "$SUPABASE_URL" ] && grep -q "SUPABASE_URL" .env; then
    export SUPABASE_URL=$(grep "SUPABASE_URL" .env | cut -d '=' -f2)
    echo "✅ SUPABASE_URL carregada do arquivo .env"
  fi
  if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ] && grep -q "SUPABASE_SERVICE_ROLE_KEY" .env; then
    export SUPABASE_SERVICE_ROLE_KEY=$(grep "SUPABASE_SERVICE_ROLE_KEY" .env | cut -d '=' -f2)
    echo "✅ SUPABASE_SERVICE_ROLE_KEY carregada do arquivo .env"
  fi
fi

# Verificar se as variáveis estão definidas agora
if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "✅ Credenciais do Supabase configuradas através das variáveis de ambiente"
  # Mostrar versão truncada das credenciais por segurança
  SUPABASE_URL_PREFIX=$(echo "$SUPABASE_URL" | cut -c1-20)
  SUPABASE_KEY_PREFIX=$(echo "$SUPABASE_SERVICE_ROLE_KEY" | cut -c1-10)
  echo "🔌 Conectando ao Supabase URL: ${SUPABASE_URL_PREFIX}... (chave: ${SUPABASE_KEY_PREFIX}...)"
else
  echo "⚠️ Credenciais do Supabase incompletas!"
  echo "  SUPABASE_URL: ${SUPABASE_URL:-(não definida)}"
  echo "  SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY:+configurada}${SUPABASE_SERVICE_ROLE_KEY:-(não definida)}"
  
  # Criar arquivo .env temporário com variáveis vazias para não falhar completamente
  echo "🔧 Criando arquivo .env temporário com variáveis vazias para debug..."
  cat > .env << EOF
# Arquivo .env temporário criado pelo script de inicialização
# Substitua estes valores pelas suas credenciais reais do Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
NODE_ENV=production
PORT=3000
EOF
  echo "⚠️ A aplicação pode não funcionar corretamente sem estas credenciais."
  echo "⚠️ Edite o arquivo .env no container ou configure as variáveis no EasyPanel."
fi

# Exibir informações importantes
echo "====================================================="
echo "Ambiente: ${NODE_ENV:-production}"
echo "Porta: ${PORT:-3000}"
echo "Diretório atual: $(pwd)"
echo "Comando a ser executado: $@"
echo "====================================================="

# Iniciar a aplicação
echo "🟢 Iniciando aplicação..."
exec "$@"