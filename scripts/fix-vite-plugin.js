#!/usr/bin/env node

/**
 * Este script verifica e corrige problemas com o pacote @vitejs/plugin-react
 * durante o processo de build, garantindo que ele esteja corretamente instalado
 * e disponível para o Vite.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

console.log('🔍 Verificando instalação do @vitejs/plugin-react...');

// Verifica se o pacote está instalado
function isPackageInstalled(packageName) {
  try {
    const nodeModulesPath = path.join(rootDir, 'node_modules', packageName);
    return fs.existsSync(nodeModulesPath);
  } catch (err) {
    return false;
  }
}

// Verifica se o pacote está listado no package.json
function isPackageInDependencies(packageName) {
  try {
    const packageJsonPath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    return (
      (packageJson.dependencies && packageJson.dependencies[packageName]) ||
      (packageJson.devDependencies && packageJson.devDependencies[packageName])
    );
  } catch (err) {
    console.error('❌ Erro ao ler package.json:', err.message);
    return false;
  }
}

// Verifica se o vite.config.ts faz referência ao pacote
function isPackageUsedInViteConfig(packageName) {
  try {
    const viteConfigPath = path.join(rootDir, 'vite.config.ts');
    if (!fs.existsSync(viteConfigPath)) {
      console.warn('⚠️ Arquivo vite.config.ts não encontrado');
      return false;
    }
    
    const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
    return viteConfig.includes(packageName);
  } catch (err) {
    console.error('❌ Erro ao ler vite.config.ts:', err.message);
    return false;
  }
}

// Instala o pacote se necessário
function installPackage(packageName) {
  console.log(`📦 Instalando ${packageName}...`);
  try {
    execSync(`npm install ${packageName} --save-dev`, { 
      cwd: rootDir, 
      stdio: 'inherit' 
    });
    console.log(`✅ ${packageName} instalado com sucesso!`);
    return true;
  } catch (err) {
    console.error(`❌ Falha ao instalar ${packageName}:`, err.message);
    return false;
  }
}

// Verifica o Vite Plugin React
const packageName = '@vitejs/plugin-react';

console.log('🔄 Verificando status do pacote:');
const isInstalled = isPackageInstalled(packageName);
const isInDependencies = isPackageInDependencies(packageName);
const isUsedInConfig = isPackageUsedInViteConfig(packageName);

console.log(`- Presente no node_modules: ${isInstalled ? '✅ Sim' : '❌ Não'}`);
console.log(`- Listado no package.json: ${isInDependencies ? '✅ Sim' : '❌ Não'}`);
console.log(`- Usado no vite.config.ts: ${isUsedInConfig ? '✅ Sim' : '❌ Não'}`);

// Corrigir se necessário
if (!isInstalled || !isInDependencies) {
  console.log('🛠️ Corrigindo instalação do pacote...');
  const success = installPackage(packageName);
  
  if (success) {
    console.log('✅ Correção aplicada com sucesso!');
  } else {
    console.error('⚠️ Não foi possível corrigir automaticamente. É necessário verificar manualmente.');
    console.error('Sugestão: Adicione "@vitejs/plugin-react": "^4.4.1" nas devDependencies do package.json e execute npm install.');
    process.exit(1);
  }
} else {
  console.log('✅ @vitejs/plugin-react está corretamente instalado e configurado!');
}

console.log('✨ Verificação concluída!'); 