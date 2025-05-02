#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDistDir = path.join(__dirname, '..', 'dist', 'server');

// Função para verificar se o diretório existe
const directoryExists = (dirPath) => {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (err) {
    return false;
  }
};

// Função para verificar se o arquivo existe
const fileExists = (filePath) => {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
};

// Processar todos os arquivos JS no diretório
const processDirectory = (dirPath) => {
  if (!directoryExists(dirPath)) {
    console.error(`Diretório não encontrado: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      processDirectory(filePath); // Recursivamente processar subdiretórios
    } else if (file.endsWith('.js')) {
      processJSFile(filePath);
    }
  }
};

// Processar um arquivo JS
const processJSFile = (filePath) => {
  console.log(`Processando arquivo: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remover importações do Vitest
  content = content.replace(/import.*['"]@vitest\/plugin-react['"].*?;?\n/g, '');
  
  // Remover qualquer referência a plugins de teste
  content = content.replace(/['"]@vitest\/plugin-react['"]/g, '""');
  
  // Verificar se foram feitas alterações
  const originalContent = fs.readFileSync(filePath, 'utf8');
  if (content !== originalContent) {
    console.log(`Corrigido: ${filePath}`);
    fs.writeFileSync(filePath, content, 'utf8');
  }
};

console.log("🔧 Iniciando correção dos arquivos de build...");

// Processar o diretório de saída do servidor
if (directoryExists(serverDistDir)) {
  processDirectory(serverDistDir);
  console.log("✅ Processamento concluído!");
} else {
  console.error(`⚠️ Diretório de build do servidor não encontrado: ${serverDistDir}`);
  process.exit(1);
} 