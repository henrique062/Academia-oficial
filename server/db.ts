import { createClient } from '@supabase/supabase-js';
import { PostgrestError } from '@supabase/postgrest-js';
import * as schema from "@shared/schema";

// Obter as credenciais do Supabase a partir das variáveis de ambiente
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
export const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'x-application-name': 'tripulante-dashboard',
        },
      },
    })
  : null;

// Verificar a conexão com o Supabase
(async () => {
  if (!supabase) {
    console.error("❌ Cliente Supabase não inicializado devido a credenciais ausentes.");
    return;
  }
  
  try {
    // Verificar se o cliente Supabase está funcionando com uma consulta simples
    const { data, error } = await supabase.from('_schema_version').select('*').limit(1);
    
    if (error) {
      console.error("❌ Erro ao conectar ao Supabase:", error.message);
      console.error("   Detalhes:", error.details || "Sem detalhes adicionais");
      console.error("   Código:", error.code);
      
      // Informações adicionais de depuração
      if ((error as PostgrestError).hint) {
        console.error("   Dica:", (error as PostgrestError).hint);
      }
    } else {
      console.log("✅ Conexão com Supabase estabelecida com sucesso!");
      console.log(`   Versão do schema: ${data && data.length > 0 ? data[0].version : 'Não disponível'}`);
      
      // Verificar se conseguimos listar tabelas
      const { data: tables, error: tablesError } = await supabase.rpc('get_tables');
      if (tablesError) {
        console.log("ℹ️ Não foi possível listar tabelas:", tablesError.message);
      } else if (tables && tables.length > 0) {
        console.log(`   Tabelas disponíveis: ${tables.slice(0, 5).join(', ')}${tables.length > 5 ? '...' : ''}`);
        console.log(`   Total de tabelas: ${tables.length}`);
      } else {
        console.log("   Nenhuma tabela encontrada no banco de dados.");
      }
    }
  } catch (error) {
    console.error("❌ Erro inesperado ao verificar conexão com Supabase:", error);
  }
})();

// Interface genérica para operações de banco de dados
// Esta é uma abstração que pode ser estendida para outros bancos no futuro, se necessário
export const db = {
  async query(table, query = {}) {
    if (!supabase) throw new Error("Cliente Supabase não inicializado");
    return supabase.from(table).select().match(query);
  },
  
  async insert(table, data) {
    if (!supabase) throw new Error("Cliente Supabase não inicializado");
    return supabase.from(table).insert(data);
  },
  
  async update(table, query, data) {
    if (!supabase) throw new Error("Cliente Supabase não inicializado");
    return supabase.from(table).update(data).match(query);
  },
  
  async delete(table, query) {
    if (!supabase) throw new Error("Cliente Supabase não inicializado");
    return supabase.from(table).delete().match(query);
  },
  
  // Método para executar queries SQL diretamente via funções RPC
  async execute(sql, params = {}) {
    if (!supabase) throw new Error("Cliente Supabase não inicializado");
    return supabase.rpc('execute_sql', { sql_query: sql, params: params });
  }
};
