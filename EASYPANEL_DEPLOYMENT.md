# Guia de Implantação no EasyPanel

Este guia explica como implantar corretamente o dashboard Tripulante no EasyPanel.

## Pré-requisitos

1. Acesso a uma instância EasyPanel
2. Credenciais e URL do Supabase
3. String de conexão do PostgreSQL (pode ser do Supabase ou outro serviço)

## Passos para Implantação

### 1. Preparar o Código para Implantação

Certifique-se de que os seguintes arquivos estão presentes no seu repositório:
- `Dockerfile.easypanel` (Dockerfile específico para EasyPanel)
- `easypanel-entrypoint.sh` (Script de inicialização simplificado)

### 2. Criar um Novo Serviço no EasyPanel

1. Faça login no EasyPanel
2. Navegue até a seção "Services" ou "Applications"
3. Clique em "Add Service" ou "New Application"

### 3. Configurar o Novo Serviço

Configure o serviço com as seguintes informações:

- **Tipo de Serviço**: Docker
- **Nome do Serviço**: tripulante-dashboard (ou outro nome de sua preferência)
- **Imagem Docker**: Escolha "Custom" e aponte para o seu repositório Git
- **Dockerfile Path**: `Dockerfile.easypanel` (importante: use este Dockerfile específico, não o padrão)
- **Porta**: 3000

### 4. Definir Variáveis de Ambiente

Configure estas variáveis de ambiente obrigatórias:

- `NODE_ENV`: `production`
- `DATABASE_URL`: URL completa de conexão com o PostgreSQL (ex: `postgresql://usuario:senha@host:porta/banco`)
- `SUPABASE_URL`: URL do seu projeto Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase

### 5. Implantar o Serviço

Clique em "Deploy" ou "Create Service" para iniciar a implantação.

### 6. Verificar o Status

1. Acompanhe os logs da implantação para identificar possíveis problemas
2. Verifique se o aplicativo está acessível na URL fornecida pelo EasyPanel
3. Teste a funcionalidade de login e outras funcionalidades chave

## Solução de Problemas

### Se ocorrer erro de conexão com o banco de dados:

1. Verifique se a variável `DATABASE_URL` está configurada corretamente
2. Certifique-se que o banco de dados está acessível a partir do EasyPanel (verifique firewalls ou restrições de IP)
3. Confirme que as tabelas necessárias existem no banco de dados

### Se ocorrer erro de autenticação com o Supabase:

1. Verifique se as variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` estão configuradas corretamente
2. Confirme que o projeto Supabase está ativo e as credenciais são válidas

## Notas Importantes

- Esta implantação assume que você está usando um banco de dados PostgreSQL externo.
- Não é necessário implantar o contêiner PostgreSQL separadamente, como no ambiente de desenvolvimento local.
- As migrações do banco de dados serão executadas automaticamente durante o início do serviço.