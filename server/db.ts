import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Supabase connection settings - usando valores do ambiente
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Verificar se temos as credenciais do Supabase
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ ERRO: Credenciais do Supabase não configuradas. A aplicação requer essas credenciais para funcionar corretamente.");
  console.error("   Por favor, configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY como variáveis de ambiente.");
  // Não encerrar o processo, apenas avisar
} else {
  // Log para debug (sem mostrar credenciais completas)
  console.log(`Conectando ao Supabase: ${SUPABASE_URL.substring(0, 20)}...`);
  console.log(`Usando chave de serviço do Supabase (primeiros 10 caracteres): ${SUPABASE_SERVICE_ROLE_KEY.substring(0, 10)}...`);
}

// Criar cliente Supabase - fail safe se as credenciais não forem configuradas
// Isso permitirá que a aplicação inicie, mas funções que dependem do Supabase falharão
export const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

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

// Exibir informações do host para depuração
try {
  const urlPattern = /postgres:\/\/[^:]+:[^@]+@([^:]+):(\d+)\/(.+)/;
  const matches = connectionString.match(urlPattern);
  
  if (matches && matches.length >= 4) {
    const [, host, port, database] = matches;
    console.log(`Informações da conexão PostgreSQL:`);
    console.log(`- Host: ${host}`);
    console.log(`- Porta: ${port}`);
    console.log(`- Banco: ${database}`);
    
    // Tentar resolver o nome do host
    if (process.env.NODE_ENV === 'production') {
      console.log(`Tentando resolver o hostname ${host}...`);
      const { execSync } = require('child_process');
      try {
        const dnsResult = execSync(`nslookup ${host} || echo "Não foi possível resolver"`, { encoding: 'utf8' });
        console.log(`Resultado da resolução DNS: ${dnsResult.split('\n').slice(0, 3).join(' ')}`);
      } catch (err) {
        console.log(`Erro ao resolver DNS: ${err.message}`);
      }
    }
  }
} catch (error) {
  console.error(`Erro ao analisar DATABASE_URL: ${error.message}`);
}

// Configura cliente postgres para Drizzle
// Em produção, precisamos aceitar conexões SSL sem verificação estrita
const sslConfig = process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false;
console.log(`Configuração SSL: ${process.env.NODE_ENV === 'production' ? 'Habilitado (rejectUnauthorized=false)' : 'Desabilitado'}`);

// Adiciona timeout mais longo para ambientes externos e retry para lidar com falhas de conexão
const pgOptions = { 
  ssl: sslConfig,
  connect_timeout: 30,    // mais tempo para conectar (30 segundos)
  idle_timeout: 120,      // mais tempo para conexões ociosas (2 minutos)
  max_lifetime: 60 * 60,  // permitir que conexões durem mais tempo (1 hora)
  max_retries: 5,         // tentar reconectar até 5 vezes
  retry_interval: 5       // esperar 5 segundos entre tentativas
};

console.log(`Opções de conexão PostgreSQL: ${JSON.stringify(pgOptions, null, 2)}`);

// Inicialização segura do cliente PostgreSQL
let client;
try {
  console.log("Inicializando cliente PostgreSQL...");
  client = postgres(connectionString, pgOptions);
  
  // Auto-verificação da conexão
  (async () => {
    try {
      // Executar consulta simples para testar a conexão
      const result = await client`SELECT current_timestamp as time, current_database() as database, version() as version`;
      console.log("✅ Conexão PostgreSQL estabelecida com sucesso:");
      console.log(`   - Timestamp: ${result[0]?.time}`);
      console.log(`   - Banco de dados: ${result[0]?.database}`);
      console.log(`   - Versão: ${result[0]?.version?.split(',')[0]}`);
    } catch (error) {
      console.error("❌ ERRO ao verificar conexão PostgreSQL:", error.message);
      if (error.code === 'ENOTFOUND') {
        console.error(`   Host não encontrado: ${error.hostname || 'desconhecido'}`);
      } else if (error.code === 'ECONNREFUSED') {
        console.error(`   Conexão recusada: ${error.address || 'desconhecido'}:${error.port || 'desconhecido'}`);
      }
    }
  })();
} catch (error) {
  console.error("ERRO FATAL ao configurar conexão com o banco de dados:", error);
  console.log("Usando cliente de fallback (aplicação poderá falhar em runtime)");
  client = postgres('postgres://invalid:invalid@localhost:5432/invalid', { ssl: false });
}

// Exporta o objeto db usando o cliente configurado
export const db = drizzle(client, { schema });
