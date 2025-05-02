-- Função RPC para listar todas as tabelas no esquema público
CREATE OR REPLACE FUNCTION public.get_tables()
RETURNS TABLE (table_name text)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT t.table_name::text
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
  ORDER BY t.table_name;
END;
$$;

-- Função para executar SQL dinâmico (para uso interno pela aplicação)
CREATE OR REPLACE FUNCTION public.execute_sql(sql_query text, params jsonb DEFAULT '{}'::jsonb)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Executa a query e converte o resultado para JSON
  EXECUTE sql_query
  INTO result;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'error', SQLERRM,
      'detail', SQLSTATE,
      'query', sql_query
    );
END;
$$;

-- Permissões de acesso às funções
ALTER FUNCTION public.get_tables() SECURITY DEFINER;
ALTER FUNCTION public.execute_sql(text, jsonb) SECURITY DEFINER;

-- Dar acesso às funções para a service_role (permitindo que o serviço de backend as acesse)
GRANT EXECUTE ON FUNCTION public.get_tables() TO service_role;
GRANT EXECUTE ON FUNCTION public.execute_sql(text, jsonb) TO service_role;

-- Comentários para documentação das funções
COMMENT ON FUNCTION public.get_tables() IS 'Lista todas as tabelas no esquema público do banco de dados';
COMMENT ON FUNCTION public.execute_sql(text, jsonb) IS 'Executa um comando SQL dinâmico (uso restrito para operações internas da aplicação)'; 