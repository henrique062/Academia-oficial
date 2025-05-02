#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDistDir = path.join(__dirname, '..', 'dist', 'server');
const publicDistDir = path.join(__dirname, '..', 'dist', 'public');

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

// Função para criar o diretório se não existir
const ensureDirectoryExists = (dirPath) => {
  if (!directoryExists(dirPath)) {
    console.log(`Criando diretório: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  }
  return false;
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
  let modified = false;

  // Remover importações do Vitest
  if (content.includes('@vitest/plugin-react')) {
    content = content.replace(/import.*['"]@vitest\/plugin-react['"].*?;?\n/g, '');
    content = content.replace(/['"]@vitest\/plugin-react['"]/g, '""');
    modified = true;
  }

  // Remover qualquer referência ao plugin React que possa causar problemas em runtime
  if (content.includes('@vitejs/plugin-react')) {
    content = content.replace(/import.*['"]@vitejs\/plugin-react['"].*?;?\n/g, '');
    content = content.replace(/['"]@vitejs\/plugin-react['"]/g, '""');
    
    // Remover chamadas de função ao plugin react() que podem estar sem a importação
    content = content.replace(/react\(\)/g, '{}');
    content = content.replace(/react\(.*?\)/g, '{}');
    
    modified = true;
  }

  // Verificar e corrigir importações de path e dirname em ESM
  if (content.includes('__dirname') || content.includes('__filename')) {
    // Adicionar importações necessárias para __dirname em ESM se não existirem
    const importPathLine = `import path from 'path';\nimport { fileURLToPath } from 'url';\n`;
    const dirnameDefinition = `\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = path.dirname(__filename);\n`;
    
    if (!content.includes('fileURLToPath(import.meta.url)')) {
      // Apenas adicionar se não existir
      if (!content.includes('import path from')) {
        content = importPathLine + content;
      }
      
      // Encontrar o final do bloco de importações para adicionar a definição de __dirname
      const importEndIndex = content.lastIndexOf('import ');
      if (importEndIndex !== -1) {
        const nextNewlineAfterImports = content.indexOf('\n', importEndIndex);
        if (nextNewlineAfterImports !== -1) {
          content = content.slice(0, nextNewlineAfterImports + 1) + 
                   dirnameDefinition + 
                   content.slice(nextNewlineAfterImports + 1);
        }
      }
      
      modified = true;
    }
  }
  
  // Verificar se foram feitas alterações
  if (modified) {
    console.log(`Corrigido: ${filePath}`);
    fs.writeFileSync(filePath, content, 'utf8');
  }
};

// Garantir que o diretório public exista
const ensurePublicDir = () => {
  if (ensureDirectoryExists(publicDistDir)) {
    console.log('Diretório public não existia e foi criado.');
    
    // Criar um arquivo index.html básico para garantir que haja conteúdo estático
    const indexPath = path.join(publicDistDir, 'index.html');
    if (!fileExists(indexPath)) {
      console.log('Criando arquivo index.html básico...');
      const basicHtml = `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aplicação</title>
</head>
<body>
  <h1>Arquivos estáticos</h1>
  <p>Os arquivos estáticos não foram gerados corretamente.</p>
</body>
</html>`;
      fs.writeFileSync(indexPath, basicHtml, 'utf8');
    }
  }
};

console.log("🔧 Iniciando correção dos arquivos de build...");

// Processar o diretório de saída do servidor
if (directoryExists(serverDistDir)) {
  processDirectory(serverDistDir);
  console.log("✅ Processamento do servidor concluído!");
} else {
  console.error(`⚠️ Diretório de build do servidor não encontrado: ${serverDistDir}`);
}

// Garantir que o diretório public exista
ensurePublicDir();

console.log("✅ Processamento concluído!"); 