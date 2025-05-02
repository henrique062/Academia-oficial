# Instruções para Corrigir o Erro no EasyPanel

## Problema Identificado
Existem dois problemas principais que estão causando a falha na implantação:

1. **Erro de sintaxe no Dockerfile**: Havia um erro na sintaxe da linha que copia o arquivo `.env.example`.
2. **Credenciais do Supabase não configuradas**: A aplicação requer as credenciais do Supabase para funcionar corretamente.

## Passos para Correção

### 1. Corrigir o Dockerfile
Edite o Dockerfile no seu repositório e corrija as linhas relacionadas à cópia de arquivos de configuração:

```dockerfile
# Substitua estas linhas
COPY .env.example ./.env.example || echo "Env example not found"
COPY drizzle.config.ts ./drizzle.config.ts || echo "Drizzle config not found"

# Por estas versões corrigidas
COPY .env.example ./.env.example 2>/dev/null || echo "Env example not found"
COPY drizzle.config.ts ./drizzle.config.ts 2>/dev/null || echo "Drizzle config not found"
```

### 2. Configurar Variáveis de Ambiente no EasyPanel
No EasyPanel, é necessário configurar as variáveis de ambiente do Supabase:

1. Acesse o painel de controle do seu serviço no EasyPanel
2. Vá para a seção "Variáveis de Ambiente" ou "Environment Variables"
3. Adicione as seguintes variáveis:
   - `SUPABASE_URL`: URL do seu projeto Supabase (ex: https://seuprojeto.supabase.co)
   - `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço (service role key) do seu projeto Supabase

### 3. Recriar o Container
Após realizar as alterações acima:

1. Salve as mudanças no Dockerfile no seu repositório
2. No EasyPanel, reconstrua o container usando o botão "Rebuild" ou equivalente
3. Verifique os logs do container para garantir que não há mais erros

## Verificação
Após a reconstrução, verifique se:

1. O build do Docker é concluído sem erros
2. A aplicação inicia corretamente e pode se conectar ao Supabase
3. A mensagem "Credenciais do Supabase configuradas através das variáveis de ambiente" aparece nos logs

## Suporte Adicional
Se você continuar enfrentando problemas:

1. Verifique se as credenciais do Supabase estão corretas
2. Confirme que seu projeto Supabase está ativo e acessível
3. Verifique se há outros erros nos logs do container que possam indicar problemas adicionais 