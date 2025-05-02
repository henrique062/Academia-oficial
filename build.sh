#!/bin/bash
# Script para construir a aplicação para implantação no EasyPanel

set -e  # Sair se qualquer comando falhar

echo "🚀 Iniciando build do Tripulante Dashboard para EasyPanel..."

# Verificar Node.js
echo "📋 Verificando ambiente..."
node -v
npm -v

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci

# Compilar o projeto
echo "🔨 Compilando o projeto..."
npm run build

# Verificar diretórios gerados
echo "🔍 Verificando diretórios gerados..."
ls -la
ls -la dist/
ls -la dist/server/

echo "✅ Build concluído com sucesso!"
echo "Para implantar no EasyPanel, execute: easypanel app deploy tripulante-dashboard" 