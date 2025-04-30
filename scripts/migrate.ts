import { supabase } from '../server/db';
import { pgTable, text, serial, integer, boolean, date, timestamp, jsonb } from "drizzle-orm/pg-core";

async function main() {
  console.log('Iniciando migração do esquema para o Supabase...');

  try {
    // Criando tabela de usuários
    console.log('Criando tabela de usuários...');
    const { error: usersError } = await supabase.rpc('create_users_table');

    if (usersError) {
      console.error('Erro ao criar tabela de usuários com RPC, tentando SQL direto:', usersError);
      
      const { error: usersDirectError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
      `);
      
      if (usersDirectError) {
        throw usersDirectError;
      }
    }

    // Criando tabela de alunos
    console.log('Criando tabela de alunos...');
    const { error: alunosError } = await supabase.rpc('create_alunos_table');

    if (alunosError) {
      console.error('Erro ao criar tabela de alunos com RPC, tentando SQL direto:', alunosError);
      
      const { error: alunosDirectError } = await supabase.query(`
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
          
          -- Dados acadêmicos
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
          
          -- Dados profissionais
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
          
          -- Prova
          coleta_prova TEXT,
          tipo_prova TEXT,
          link_arquivo TEXT,
          
          -- Outros
          contatos JSONB,
          motivos TEXT,
          quem TEXT,
          
          -- Metadados
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      if (alunosDirectError) {
        throw alunosDirectError;
      }
    }

    console.log('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a migração:', error);
    process.exit(1);
  }
}

main();