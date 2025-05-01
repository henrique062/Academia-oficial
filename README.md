# Aplicação Fullstack React + Express

Esta é uma aplicação fullstack moderna utilizando React no frontend e Express no backend, com banco de dados PostgreSQL.

## Tecnologias Utilizadas

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Shadcn/UI (baseado em Radix UI)
- React Query
- Wouter (roteamento)

### Backend
- Node.js com Express
- TypeScript
- Drizzle ORM
- PostgreSQL
- Supabase (opcional)
- Express Session para autenticação

## Requisitos

- Node.js 18+ 
- PostgreSQL
- npm ou yarn

## Estrutura do Projeto

```
/
├── server/             # Código do servidor Express
│   ├── index.ts        # Ponto de entrada do servidor
│   ├── routes.ts       # Definição de rotas da API
│   ├── db.ts           # Configuração do banco de dados
│   └── storage.ts      # Utilitários de armazenamento
│
├── client/             # Código do cliente React
│   ├── src/
│   │   ├── components/ # Componentes reutilizáveis
│   │   ├── pages/      # Páginas/Rotas
│   │   ├── lib/        # Bibliotecas e configurações
│   │   ├── hooks/      # React hooks personalizados
│   │   ├── types/      # Definições de tipos TypeScript
│   │   ├── utils/      # Funções utilitárias
│   │   ├── constants/  # Constantes da aplicação
│   │   ├── App.tsx     # Componente principal
│   │   └── main.tsx    # Ponto de entrada do cliente
│   │
│   └── index.html      # Arquivo HTML inicial
│
├── shared/             # Código compartilhado entre cliente e servidor
│
└── public/             # Arquivos estáticos
```

## Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd [nome-do-projeto]
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Crie um arquivo `.env` baseado no `.env.example`

4. Execute as migrações do banco de dados:
```bash
npm run db:push
```

## Executando a Aplicação

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor e o cliente em modo de desenvolvimento
- `npm run build`: Constrói a aplicação para produção
- `npm start`: Inicia a aplicação em modo de produção
- `npm run check`: Verifica os tipos TypeScript
- `npm run db:push`: Aplica migrações no banco de dados
- `npm run lint`: Executa o linter
- `npm run lint:fix`: Corrige problemas de linting automaticamente
- `npm run format`: Formata o código usando Prettier

## Contribuindo

1. Crie um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Envie para o branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

MIT 