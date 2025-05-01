# 🚀 Guia de Implantação no EasyPanel para Tripulante Dashboard

Este guia fornece instruções passo a passo para implantar o Tripulante Dashboard no EasyPanel usando Docker. Siga as orientações cuidadosamente para garantir uma implantação bem-sucedida.

## 📋 Pré-requisitos

- Servidor com EasyPanel instalado (versão 1.0.0 ou superior)
- Acesso ao servidor via SSH
- Domínio ou subdomínio para acessar o aplicativo (opcional, mas recomendado)
- Git instalado no servidor

## ⚙️ Passos para Implantação

### Passo 1: Clonar o Repositório

```bash
# Conecte-se ao servidor via SSH
ssh usuario@seu-servidor

# Clone o repositório em um diretório apropriado
git clone https://github.com/seu-usuario/tripulante-dashboard.git
cd tripulante-dashboard
```

### Passo 2: Preparar Variáveis de Ambiente

Crie um arquivo `.env` a partir do template:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com as seguintes configurações:

```env
# Configurações da base de dados
POSTGRES_USER=postgres           # Configure um usuário seguro
POSTGRES_PASSWORD=SuaSenhaSegura  # Use uma senha forte!
POSTGRES_DB=tripulante
DATABASE_URL=postgres://postgres:SuaSenhaSegura@db:5432/tripulante

# Configurações do Supabase (se estiver usando)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico

# Configurações da aplicação
NODE_ENV=production
PORT=3000
```

### Passo 3: Configurar no EasyPanel

#### Método 1: Usando o arquivo `.easypanel.yml`

1. Acesse o EasyPanel no navegador: `http://seu-servidor:3000`
2. Faça login com suas credenciais
3. Navegue até **Projects** > **New Project**
4. Escolha **Import from Git**
5. Preencha os campos:
   - **Repository URL**: URL do repositório clonado
   - **Name**: tripulante-dashboard
   - **Branch**: main (ou sua branch de produção)

6. Configure as variáveis de ambiente:
   - Clique em **Environment Variables**
   - Adicione as mesmas variáveis do arquivo `.env` criado anteriormente

7. Clique em **Deploy**

#### Método 2: Usando Docker Compose diretamente

1. No EasyPanel, navegue até **Projects** > **New Project**
2. Escolha **Docker Compose**
3. Selecione o diretório onde você clonou o repositório
4. O EasyPanel detectará automaticamente o arquivo `docker-compose.yml`
5. Configure as variáveis de ambiente como no método anterior
6. Clique em **Deploy**

### Passo 4: Verificar a Implantação

1. Aguarde alguns minutos para a conclusão da implantação
2. No painel do EasyPanel, vá para **Projects** > **tripulante-dashboard**
3. Verifique se todos os contêineres mostram status "Running"
4. Clique no URL fornecido para acessar o aplicativo

## 🔍 Monitoramento e Troubleshooting

### Verificar Logs

Para verificar os logs do aplicativo:

1. No EasyPanel, acesse **Projects** > **tripulante-dashboard**
2. Clique na guia **Logs**
3. Selecione o serviço `app` para ver os logs do aplicativo

### Endpoint de Health Check

O aplicativo fornece um endpoint de health check que pode ser usado para monitoramento:

```
http://seu-dominio/api/health
```

Para informações mais detalhadas sobre o estado do sistema:

```
http://seu-dominio/api/health?detailed=true
```

### Solução de Problemas Comuns

1. **Erro de conexão com banco de dados**:
   - Verifique se as variáveis de ambiente do PostgreSQL estão corretas
   - Verifique os logs do contêiner `db` para erros específicos

2. **Erros 502 Bad Gateway**:
   - Verifique se o aplicativo está em execução verificando os logs
   - Reinicie o serviço `app` no EasyPanel

3. **Erros de permissão**:
   - Verifique se o contêiner está usando as permissões corretas para acessar volumes

## 🔄 Atualizações e Manutenção

### Atualizar o Aplicativo

Para atualizar o aplicativo para uma nova versão:

1. No EasyPanel, acesse **Projects** > **tripulante-dashboard**
2. Clique em **Rebuild**
3. Se você estiver usando Git, selecione **Pull & Rebuild** para obter as alterações mais recentes

### Backup do Banco de Dados

O projeto inclui scripts de backup/restauração. Para fazer backup manual:

1. No EasyPanel, acesse **Projects** > **tripulante-dashboard**
2. Abra o terminal para o contêiner `app`
3. Execute: `./scripts/backup-db.sh tripulante-db`
4. O arquivo de backup será salvo em `/app/backups`

### Restauração do Banco de Dados

Para restaurar a partir de um backup:

1. No terminal do contêiner `app`
2. Execute: `./scripts/restore-db.sh /app/backups/seu-arquivo-backup.sql tripulante-db`

## 🔒 Segurança

1. **Secretos e Variáveis de Ambiente**:
   - Nunca armazene senhas ou chaves API no código
   - Use sempre as variáveis de ambiente do EasyPanel

2. **HTTPS**:
   - Configure HTTPS no EasyPanel para o projeto
   - Ative a renovação automática de certificados

3. **Acesso ao Banco de Dados**:
   - Limite o acesso direto ao banco de dados
   - Use senhas fortes para as contas do PostgreSQL

## 📞 Suporte

Se você encontrar problemas durante a implantação:

1. Consulte os logs detalhados no EasyPanel
2. Verifique o status dos contêineres
3. Para problemas específicos, entre em contato com a equipe de suporte

---

Boa sorte com sua implantação! Para mais informações, consulte a documentação do EasyPanel em [https://easypanel.io/docs](https://easypanel.io/docs).