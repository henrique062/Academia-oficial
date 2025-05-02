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