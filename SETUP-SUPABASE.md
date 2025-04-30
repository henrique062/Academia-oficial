# Guia de Configuração do Supabase

Este guia contém as instruções para configurar manualmente as tabelas necessárias no Supabase para este projeto.

## Passo 1: Acesse o Supabase Studio

1. Acesse https://app.supabase.io/
2. Faça login com sua conta
3. Selecione o projeto `tybdysmxmxzwebaooeqj`
4. No menu lateral, clique em "SQL Editor"

## Passo 2: Crie as tabelas

1. Clique em "New Query" para criar uma nova consulta
2. Cole o seguinte código SQL:

```sql
-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Tabela de alunos
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
```

3. Clique no botão "Run" para executar a consulta e criar as tabelas

## Passo 3: Verifique as tabelas criadas

1. No menu lateral, clique em "Table Editor"
2. Verifique se as tabelas "users" e "alunos" aparecem na lista
3. Clique em cada tabela para ver seus detalhes e estrutura

## Passo 4: Volte ao Replit

Depois de criar as tabelas no Supabase, você pode voltar ao Replit e continuar o desenvolvimento da aplicação.