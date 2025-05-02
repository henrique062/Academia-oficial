# Guia de Implantação no EasyPanel

Este projeto já está pré-configurado para funcionar com o EasyPanel sem a necessidade de configurar manualmente senhas de banco de dados ou API keys.

## 🚀 Passos para Implantação

### 1. Clonar o repositório no seu servidor

```bash
git clone [URL-DO-REPOSITORIO] tripulante-dashboard
cd tripulante-dashboard
```

### 2. Configuração no EasyPanel

1. Acesse o painel do EasyPanel
2. Clique em "New Project"
3. Selecione "Custom"
4. Preencha os campos:
   - **Name**: Tripulante Dashboard
   - **Repository URL**: (URL do seu repositório Git)
   - **Branch**: main (ou a branch que você usa)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Port**: 5000

### 3. Configuração da Rede

As seguintes portas devem estar abertas:
- 5000 (API e interface web)

### 4. Variáveis de Ambiente (Opcional)

O projeto já funciona imediatamente com as configurações padrão, mas você pode personalizar as seguintes variáveis, se desejar:

```
# Apenas se você quiser usar um banco de dados diferente do que vem configurado
DATABASE_URL=postgres://seu_usuario:sua_senha@seu_host:5432/seu_banco

# Se você tiver seu próprio projeto Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
```

## 🔍 Verificação da Instalação

Após a implantação:

1. Acesse a interface web em: `http://seu-servidor:5000`
2. Teste a API em: `http://seu-servidor:5000/api/health` 
3. Verifique o WebSocket em: `http://seu-servidor:5000/websocket`

## ⚙️ Funcionalidades Principais

- **API REST** completa para gestão de alunos
- **WebSocket** para comunicação em tempo real
- **Painel Admin** para gerenciamento de dados

## 🛠️ Banco de Dados

Este projeto utiliza PostgreSQL e Supabase.

- As tabelas serão criadas automaticamente quando o aplicativo for iniciado pela primeira vez.
- Não é necessário configurar manualmente o banco de dados!

## 📡 WebSocket

O WebSocket está configurado em `/ws` e pode ser testado através da página de demonstração em `/websocket`.

Para conectar-se a partir de outros aplicativos:

```javascript
const wsUrl = 'ws://seu-servidor:5000/ws';
const socket = new WebSocket(wsUrl);

socket.onopen = () => {
  console.log('Conectado ao WebSocket');
  socket.send(JSON.stringify({ message: 'Olá!' }));
};

socket.onmessage = (event) => {
  console.log('Mensagem recebida:', JSON.parse(event.data));
};
```

## 🤝 Suporte

Se você encontrar algum problema durante a implantação, entre em contato com nossa equipe de suporte.

# Configuração no EasyPanel

Este documento fornece instruções sobre como configurar este aplicativo no EasyPanel.

## Pré-requisitos

- Instância do EasyPanel funcionando
- PostgreSQL configurado no EasyPanel

## Variáveis de Ambiente Necessárias

As seguintes variáveis de ambiente precisam ser configuradas no EasyPanel:

### Variáveis Críticas de Banco de Dados

| Variável | Descrição | Observação |
|----------|-----------|------------|
| `DB_HOST` | Host do PostgreSQL | Preenchido automaticamente pelo EasyPanel |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL | Preenchido automaticamente pelo EasyPanel |
| `POSTGRES_DB` | Nome do banco de dados | Padrão: `tripulante` |
| `POSTGRES_USER` | Usuário do PostgreSQL | Padrão: `postgres` |

### Variáveis Críticas do Supabase (Banco de Dados Principal)

Esta aplicação usa o Supabase como seu banco de dados principal. As credenciais já estão pré-configuradas no Dockerfile.easypanel, mas você pode alterá-las através das variáveis de ambiente:

| Variável | Descrição | Observação |
|----------|-----------|------------|
| `SUPABASE_URL` | URL da sua instância Supabase | Necessário para conexão com o Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço do Supabase | Necessário para autenticação no Supabase |

Consulte o arquivo `SUPABASE-CONFIG.md` para obter instruções detalhadas sobre como configurar o Supabase.

### Outras Variáveis Opcionais

| Variável | Descrição |
|----------|-----------|
| `SUPABASE_URL` | URL da sua instância Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço do Supabase |

## Resolução de Problemas

### 1. PostgreSQL indisponível

Se você estiver vendo erros como:
```
db:5432 - no response
PostgreSQL is unavailable - sleeping
```

Verifique:

1. **Variáveis de ambiente**: Certifique-se de que `DB_HOST` e `POSTGRES_PASSWORD` estão configurados corretamente no EasyPanel.

2. **Banco de dados**: Confirme que o banco de dados PostgreSQL está em execução no EasyPanel.

3. **Firewall/Rede**: Verifique se não há regras de firewall bloqueando a comunicação entre o contêiner da aplicação e o PostgreSQL.

### 2. Problemas com o Supabase

Se você estiver vendo erros relacionados ao Supabase como:
```
❌ ERRO: Credenciais do Supabase não configuradas
```
ou problemas de autenticação com o Supabase, verifique:

1. **Credenciais corretas**: Certifique-se de que `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` estão configurados corretamente no Dockerfile.easypanel ou como variáveis de ambiente no EasyPanel.

2. **Projeto Supabase ativo**: Verifique se o projeto Supabase está ativo e acessível. Teste a URL do Supabase em um navegador.

3. **Conectividade de rede**: Certifique-se de que o contêiner da aplicação pode acessar a internet para se conectar ao Supabase.

4. **Permissões da API**: Verifique se a chave de serviço do Supabase tem as permissões corretas para as operações que você está tentando realizar.

### 3. Verificando Logs

Use o painel de logs do EasyPanel para verificar:

- Informações sobre a conexão com o banco de dados
- Erros específicos durante a inicialização
- Detalhes sobre tentativas de reconexão

### 4. Reiniciar PostgreSQL

Se o PostgreSQL estiver com problemas:

1. Vá para o painel do EasyPanel
2. Encontre o serviço de banco de dados PostgreSQL
3. Use a opção "Reiniciar" para reiniciar o serviço
4. Depois, reinicie também a aplicação

## Configuração Recomendada

Para obter o melhor desempenho no EasyPanel, recomendamos:

- Alocação de recursos:
  - CPU: 0.5-1.0 cores para a aplicação
  - Memória: 1-2 GB para a aplicação
  - CPU: 0.5 cores para o PostgreSQL
  - Memória: 1 GB para o PostgreSQL

- Rede:
  - Use o proxy interno do EasyPanel para acesso ao PostgreSQL
  - Configure HTTPS para acesso à aplicação

## Atualização da Aplicação

Para atualizar a aplicação no EasyPanel:

1. Faça o push das alterações para o repositório
2. No EasyPanel, selecione a aplicação
3. Clique em "Rebuild" para reconstruir a imagem com as alterações
4. Verifique os logs após a reconstrução para garantir que tudo está funcionando corretamente