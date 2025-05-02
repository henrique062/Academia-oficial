# Estágio de build
FROM node:20-alpine AS builder

WORKDIR /build

# Instalar dependências do sistema necessárias para o build
RUN apk add --no-cache python3 make g++

# Copiar arquivos de dependências primeiro (para aproveitar o cache do Docker)
COPY package*.json ./

# Instalar explicitamente o @vitejs/plugin-react primeiro para garantir que esteja disponível
RUN npm install @vitejs/plugin-react --save-dev

# Tentar instalar o plugin do Replit como opcional (não falhar se não estiver disponível)
RUN npm install @replit/vite-plugin-runtime-error-modal --save-dev --no-fund --no-audit || echo "Plugin do Replit não disponível, continuando sem ele..."

# Instalar o swagger-jsdoc explicitamente
RUN npm install swagger-jsdoc swagger-ui-express --save

# Instalar todas as dependências (incluindo devDependencies)
RUN npm ci

# Criar diretório de scripts se não existir
RUN mkdir -p scripts

# Copiar código fonte
COPY . .

# Verificar se vitest.config.ts existe e removê-lo para build de produção
RUN if [ -f "vitest.config.ts" ]; then mv vitest.config.ts vitest.config.ts.bak; fi

# Remover referências ao plugin do Replit dos arquivos de configuração
RUN echo "🔍 Verificando e removendo referências ao plugin do Replit..."
RUN grep -r "@replit/vite-plugin-runtime-error-modal" --include="*.ts" --include="*.js" . || echo "Nenhuma referência encontrada"
RUN find . -type f -name "*.ts" -o -name "*.js" | xargs sed -i 's/.*@replit\/vite-plugin-runtime-error-modal.*//g' || echo "Sem alterações"
RUN find . -type f -name "*.ts" -o -name "*.js" | xargs sed -i '/import\s*{\s*}\s*from/d' || echo "Sem importações vazias"

# Verificar se o plugin react está disponível antes de prosseguir
RUN ls -la node_modules/@vitejs || echo "Diretório @vitejs não encontrado!"
RUN ls -la node_modules/@vitejs/plugin-react || echo "Plugin react não encontrado!"

# Compilar o código TypeScript e os assets
RUN NODE_ENV=production npm run build

# Aplicar correções após o build para tornar o swagger opcional
COPY scripts/fix-swagger-deps.js /build/scripts/fix-swagger-deps.js
RUN node /build/scripts/fix-swagger-deps.js

# Restaurar vitest.config.ts se foi removido
RUN if [ -f "vitest.config.ts.bak" ]; then mv vitest.config.ts.bak vitest.config.ts; fi

# Verificar a estrutura do diretório após o build
RUN ls -la dist/ || echo "Diretório dist não encontrado"
RUN ls -la dist/public/ || echo "Diretório dist/public não encontrado"
RUN ls -la dist/server/ || echo "Diretório dist/server não encontrado"

# Remover devDependencies para reduzir o tamanho da imagem final
RUN npm prune --production

# Estágio de produção
FROM node:20-alpine AS production

WORKDIR /app

# Instalar ferramentas necessárias em produção (reduzidas sem PostgreSQL)
RUN apk add --no-cache curl wget busybox-extras jq

# Copiar artefatos do build
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package*.json ./

# Verificar estrutura após a cópia
RUN ls -la
RUN ls -la dist/ || echo "Diretório dist não encontrado"
RUN ls -la dist/server/ || echo "Diretório dist/server não encontrado"
RUN ls -la dist/public/ || echo "Diretório dist/public não encontrado"

# Criar diretórios para scripts
RUN mkdir -p scripts/supabase

# Copiar scripts necessários
COPY --from=builder /build/scripts ./scripts
COPY easypanel-entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Garantir que scripts de correção tenham permissão de execução
RUN chmod +x ./scripts/fix-build.js || echo "Script de build não encontrado"
RUN [ ! -f "./scripts/easypanel-fix.sh" ] && echo '#!/bin/sh\n\
# Verificar e criar diretório public se não existir\n\
if [ ! -d "/app/dist/public" ]; then\n\
  mkdir -p /app/dist/public\n\
  echo "Diretório public criado em /app/dist/public"\n\
fi\n\
# Copiar arquivos estáticos para o local correto se necessário\n\
if [ -d "/app/dist/server/public" ] && [ ! -d "/app/dist/public" ]; then\n\
  cp -r /app/dist/server/public/* /app/dist/public/\n\
  echo "Arquivos copiados de dist/server/public para dist/public"\n\
fi\n\
echo "Script de correção para o EasyPanel executado com sucesso!"' > /app/scripts/easypanel-fix.sh || true
RUN chmod +x ./scripts/easypanel-fix.sh || echo "Não foi possível criar script de correção"

# Criar arquivos de configuração vazios (ignorando se já existem)
RUN touch .env.example drizzle.config.ts

# Ajustar permissions para scripts
RUN find /app/scripts -type f -name "*.sh" -exec chmod +x {} \;

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# ======================================================
# IMPORTANTE: Você DEVE configurar estas variáveis no EasyPanel:
# - SUPABASE_URL: URL do seu projeto Supabase
# - SUPABASE_SERVICE_ROLE_KEY: Chave de serviço do Supabase
# 
# A aplicação NÃO funcionará corretamente sem estas credenciais.
# Você pode configurá-las como variáveis de ambiente no EasyPanel.
# ======================================================

# Verificação de saúde mais robusta
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -q --spider http://localhost:3000/api/health || curl -f http://localhost:3000/api/health || exit 1

# Expor porta
EXPOSE 3000

# Usar script de inicialização modificado para EasyPanel
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "dist/server/index.js"]