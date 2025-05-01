FROM node:18-alpine AS base

# Definir o diretório de trabalho
WORKDIR /app

# Instalar dependências
FROM base as deps
COPY package.json package-lock.json ./
RUN npm ci

# Construir aplicação
FROM deps as builder
COPY . .
RUN npm run build

# Imagem de produção
FROM base as runner

ENV NODE_ENV production

# Copiar arquivos necessários
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/index.js"] 