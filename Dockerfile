# Estágio de build
FROM node:20-alpine AS builder

WORKDIR /build

# Instalar dependências do sistema necessárias para o build
RUN apk add --no-cache python3 make g++

# Copiar arquivos de package.json primeiro (para aproveitar o cache do Docker)
COPY package*.json ./

# Instalar dependências críticas explicitamente para garantir disponibilidade
RUN npm install @vitejs/plugin-react swagger-jsdoc swagger-ui-express --save

# Instalar todas as dependências
RUN npm ci

# Criar diretório de scripts
RUN mkdir -p scripts

# Copiar código fonte
COPY . .

# Verificar se vitest.config.ts existe e removê-lo temporariamente para build de produção
RUN if [ -f "vitest.config.ts" ]; then mv vitest.config.ts vitest.config.ts.bak; fi

# Remover referências a pacotes que podem causar problemas
COPY scripts/fix-dependencies.js ./scripts/
RUN node ./scripts/fix-dependencies.js

# Compilar o código
RUN NODE_ENV=production npm run build

# Verificar e corrigir o código compilado
COPY scripts/fix-swagger-deps.js ./scripts/
RUN node ./scripts/fix-swagger-deps.js

# Restaurar vitest.config.ts se foi removido
RUN if [ -f "vitest.config.ts.bak" ]; then mv vitest.config.ts.bak vitest.config.ts; fi

# Verificar a estrutura do diretório após o build
RUN ls -la dist/ || echo "Diretório dist não encontrado"
RUN ls -la dist/public/ || echo "Diretório dist/public não encontrado"
RUN ls -la dist/server/ || echo "Diretório dist/server não encontrado"

# Remover devDependencies para reduzir o tamanho da imagem final
# Mas manter as dependências críticas mesmo que sejam devDependencies
RUN npm prune --production && \
    npm install swagger-jsdoc swagger-ui-express --no-save

# Estágio de produção
FROM node:20-alpine AS production

WORKDIR /app

# Instalar ferramentas necessárias em produção
RUN apk add --no-cache curl wget busybox-extras jq

# Copiar artefatos do build
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package*.json ./

# Instalar explicitamente swagger-jsdoc e swagger-ui-express no ambiente de produção
RUN npm install swagger-jsdoc swagger-ui-express --save

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
COPY scripts/fix-runtime.sh ./scripts/
RUN chmod +x ./scripts/fix-runtime.sh || echo "Script de correção em runtime não encontrado"

# Criar arquivos de configuração vazios se não existirem
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

# Verificação de saúde
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -q --spider http://localhost:3000/api/health || curl -f http://localhost:3000/api/health || exit 1

# Expor porta
EXPOSE 3000

# Usar script de inicialização 
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "dist/server/index.js"]