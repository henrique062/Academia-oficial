import { createClient } from '@supabase/supabase-js';

// Supabase connection settings
const SUPABASE_URL = 'https://tybdysmxmxzwebaooeqj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5YmR5c214bXh6d2ViYW9vZXFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjA1MzU4MywiZXhwIjoyMDYxNjI5NTgzfQ.1cPee3mXQujnT28QzfLqfMg5ji2Jvi6JtdZdS9k_WyA';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log('Iniciando configuração do banco de dados no Supabase...');

  try {
    // Usando o SQL API do Supabase para criar tabelas
    console.log('Verificando e criando tabelas se necessário...');
    
    // Criar tabela de usuários
    console.log('Criando tabela de usuários...');
    const { data: usersResult, error: usersError } = await supabase.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
      `
    });
    
    if (usersError) {
      console.error('Erro ao criar tabela de usuários:', usersError);
      // Tentar outro método usando o SQL API
      const { data: usersData, error: usersApiError } = await supabase.auth.admin.exportUsers();
      if (usersApiError) {
        console.error('Não foi possível acessar a API Admin:', usersApiError);
      } else {
        console.log('Acesso à API Admin bem-sucedido');
      }
    } else {
      console.log('Tabela de usuários criada ou já existente!');
    }
    
    // Criar tabela de alunos
    console.log('Criando tabela de alunos...');
    const { data: alunosResult, error: alunosError } = await supabase.rpc('exec_sql', {
      sql_string: `
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
      `
    });
    
    if (alunosError) {
      console.error('Erro ao criar tabela de alunos via RPC:', alunosError);
      
      // Tentar criar tabela usando o método SQL REST API
      console.log('Tentando método alternativo via SQL REST API...');
      
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY
          },
          body: JSON.stringify({
            query: `
              CREATE TABLE IF NOT EXISTS alunos (
                id SERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                email TEXT NOT NULL,
                documento TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              );
            `
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Erro ao usar SQL REST API:', errorText);
        } else {
          console.log('Criação da tabela via REST API bem-sucedida');
        }
      } catch (restError) {
        console.error('Erro ao usar método REST:', restError);
      }
    } else {
      console.log('Tabela de alunos criada ou já existente!');
    }
    
    // Verificar se conseguimos acessar as tabelas
    console.log('Verificando acesso às tabelas...');
    
    // Verificar acesso à tabela de usuários
    const { data: usersCheck, error: usersCheckError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
      
    if (usersCheckError) {
      console.error('Erro ao acessar tabela de usuários:', usersCheckError);
    } else {
      console.log('Acesso à tabela de usuários confirmado!');
    }
    
    // Verificar acesso à tabela de alunos
    const { data: alunosCheck, error: alunosCheckError } = await supabase
      .from('alunos')
      .select('*')
      .limit(1);
      
    if (alunosCheckError) {
      console.error('Erro ao acessar tabela de alunos:', alunosCheckError);
    } else {
      console.log('Acesso à tabela de alunos confirmado!');
    }
    
    console.log('Configuração do banco de dados concluída!');
  } catch (error) {
    console.error('Erro durante a configuração do banco de dados:', error);
    process.exit(1);
  }
}

main();