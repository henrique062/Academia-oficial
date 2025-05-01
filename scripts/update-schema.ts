import { db } from '../server/db';
import * as schema from '../shared/schema';
import { sql } from 'drizzle-orm';

// Helper para obter dados de resultado de consultas de forma segura
function getRowsFromResult(result: any): any[] {
  if (!result) return [];
  
  // Manipula diferentes formatos de resultado
  if (Array.isArray(result)) return result;
  if (result.rows && Array.isArray(result.rows)) return result.rows;
  if (typeof result === 'object' && result !== null) {
    // Tenta extrair array de resultado de outros formatos conhecidos
    const possibleArrayProps = ['rows', 'data', 'result', 'results'];
    for (const prop of possibleArrayProps) {
      if (Array.isArray(result[prop])) return result[prop];
    }
  }
  
  // Fallback: converte para array se possível ou retorna array vazio
  return Array.isArray(result) ? result : [];
}

/**
 * Este script atualiza o esquema do banco de dados para refletir 
 * a estrutura definida em shared/schema.ts
 * 
 * Importante: Este script deve ser executado com cuidado em ambientes
 * de produção pois pode causar perda de dados se as colunas forem removidas
 */
async function main() {
  console.log('===== ATUALIZADOR DE ESQUEMA DO BANCO DE DADOS =====');
  console.log('Iniciando atualização do esquema...');

  try {
    // Verificar se a tabela de alunos existe
    console.log('Verificando tabelas existentes...');
    const tablesResult = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    // Resultado formatado como array para compatibilidade
    const tablesArray = Array.isArray(tablesResult) 
      ? tablesResult 
      : (tablesResult as any).rows || [];
      
    const tables = tablesArray.map((row: any) => row.table_name);
    console.log('Tabelas encontradas:', tables);

    // Atualizar a estrutura da tabela alunos
    console.log('Atualizando tabela de alunos...');
    
    // Verificar se a tabela alunos existe
    if (!tables.includes('alunos')) {
      console.log('Tabela alunos não existe, criando...');
      await db.execute(sql`
        CREATE TABLE alunos (
          id_aluno SERIAL PRIMARY KEY,
          nome TEXT,
          email TEXT,
          telefone TEXT,
          situacao_atual TEXT,
          situacao_financeira TEXT,
          tripulante BOOLEAN DEFAULT FALSE,
          pais TEXT,
          cidade TEXT,
          estado TEXT,
          turma TEXT,
          data_inscricao TIMESTAMP DEFAULT NOW(),
          data_conclusao TIMESTAMP,
          certificado BOOLEAN DEFAULT FALSE,
          observacoes TEXT,
          metadata JSONB,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('Tabela alunos criada com sucesso!');
    } else {
      console.log('Tabela alunos já existe, verificando e adicionando colunas faltantes...');
      
      // Verificar colunas existentes
      const columnsResult = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'alunos'
      `);
      
      // Resultado formatado como array para compatibilidade
      const columnsArray = Array.isArray(columnsResult) 
        ? columnsResult 
        : (columnsResult as any).rows || [];
        
      const existingColumns = columnsArray.map((row: any) => row.column_name);
      console.log('Colunas existentes:', existingColumns);
      
      // Adicionar novas colunas se necessário
      const requiredColumns = [
        { name: 'telefone', type: 'TEXT' },
        { name: 'situacao_atual', type: 'TEXT' },
        { name: 'situacao_financeira', type: 'TEXT' },
        { name: 'tripulante', type: 'BOOLEAN', default: 'FALSE' },
        { name: 'cidade', type: 'TEXT' },
        { name: 'estado', type: 'TEXT' },
        { name: 'turma', type: 'TEXT' },
        { name: 'data_inscricao', type: 'TIMESTAMP', default: 'NOW()' },
        { name: 'data_conclusao', type: 'TIMESTAMP' },
        { name: 'certificado', type: 'BOOLEAN', default: 'FALSE' },
        { name: 'observacoes', type: 'TEXT' },
        { name: 'metadata', type: 'JSONB' },
        { name: 'created_at', type: 'TIMESTAMP', default: 'NOW()' },
        { name: 'updated_at', type: 'TIMESTAMP', default: 'NOW()' }
      ];
      
      for (const column of requiredColumns) {
        if (!existingColumns.includes(column.name)) {
          console.log(`Adicionando coluna ${column.name}...`);
          
          if (column.default) {
            await db.execute(sql`
              ALTER TABLE alunos 
              ADD COLUMN IF NOT EXISTS ${sql.identifier(column.name)} ${sql.raw(column.type)} 
              DEFAULT ${sql.raw(column.default)}
            `);
          } else {
            await db.execute(sql`
              ALTER TABLE alunos 
              ADD COLUMN IF NOT EXISTS ${sql.identifier(column.name)} ${sql.raw(column.type)}
            `);
          }
          
          console.log(`Coluna ${column.name} adicionada com sucesso!`);
        }
      }
    }
    
    // Verificar se a tabela de usuários existe
    if (!tables.includes('users')) {
      console.log('Tabela users não existe, criando...');
      await db.execute(sql`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          email TEXT UNIQUE,
          nome_completo TEXT,
          role TEXT DEFAULT 'user',
          ativo BOOLEAN DEFAULT TRUE,
          ultimo_login TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('Tabela users criada com sucesso!');
    } else {
      console.log('Tabela users já existe, verificando e adicionando colunas faltantes...');
      
      // Verificar colunas existentes
      const columnsResult = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users'
      `);
      
      // Resultado formatado como array para compatibilidade
      const columnsArray = Array.isArray(columnsResult) 
        ? columnsResult 
        : (columnsResult as any).rows || [];
      
      const existingColumns = columnsArray.map((row: any) => row.column_name);
      console.log('Colunas existentes:', existingColumns);
      
      // Adicionar novas colunas se necessário
      const requiredColumns = [
        { name: 'email', type: 'TEXT' },
        { name: 'nome_completo', type: 'TEXT' },
        { name: 'role', type: 'TEXT', default: "'user'" },
        { name: 'ativo', type: 'BOOLEAN', default: 'TRUE' },
        { name: 'ultimo_login', type: 'TIMESTAMP' },
        { name: 'created_at', type: 'TIMESTAMP', default: 'NOW()' },
        { name: 'updated_at', type: 'TIMESTAMP', default: 'NOW()' }
      ];
      
      for (const column of requiredColumns) {
        if (!existingColumns.includes(column.name)) {
          console.log(`Adicionando coluna ${column.name}...`);
          
          if (column.default) {
            await db.execute(sql`
              ALTER TABLE users 
              ADD COLUMN IF NOT EXISTS ${sql.identifier(column.name)} ${sql.raw(column.type)} 
              DEFAULT ${sql.raw(column.default)}
            `);
          } else {
            await db.execute(sql`
              ALTER TABLE users 
              ADD COLUMN IF NOT EXISTS ${sql.identifier(column.name)} ${sql.raw(column.type)}
            `);
          }
          
          console.log(`Coluna ${column.name} adicionada com sucesso!`);
        }
      }
    }

    // Verificação final
    console.log('Verificando estrutura final do banco de dados...');
    const finalCheckResult = await db.execute(sql`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_name IN ('alunos', 'users')
      ORDER BY table_name, ordinal_position
    `);
    
    // Resultado formatado como array para compatibilidade
    const finalCheckArray = Array.isArray(finalCheckResult) 
      ? finalCheckResult 
      : (finalCheckResult as any).rows || [];
    
    console.log('Estrutura atual do banco de dados:');
    let currentTable = '';
    for (const row of finalCheckArray) {
      if (row.table_name !== currentTable) {
        currentTable = row.table_name;
        console.log(`\nTabela: ${currentTable}`);
      }
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    }

    console.log('\nAtualização do esquema concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a atualização do esquema:', error);
    process.exit(1);
  } finally {
    // Fechar a conexão
    await db.execute(sql`SELECT 1`).then(() => {
      console.log('Encerrando conexão com o banco de dados...');
      process.exit(0);
    });
  }
}

main();