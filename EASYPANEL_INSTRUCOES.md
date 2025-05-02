# Instruções para Corrigir o Erro no EasyPanel

## Problema Identificado
Existem quatro problemas principais que estão causando a falha na implantação:

1. **Erro de sintaxe no Dockerfile**: Havia um erro na sintaxe da linha que copia o arquivo `.env.example`.
2. **Credenciais do Supabase não configuradas**: A aplicação requer as credenciais do Supabase para funcionar corretamente.
3. **Dependência do plugin do Replit**: O código está tentando importar um pacote específico do Replit (`@replit/vite-plugin-runtime-error-modal`) que não está disponível no ambiente do EasyPanel.
4. **Dependência do swagger-jsdoc**: O código está tentando importar o pacote `swagger-jsdoc` que não está disponível no ambiente.

## Passos para Correção

### 1. Corrigir o Dockerfile
Edite o Dockerfile no seu repositório e faça as seguintes alterações:

```dockerfile
# Adicione esta linha após a instalação do plugin do React
RUN npm install @replit/vite-plugin-runtime-error-modal --save-dev --no-fund --no-audit || echo "Plugin do Replit não disponível, continuando sem ele..."

# Adicione esta linha para instalar o swagger-jsdoc
RUN npm install swagger-jsdoc swagger-ui-express --save

# Adicione estas linhas antes da verificação do plugin React
RUN echo "🔍 Verificando e removendo referências ao plugin do Replit..."
RUN grep -r "@replit/vite-plugin-runtime-error-modal" --include="*.ts" --include="*.js" . || echo "Nenhuma referência encontrada"
RUN find . -type f -name "*.ts" -o -name "*.js" | xargs sed -i 's/.*@replit\/vite-plugin-runtime-error-modal.*//g' || echo "Sem alterações"
RUN find . -type f -name "*.ts" -o -name "*.js" | xargs sed -i '/import\s*{\s*}\s*from/d' || echo "Sem importações vazias"

# Corrija as linhas de cópia de arquivos
RUN touch .env.example drizzle.config.ts
```

### 2. Atualizar o Script de Inicialização
Modifique o arquivo `easypanel-entrypoint.sh` para adicionar as seguintes verificações:

```bash
# Verificar e remover importações do plugin do Replit
if grep -q "@replit/vite-plugin-runtime-error-modal" /app/dist/server/index.js; then
  echo "⚠️ Detectada referência ao plugin do Replit no código compilado!"
  echo "🔧 Removendo referências ao plugin do Replit do servidor..."
  sed -i 's/.*@replit\/vite-plugin-runtime-error-modal.*//g' /app/dist/server/index.js
  echo "✅ Correção aplicada para o plugin do Replit."
fi

# Verificar e lidar com o pacote swagger-jsdoc
if grep -q "swagger-jsdoc" /app/dist/server/index.js; then
  echo "⚠️ Detectada referência ao swagger-jsdoc no código compilado!"
  
  # Verificar se o pacote está instalado
  if ! npm list swagger-jsdoc >/dev/null 2>&1; then
    echo "🔧 Pacote swagger-jsdoc não encontrado, instalando..."
    npm install swagger-jsdoc swagger-ui-express --save
    
    if [ $? -ne 0 ]; then
      echo "⚠️ Falha ao instalar o swagger-jsdoc. Tentando solução alternativa..."
      
      # Fazer backup do arquivo antes de modificar
      cp /app/dist/server/index.js /app/dist/server/index.js.bak
      
      # Modificar o código para tornar o swagger opcional
      sed -i 's/import.*swagger-jsdoc.*$/\/\/ Swagger-jsdoc não disponível\nconst swaggerJsdoc = () => ({});/g' /app/dist/server/index.js
      sed -i 's/import.*swagger-ui-express.*$/\/\/ Swagger-ui-express não disponível\nconst swaggerUi = { serve: () => (req, res, next) => next(), setup: () => (req, res, next) => next() };/g' /app/dist/server/index.js
      
      echo "✅ Referências ao swagger-jsdoc tratadas no código."
    else
      echo "✅ Pacotes swagger instalados com sucesso."
    fi
  else
    echo "✅ Pacote swagger-jsdoc já está instalado."
  fi
fi
```

### 3. Criar Script de Patch para o Swagger
Crie um novo arquivo `scripts/fix-swagger-deps.js` com o código para corrigir as referências ao swagger-jsdoc no código compilado.

### 4. Aplicar Patch de Emergência no Container Atual (Opção Rápida)
Se você não quiser recriar o container, pode aplicar o patch de emergência diretamente:

1. Acesse o terminal/shell do container no EasyPanel
2. Execute os seguintes comandos:

```bash
# Instalar o swagger-jsdoc
cd /app && npm install swagger-jsdoc swagger-ui-express --save

# Reiniciar o serviço
exec node dist/server/index.js
```

### 5. Configurar Variáveis de Ambiente no EasyPanel
No EasyPanel, é necessário configurar as variáveis de ambiente do Supabase:

1. Acesse o painel de controle do seu serviço no EasyPanel
2. Vá para a seção "Variáveis de Ambiente" ou "Environment Variables"
3. Adicione as seguintes variáveis:
   - `SUPABASE_URL`: URL do seu projeto Supabase (ex: https://seuprojeto.supabase.co)
   - `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço (service role key) do seu projeto Supabase

### 6. Recriar o Container
Após realizar as alterações no código:

1. Salve as mudanças no Dockerfile e no script de inicialização no seu repositório
2. No EasyPanel, reconstrua o container usando o botão "Rebuild" ou equivalente
3. Verifique os logs do container para garantir que não há mais erros

## Verificação
Após a reconstrução, verifique se:

1. O build do Docker é concluído sem erros
2. A aplicação inicia corretamente e pode se conectar ao Supabase
3. Não há mais erros relacionados ao plugin do Replit ou ao swagger-jsdoc

## Suporte Adicional
Se você continuar enfrentando problemas:

1. Verifique se as credenciais do Supabase estão corretas
2. Confirme que seu projeto Supabase está ativo e acessível
3. Verifique se há outros erros nos logs do container que possam indicar problemas adicionais 