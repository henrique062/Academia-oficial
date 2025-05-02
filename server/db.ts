import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Supabase connection settings - usando os valores fixos para garantir funcionamento no EasyPanel
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tybdysmxmxzwebaooeqj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5YmR5c214bXh6d2ViYW9vZXFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjA1MzU4MywiZXhwIjoyMDYxNjI5NTgzfQ.1cPee3mXQujnT28QzfLqfMg5ji2Jvi6JtdZdS9k_WyA';

// Log para debug
console.log(`Conectando ao Supabase: ${SUPABASE_URL.substring(0, 20)}...`);

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Para conexão PostgreSQL via DATABASE_URL
let connectionString = process.env.DATABASE_URL;

// Se não houver DATABASE_URL, construímos a string com as variáveis individuais
if (!connectionString) {
  const dbUser = process.env.POSTGRES_USER || 'postgres';
  const dbPass = process.env.POSTGRES_PASSWORD || 'postgres';
  
  // Verificar se estamos em ambiente EasyPanel ou similar (sem o container 'db')
  // Se a variável DB_HOST ou POSTGRES_HOST existir, use ela, caso contrário padrão para 'db'
  const dbHost = process.env.DB_HOST || process.env.POSTGRES_HOST || 'db';
  const dbPort = process.env.POSTGRES_PORT || '5432';
  const dbName = process.env.POSTGRES_DB || 'tripulante';
  
  connectionString = `postgres://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
  console.log(`DATABASE_URL construído: ${connectionString.replace(/:[^:]*@/, ':****@')}`);
} else {
  console.log(`Usando DATABASE_URL existente: ${connectionString.replace(/:[^:]*@/, ':****@')}`);
}

// Configura cliente postgres para Drizzle
// Em produção, precisamos aceitar conexões SSL sem verificação estrita
const sslConfig = process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false;
console.log(`Configuração SSL: ${process.env.NODE_ENV === 'production' ? 'Habilitado (rejectUnauthorized=false)' : 'Desabilitado'}`);

// Adiciona timeout mais longo para ambientes externos
const pgOptions = { 
  ssl: sslConfig,
  connect_timeout: 10, // mais tempo para conectar
  idle_timeout: 30,    // mais tempo para conexões ociosas
  max_lifetime: 60 * 30 // permitir que conexões durem mais tempo
};

// Inicialização segura do cliente PostgreSQL
let client;
try {
  client = postgres(connectionString, pgOptions);
  console.log("Cliente PostgreSQL inicializado com sucesso");
} catch (error) {
  console.error("Erro ao configurar conexão com o banco de dados:", error);
  console.log("Usando cliente de fallback (aplicação poderá falhar em runtime)");
  client = postgres('postgres://invalid:invalid@localhost:5432/invalid', { ssl: false });
}

// Exporta o objeto db usando o cliente configurado
export const db = drizzle(client, { schema });
