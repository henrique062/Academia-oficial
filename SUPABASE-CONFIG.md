# Configuração do Supabase

Este documento explica como configurar e usar o Supabase com este projeto quando implantado no EasyPanel.

## Sobre o Supabase

O Supabase é usado nesta aplicação para:
- Autenticação de usuários
- Armazenamento de arquivos
- Funções em tempo real
- Banco de dados PostgreSQL complementar (para algumas funcionalidades específicas)

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

Se você ver erros relacionados ao Supabase, verifique se as credenciais estão corretas.

## Criando um novo projeto Supabase

Se você precisar criar um novo projeto Supabase:

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Crie um novo projeto
3. Obtenha a URL e a chave de serviço nas configurações de API
4. Atualize as credenciais no EasyPanel (ou no Dockerfile se preferir)

## Migrando entre projetos Supabase

Para migrar de um projeto Supabase para outro:

1. Exporte os dados do projeto atual
2. Importe para o novo projeto
3. Atualize as credenciais no EasyPanel
4. Reconstrua e reinicie a aplicação no EasyPanel 