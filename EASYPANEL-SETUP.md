# Guia Detalhado de Implementação no EasyPanel

Este documento fornece instruções completas para configurar o Dashboard do Tripulante no EasyPanel, uma solução de orquestração baseada em Docker.

## 📋 Pré-requisitos

- Servidor Linux com Docker e Docker Compose instalados
- [EasyPanel](https://easypanel.io) instalado e configurado (versão 1.0.0 ou superior)
- Conexão com Internet para pull de imagens Docker
- Domínio ou subdomínio para acessar a aplicação (opcional, mas recomendado)
- Acesso ao projeto Supabase (para autenticação e armazenamento opcional)

## 🚀 Instruções de Instalação

### 1️⃣ Preparação Inicial

Primeiro, clone o repositório no servidor:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/tripulante-dashboard.git

# Entre no diretório do projeto
cd tripulante-dashboard

# Verifique se os arquivos de configuração estão presentes
ls -la .easypanel.yml docker-compose.yml
```

### 2️⃣ Segurança e Segredos

Antes de iniciar a configuração, prepare os segredos necessários:

1. **Credenciais do PostgreSQL**:
   - Defina uma senha forte para o banco de dados
   - Anote-a para uso na configuração

2. **Chaves do Supabase**:
   - Acesse o Painel do Supabase: https://app.supabase.io
   - Navegue até seu projeto > Configurações > API
   - Copie a URL e a chave `service_role` (não a anon key)

3. **Chave de Sessão**:
   - Gere uma chave aleatória segura:
   ```bash
   openssl rand -base64 32
   ```

### 3️⃣ Configuração no EasyPanel

#### Método 1: Usando o Arquivo .easypanel.yml (Recomendado)

1. Acesse o EasyPanel em seu navegador (geralmente em `http://seu-servidor:3000`)
2. Faça login com suas credenciais de administrador
3. Clique em **Projects** > **New Project**
4. Selecione **Import from Git**
5. Configure os seguintes campos:
   - **Name**: tripulante-dashboard
   - **Repository**: Caminho para o repositório clonado
   - **Branch**: main (ou a branch desejada)
   - **Auto Deploy**: Ative se desejar atualizações automáticas

6. Defina as variáveis de ambiente secretas:
   - `POSTGRES_PASSWORD`: Sua senha forte do PostgreSQL
   - `SUPABASE_URL`: URL do Supabase (exemplo: https://abcdefghijklm.supabase.co)
   - `SUPABASE_SERVICE_ROLE_KEY`: Chave service_role do Supabase
   - `SESSION_SECRET`: Chave aleatória gerada anteriormente

7. Clique em **Deploy** para iniciar a implantação

#### Método 2: Configuração Manual com Docker Compose

Se preferir configurar manualmente:

1. Acesse o EasyPanel e vá para **Projects** > **New Project**
2. Selecione **Docker Compose**
3. Configure os seguintes campos:
   - **Name**: tripulante-dashboard
   - **Compose file**: Selecione o arquivo `docker-compose.yml` do repositório

4. Configure as mesmas variáveis de ambiente mencionadas acima
5. Clique em **Deploy**

### 4️⃣ Verificação e Monitoramento

Após a implantação (que pode levar alguns minutos), verifique:

1. **Estado dos Contêineres**:
   - No EasyPanel, acesse seu projeto
   - Verifique se todos os serviços mostram status "Running"

2. **Logs da Aplicação**:
   - Clique no serviço `app` para ver os logs em tempo real
   - Procure por mensagens de sucesso na inicialização

3. **Verificação do Banco de Dados**:
   - Verifique se o serviço de banco de dados está funcionando
   - Confirme se as migrações foram executadas com sucesso nos logs

4. **Acesso à Aplicação**:
   - Acesse o URL fornecido pelo EasyPanel
   - Verifique se a interface do Dashboard carrega corretamente
   - Faça login e teste a navegação básica

### 5️⃣ Configuração de Domínio Personalizado

Para configurar um domínio personalizado:

1. No EasyPanel, acesse seu projeto > Guia **Settings**
2. Em **Custom Domain**, adicione seu domínio
3. Configure os registros DNS apropriados apontando para o IP do servidor
4. Ative HTTPS se desejado (recomendado)

### 6️⃣ Configuração de Backups Automáticos

O projeto já inclui um cronjob para backups diários. Para verificar:

1. Acesse seu projeto no EasyPanel
2. Vá para a guia **Cron Jobs**
3. Verifique se o job `backup` está programado
4. Os backups serão armazenados no volume persistente `backups`

Para restaurar um backup, use:

```bash
# Acesse o shell do container da aplicação pelo EasyPanel
# Navegue até o diretório de backups
cd /app/backups

# Liste os backups disponíveis
ls -la

# Restaure um backup específico
./scripts/restore-db.sh /app/backups/tripulante_backup_YYYY-MM-DD_HH-MM-SS.sql tripulante-db
```

## 🛠️ Resolução de Problemas

### Problemas Comuns e Soluções

1. **Erro de Conexão com o Banco de Dados**:
   - Verifique se as variáveis POSTGRES_* estão corretamente configuradas
   - Confirme se o serviço de banco de dados está ativo
   - Teste a conexão: 
   ```bash
   docker exec -it [container-app] wget -O- db:5432
   ```

2. **Erro de Autenticação do Supabase**:
   - Verifique se as variáveis SUPABASE_* estão corretamente configuradas
   - Confirme se a chave service_role está correta (não use a anon key)

3. **Aplicação Inacessível**:
   - Verifique os logs do NGINX para identificar problemas
   - Confirme se as portas estão corretamente mapeadas
   - Verifique se o firewall do servidor permite tráfego nas portas necessárias

### Acesso a Logs Detalhados

Para acesso mais detalhado aos logs:

```bash
# Logs do aplicativo
docker logs -f tripulante-dashboard-app-1

# Logs do banco de dados
docker logs -f tripulante-dashboard-db-1

# Logs do NGINX
docker logs -f tripulante-dashboard-nginx-1
```

## 📊 Monitoramento Avançado

O EasyPanel oferece monitoramento integrado, mas para monitoramento mais avançado:

1. **Métricas de Desempenho**:
   - As métricas Prometheus estão habilitadas na configuração
   - Acesse-as em: `http://seu-domínio/metrics` (se configurado)

2. **Alertas**:
   - Configure notificações no EasyPanel para:
     - Uso elevado de CPU/memória
     - Container parado ou reiniciado
     - Falha na verificação de saúde

## 🔄 Atualizações e Manutenção

### Processo de Atualização

Para atualizar a aplicação:

1. Vá ao diretório do projeto e obtenha as últimas alterações:
   ```bash
   cd /caminho/para/projeto
   git pull
   ```

2. No EasyPanel, acesse o projeto e clique em **Rebuild**

### Manutenção Programada

Para manutenção programada:

1. Comunique os usuários com antecedência
2. No EasyPanel, acesse o projeto e clique em **Stop** para interromper temporariamente
3. Realize a manutenção necessária
4. Clique em **Start** para reiniciar o serviço

## 📚 Recursos Adicionais

- [Documentação do EasyPanel](https://easypanel.io/docs)
- [Documentação do Docker Compose](https://docs.docker.com/compose/)
- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de Melhores Práticas para Deployments Docker](https://docs.docker.com/develop/dev-best-practices/)

## 📞 Suporte

Para problemas com esta aplicação específica, entre em contato com a equipe de desenvolvimento.

Para problemas relacionados ao EasyPanel, consulte a [documentação oficial](https://easypanel.io/docs) ou o [fórum da comunidade](https://github.com/easypanel-io/easypanel/discussions).