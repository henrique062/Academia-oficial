# Tripulante - Dashboard de Alunos

## Implantação com EasyPanel e Docker

Este projeto está configurado para ser implantado facilmente utilizando EasyPanel (que utiliza Docker internamente).

### Requisitos

- Servidor com EasyPanel instalado
- Docker e Docker Compose instalados
- Banco de dados PostgreSQL (incluído no docker-compose)
- Acesso ao Supabase (para autenticação e armazenamento)

### Passos para implantação no EasyPanel

1. Clone este repositório no seu servidor:
   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   cd [NOME_DO_DIRETÓRIO]
   ```

2. Acesse o painel do EasyPanel no seu navegador (geralmente em `http://seu-servidor:3000`)

3. Crie um novo projeto:
   - Clique em "Add Project"
   - Selecione "Docker Compose"
   - Dê um nome ao projeto (ex: "tripulante-dashboard")
   - Configure o domínio desejado (ou use o subdomínio padrão do EasyPanel)

4. Configure as variáveis de ambiente:
   - `DATABASE_URL`: URL de conexão com o PostgreSQL (postgres://postgres:senha_segura@db:5432/tripulante)
   - `POSTGRES_USER`: Usuário do PostgreSQL (postgres)
   - `POSTGRES_PASSWORD`: Senha do PostgreSQL (defina uma senha segura)
   - `POSTGRES_DB`: Nome do banco de dados (tripulante)
   - `SUPABASE_URL`: URL do seu projeto Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase
   - `NODE_ENV`: production
   - `PORT`: 3000

5. Configuração do Docker Compose:
   - Selecione o arquivo `docker-compose.yml` do repositório
   - Certifique-se de que o EasyPanel reconheceu todos os serviços definidos no arquivo

6. Iniciar o Deployment:
   - Clique em "Deploy" para iniciar o processo
   - Aguarde enquanto o EasyPanel constrói e inicia os contêineres

### Estrutura dos Serviços

O projeto utiliza 3 serviços principais:

1. **app**: A aplicação Node.js/Express com React
2. **db**: Banco de dados PostgreSQL
3. **nginx**: Servidor web para proxy reverso e servir arquivos estáticos

### Migração de Dados

A migração do banco de dados ocorrerá automaticamente durante o processo de inicialização dos contêineres, graças ao script `docker-entrypoint.sh`.

### Como configurar SSL/HTTPS

1. Descomente as linhas relacionadas ao Certbot no arquivo `docker-compose.yml`
2. Crie os diretórios para o Certbot:
   ```bash
   mkdir -p certbot/conf certbot/www
   ```
3. Descomente as configurações HTTPS no arquivo `nginx.conf`
4. Reinicie os contêineres:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Verificar Funcionamento

1. Acesse a URL fornecida pelo EasyPanel após a conclusão do deployment
2. Você deve ver a interface do Dashboard de Alunos
3. Verifique se os filtros de alunos estão funcionando corretamente
4. Teste o login e demais funcionalidades

### Solução de Problemas

Se encontrar problemas durante a implantação, verifique:

1. Logs dos contêineres Docker:
   ```bash
   docker logs [nome-do-container]
   ```
   
2. Verifique a conectividade entre os serviços:
   ```bash
   docker exec -it [nome-do-container-app] wget -O- db:5432
   ```

3. Certifique-se de que as variáveis de ambiente estão configuradas corretamente no EasyPanel

4. Verifique se o banco de dados PostgreSQL está acessível:
   ```bash
   docker exec -it [nome-do-container-db] psql -U postgres -c "SELECT 1"
   ```

5. Confira se as credenciais do Supabase estão corretas

### Backup e Restauração

Para facilitar o backup e restauração do banco de dados, incluímos scripts úteis:

#### Backup do Banco de Dados

Execute o script de backup:
```bash
./scripts/backup-db.sh [nome-do-container-db]
```

Os backups são salvos no diretório `./backups` com timestamp.

#### Restauração do Banco de Dados

Para restaurar um backup:
```bash
./scripts/restore-db.sh [caminho-do-arquivo-backup] [nome-do-container-db]
```

### Atualizações e Manutenção

Para atualizar a aplicação:

1. Faça pull das últimas mudanças do repositório:
   ```bash
   git pull
   ```

2. Reconstrua e reinicie os contêineres:
   ```bash
   docker-compose build
   docker-compose up -d
   ```

3. Verifique os logs para garantir que tudo está funcionando corretamente:
   ```bash
   docker-compose logs -f app
   ```