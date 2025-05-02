/**
 * Script para remover referências a pacotes problemáticos antes do build
 * Este script analisa todos os arquivos .ts e .js para remover imports de pacotes
 * que possam causar problemas durante o build ou em runtime.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Verificando e corrigindo dependências problemáticas...');

// Lista de pacotes problemáticos
const PROBLEMATIC_PACKAGES = [
  '@replit/vite-plugin-runtime-error-modal',
  // Adicione outros pacotes problemáticos aqui se necessário
];

// Função para buscar todos os arquivos .ts e .js no diretório
function findAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      // Ignorar node_modules e diretórios gerados
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        findAllFiles(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Encontrar todos os arquivos no diretório atual
try {
  console.log('🔍 Buscando arquivos...');
  const allFiles = findAllFiles('.');
  console.log(`📂 Encontrados ${allFiles.length} arquivos para verificação.`);
  
  let modifiedFiles = 0;
  
  // Processar cada arquivo
  allFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let modified = false;
    
    // Verificar cada pacote problemático
    PROBLEMATIC_PACKAGES.forEach(pkg => {
      const importRegex = new RegExp(`import\\s+.*?['"]${pkg.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}['"].*?;?`, 'g');
      
      if (importRegex.test(content)) {
        console.log(`⚠️ Encontrada referência a '${pkg}' em: ${filePath}`);
        content = content.replace(importRegex, `// Importação removida: ${pkg}`);
        modified = true;
      }
    });
    
    // Remover importações vazias que podem ser geradas após as substituições
    const emptyImportRegex = /import\s*{\s*}\s*from\s*['"][^'"]*['"];?/g;
    if (emptyImportRegex.test(content)) {
      content = content.replace(emptyImportRegex, '// Importação vazia removida');
      modified = true;
    }
    
    // Salvar o arquivo se foi modificado
    if (modified) {
      fs.writeFileSync(filePath, content);
      modifiedFiles++;
      console.log(`✅ Arquivo modificado: ${filePath}`);
    }
  });
  
  console.log(`🔄 Total de arquivos modificados: ${modifiedFiles}`);
  
  // Verificar se o package.json precisa ser ajustado
  const packageJsonPath = './package.json';
  if (fs.existsSync(packageJsonPath)) {
    let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    let packageModified = false;
    
    // Garantir que swagger-jsdoc e swagger-ui-express estão nas dependências
    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }
    
    if (!packageJson.dependencies['swagger-jsdoc']) {
      packageJson.dependencies['swagger-jsdoc'] = "^7.0.0";
      packageModified = true;
      console.log('➕ Adicionado swagger-jsdoc às dependências');
    }
    
    if (!packageJson.dependencies['swagger-ui-express']) {
      packageJson.dependencies['swagger-ui-express'] = "^5.0.0";
      packageModified = true;
      console.log('➕ Adicionado swagger-ui-express às dependências');
    }
    
    // Remover pacotes problemáticos das dependências
    PROBLEMATIC_PACKAGES.forEach(pkg => {
      if (packageJson.dependencies && packageJson.dependencies[pkg]) {
        delete packageJson.dependencies[pkg];
        packageModified = true;
        console.log(`➖ Removido ${pkg} das dependências`);
      }
      
      if (packageJson.devDependencies && packageJson.devDependencies[pkg]) {
        delete packageJson.devDependencies[pkg];
        packageModified = true;
        console.log(`➖ Removido ${pkg} das devDependencies`);
      }
    });
    
    // Salvar package.json se foi modificado
    if (packageModified) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Arquivo package.json atualizado');
      
      // Atualizar node_modules se necessário
      try {
        console.log('🔄 Instalando dependências atualizadas...');
        execSync('npm install swagger-jsdoc swagger-ui-express --save');
        console.log('✅ Dependências atualizadas com sucesso');
      } catch (error) {
        console.warn('⚠️ Falha ao atualizar dependências:', error.message);
      }
    }
  }
  
  console.log('✅ Verificação e correção de dependências concluída!');
} catch (error) {
  console.error('❌ Erro durante a verificação e correção de dependências:', error);
  process.exit(1);
} 