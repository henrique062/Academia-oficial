#!/usr/bin/env node

import https from 'https';

// Supabase connection settings
const SUPABASE_URL = 'https://tybdysmxmxzwebaooeqj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5YmR5c214bXh6d2ViYW9vZXFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjA1MzU4MywiZXhwIjoyMDYxNjI5NTgzfQ.1cPee3mXQujnT28QzfLqfMg5ji2Jvi6JtdZdS9k_WyA';

// SQL para criar as tabelas
const createTablesSql = `
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.alunos (
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
`;

// Função para fazer uma requisição para a API REST do Supabase
function makeSqlRequest(sql) {
  return new Promise((resolve, reject) => {
    console.log('Enviando solicitação SQL REST para o Supabase...');
    
    // Fazer uma requisição POST para a API REST
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY
      }
    };
    
    // Fazer uma requisição HTTP para a API REST
    const req = https.request(`${SUPABASE_URL}/rest/v1/sql`, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('Requisição SQL bem-sucedida!');
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        } else {
          console.error('Erro na resposta:', res.statusCode, data);
          reject(new Error(`Erro na resposta: ${res.statusCode} - ${data}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Erro na requisição:', error);
      reject(error);
    });
    
    // Enviar o corpo da requisição
    req.write(JSON.stringify({ query: sql }));
    req.end();
  });
}

// Criar as tabelas
async function createTables() {
  try {
    console.log('Iniciando criação de tabelas no Supabase...');
    const result = await makeSqlRequest(createTablesSql);
    console.log('Tabelas criadas com sucesso!');
    console.log('Resultado:', result);
  } catch (error) {
    console.error('Erro ao criar tabelas:', error.message);
    process.exit(1);
  }
}

// Executar o script
createTables();