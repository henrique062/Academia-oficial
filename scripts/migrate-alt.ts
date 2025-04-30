import { supabase } from '../server/db';

async function main() {
  console.log('Iniciando migração do esquema para o Supabase (método alternativo)...');

  try {
    // Criando tabelas usando o SQL Builder API do Supabase
    console.log('Criando tabelas...');
    
    // Verificar se a tabela _migration existe
    const { error } = await supabase.from('_migration').select();
    
    if (error && error.code === '42P01') { // Table doesn't exist error
      console.log('Criando tabelas iniciais...');
      
      const tables = [
        // Usuários
        `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
        `,
        
        // Alunos
        `
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
        `,
        
        // Tabela de migração para controle
        `
        CREATE TABLE IF NOT EXISTS _migration (
          id SERIAL PRIMARY KEY,
          version TEXT NOT NULL,
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        INSERT INTO _migration (version) VALUES ('1.0.0');
        `
      ];
      
      // Executar cada script SQL
      for (const sql of tables) {
        const { error: tableError } = await supabase.query(sql);
        if (tableError) {
          throw tableError;
        }
      }
      
      console.log('Tabelas criadas com sucesso!');
    } else if (error) {
      throw error;
    } else {
      console.log('Migração já aplicada anteriormente.');
    }

    console.log('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a migração:', error);
    process.exit(1);
  }
}

main();