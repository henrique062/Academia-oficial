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
  const dbHost = process.env.POSTGRES_HOST || 'db'; // 'db' é o padrão no Docker/EasyPanel
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

const client = postgres(connectionString, { ssl: sslConfig });
export const db = drizzle(client, { schema });
