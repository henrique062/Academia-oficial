# Configuração do Supabase

Este documento explica como configurar e usar o Supabase com este projeto quando implantado no EasyPanel.

## Sobre o Supabase

O Supabase é usado nesta aplicação como o **banco de dados principal**. A aplicação depende completamente do Supabase para:
- Armazenamento de dados de alunos e usuários
- Autenticação de usuários
- Armazenamento de arquivos
- Funções em tempo real

## Pré-requisitos

Antes de implantar a aplicação, você deve:

1. Ter uma conta no Supabase (https://supabase.com)
2. Criar um projeto no Supabase
3. Obter a URL e a chave de serviço do seu projeto
4. Configurar as funções SQL necessárias (instruções abaixo)

## Credenciais do Supabase

As credenciais do Supabase estão configuradas de duas maneiras:

1. **Diretamente no Dockerfile** (configuração atual)
   - As credenciais estão embutidas no `Dockerfile.easypanel`
   - Isso permite que a aplicação funcione imediatamente sem configuração manual

2. **Variáveis de ambiente no EasyPanel** (configuração recomendada para produção)
   - Configure as variáveis de ambiente no EasyPanel para sobrescrever as credenciais embutidas

## Configurando Credenciais no EasyPanel

Se você quiser atualizar ou alterar as credenciais do Supabase:

1. Acesse seu painel do EasyPanel
2. Selecione este projeto
3. Vá para a seção "Environment Variables"
4. Adicione/atualize as seguintes variáveis:
   - `SUPABASE_URL`: URL do seu projeto Supabase (ex: https://xyz.supabase.co)
   - `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase (encontrada nas configurações de API do seu projeto Supabase)

## Configurando Funções SQL no Supabase

Esta aplicação requer algumas funções SQL personalizadas no Supabase. Para configurá-las:

1. No seu terminal, configure as variáveis de ambiente:
   ```bash
   export SUPABASE_URL="sua-url-do-supabase"
   export SUPABASE_SERVICE_ROLE_KEY="sua-chave-de-servico"
   ```

2. Execute o script de configuração:
   ```bash
   bash scripts/supabase/setup-supabase.sh
   ```

Alternativamente, você pode executar o SQL manualmente através do SQL Editor no painel do Supabase:
1. Acesse o painel do seu projeto Supabase
2. Vá para "SQL Editor"
3. Copie e cole o conteúdo de `scripts/supabase/setup-functions.sql`
4. Execute o SQL

## Segurança

**ATENÇÃO**: As credenciais embutidas no Dockerfile são apenas para facilitar o desenvolvimento e implantação inicial. Para ambientes de produção, recomendamos fortemente:

1. Remover as credenciais do Dockerfile
2. Configurar as variáveis de ambiente no EasyPanel
3. Usar um projeto Supabase dedicado para produção

## Verificando a Configuração

Após implantar a aplicação, você pode verificar se o Supabase está configurado corretamente:

1. Acesse os logs da aplicação no EasyPanel
2. Procure por mensagens como:
   - "Conectando ao Supabase: https://xyz.supabase.c..."
   - "Supabase: Configurado e ativo"
   - "✅ Conexão com Supabase estabelecida com sucesso!"

Se você ver erros relacionados ao Supabase, verifique se as credenciais estão corretas e se as funções SQL foram configuradas.

## Migrando entre projetos Supabase

Para migrar de um projeto Supabase para outro:

1. Exporte os dados do projeto atual
2. Importe para o novo projeto
3. Configure as funções SQL necessárias no novo projeto
4. Atualize as credenciais no EasyPanel
5. Reconstrua e reinicie a aplicação no EasyPanel 