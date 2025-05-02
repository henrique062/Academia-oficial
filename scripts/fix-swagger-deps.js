// Script para lidar com as dependências do Swagger
const fs = require('fs');
const path = require('path');

console.log('🔧 Verificando e corrigindo dependências do Swagger...');

// Caminhos dos arquivos
const serverIndexPath = path.join(__dirname, '../dist/server/index.js');

// Verificar se o arquivo existe
if (!fs.existsSync(serverIndexPath)) {
  console.error('❌ Arquivo do servidor não encontrado em:', serverIndexPath);
  process.exit(1);
}

// Ler o arquivo
let serverCode = fs.readFileSync(serverIndexPath, 'utf8');

// Verificar se swagger-jsdoc está sendo importado
if (serverCode.includes('swagger-jsdoc') || serverCode.includes('swagger-ui-express')) {
  console.log('⚠️ Referências ao Swagger detectadas no código do servidor.');
  
  // Tentar tornar o código do swagger condicional
  const modifiedCode = serverCode.replace(
    /import\s+.*?swagger-jsdoc.*?from\s+['"]swagger-jsdoc['"];?/g,
    `
// Importação condicional do swagger-jsdoc
let swaggerJsdoc;
try {
  swaggerJsdoc = await import('swagger-jsdoc');
  swaggerJsdoc = swaggerJsdoc.default || swaggerJsdoc;
  console.log('✅ swagger-jsdoc carregado com sucesso');
} catch (err) {
  console.warn('⚠️ swagger-jsdoc não encontrado, API docs não estarão disponíveis');
  swaggerJsdoc = () => ({ openapi: '3.0.0', info: { title: 'API', version: '1.0.0' }, paths: {} });
}
`
  );
  
  // Tornar o swagger-ui-express condicional também
  const modifiedCode2 = modifiedCode.replace(
    /import\s+.*?swagger-ui-express.*?from\s+['"]swagger-ui-express['"];?/g,
    `
// Importação condicional do swagger-ui-express
let swaggerUi;
try {
  swaggerUi = await import('swagger-ui-express');
  swaggerUi = swaggerUi.default || swaggerUi;
  console.log('✅ swagger-ui-express carregado com sucesso');
} catch (err) {
  console.warn('⚠️ swagger-ui-express não encontrado, API docs não estarão disponíveis');
  swaggerUi = { 
    serve: () => (req, res, next) => next(),
    setup: () => (req, res) => res.status(404).json({ error: 'API docs não disponíveis' })
  };
}
`
  );
  
  // Salvar o arquivo modificado
  fs.writeFileSync(serverIndexPath, modifiedCode2);
  console.log('✅ Código do servidor modificado para lidar com a ausência de swagger-jsdoc');
} else {
  console.log('✅ Nenhuma referência ao Swagger encontrada no código do servidor');
}

console.log('✅ Verificação e correções do Swagger concluídas!'); 