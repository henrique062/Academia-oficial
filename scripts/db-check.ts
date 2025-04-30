import { createClient } from '@supabase/supabase-js';

// Supabase connection settings
const SUPABASE_URL = 'https://tybdysmxmxzwebaooeqj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5YmR5c214bXh6d2ViYW9vZXFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjA1MzU4MywiZXhwIjoyMDYxNjI5NTgzfQ.1cPee3mXQujnT28QzfLqfMg5ji2Jvi6JtdZdS9k_WyA';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log('Verificando acesso às tabelas no Supabase...');

  try {
    // Verificar acesso à tabela de usuários
    console.log('Verificando acesso à tabela de usuários...');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
      
    if (usersError && usersError.code === '42P01') {
      console.log('Tabela de usuários não existe. Você precisa criar as tabelas manualmente no Supabase Studio.');
      console.log('Execute os seguintes SQL statements no SQL Editor do Supabase:');
      console.log(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS alunos (
          id SERIAL PRIMARY KEY,
          nome TEXT NOT NULL,
          documento TEXT NOT NULL,
          email TEXT NOT NULL,
          pais TEXT NOT NULL,
          telefone TEXT NOT NULL,
          whatsapp TEXT,
          turma TEXT NOT NULL,
          data_confirmacao DATE NOT NULL,
          alerta_vencimento DATE,
          periodo_acesso TEXT NOT NULL,
          situacao_financeira TEXT NOT NULL,
          observacao TEXT,
          data_vencimento DATE,
          pagamentos_mensais JSONB,
          
          tripulante BOOLEAN DEFAULT FALSE,
          pronto BOOLEAN DEFAULT FALSE,
          certificado BOOLEAN DEFAULT FALSE,
          stcw BOOLEAN DEFAULT FALSE,
          status_vacina TEXT,
          nivel_autoavaliacao TEXT,
          crew_call BOOLEAN DEFAULT FALSE,
          data_crew_call DATE,
          entrevistador TEXT,
          nivel_nivelamento TEXT,
          consideracoes TEXT,
          
          perfil TEXT,
          comunidade BOOLEAN DEFAULT FALSE,
          participacao TEXT,
          instagram TEXT,
          close_friends BOOLEAN DEFAULT FALSE,
          postou_cv BOOLEAN DEFAULT FALSE,
          analise_cv TEXT,
          datas_responsaveis JSONB,
          comentarios TEXT,
          entrevista_marcada BOOLEAN DEFAULT FALSE,
          empresa TEXT,
          cargo TEXT,
          aprovado BOOLEAN DEFAULT FALSE,
          data_embarque DATE,
          salario INTEGER,
          
          coleta_prova TEXT,
          tipo_prova TEXT,
          link_arquivo TEXT,
          
          contatos JSONB,
          motivos TEXT,
          quem TEXT,
          
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } else if (usersError) {
      console.error('Erro ao verificar tabela de usuários:', usersError);
    } else {
      console.log('✅ Tabela de usuários encontrada!');
    }
    
    // Verificar acesso à tabela de alunos
    console.log('Verificando acesso à tabela de alunos...');
    const { data: alunosData, error: alunosError } = await supabase
      .from('alunos')
      .select('*')
      .limit(1);
      
    if (alunosError && alunosError.code === '42P01') {
      console.log('Tabela de alunos não existe. Você precisa criá-la manualmente no Supabase Studio.');
    } else if (alunosError) {
      console.error('Erro ao verificar tabela de alunos:', alunosError);
    } else {
      console.log('✅ Tabela de alunos encontrada!');
      console.log('Número de alunos encontrados:', alunosData.length);
    }
    
    console.log('Verificação de acesso concluída!');
  } catch (error) {
    console.error('Erro durante a verificação:', error);
    process.exit(1);
  }
}

main();