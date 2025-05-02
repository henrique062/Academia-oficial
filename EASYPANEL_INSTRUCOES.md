# Instruções para Corrigir o Erro no EasyPanel

## Problema Identificado
Existem três problemas principais que estão causando a falha na implantação:

1. **Erro de sintaxe no Dockerfile**: Havia um erro na sintaxe da linha que copia o arquivo `.env.example`.
2. **Credenciais do Supabase não configuradas**: A aplicação requer as credenciais do Supabase para funcionar corretamente.
3. **Dependência do plugin do Replit**: O código está tentando importar um pacote específico do Replit (`@replit/vite-plugin-runtime-error-modal`) que não está disponível no ambiente do EasyPanel.

## Passos para Correção

### 1. Corrigir o Dockerfile
Edite o Dockerfile no seu repositório e faça as seguintes alterações:

```dockerfile
# Adicione esta linha após a instalação do plugin do React
RUN npm install @replit/vite-plugin-runtime-error-modal --save-dev --no-fund --no-audit || echo "Plugin do Replit não disponível, continuando sem ele..."

# Adicione estas linhas antes da verificação do plugin React
RUN echo "🔍 Verificando e removendo referências ao plugin do Replit..."
RUN grep -r "@replit/vite-plugin-runtime-error-modal" --include="*.ts" --include="*.js" . || echo "Nenhuma referência encontrada"
RUN find . -type f -name "*.ts" -o -name "*.js" | xargs sed -i 's/.*@replit\/vite-plugin-runtime-error-modal.*//g' || echo "Sem alterações"
RUN find . -type f -name "*.ts" -o -name "*.js" | xargs sed -i '/import\s*{\s*}\s*from/d' || echo "Sem importações vazias"

# Corrija as linhas de cópia de arquivos
COPY .env.example ./.env.example 2>/dev/null || echo Env_example_not_found
COPY drizzle.config.ts ./drizzle.config.ts 2>/dev/null || echo Drizzle_config_not_found
```

### 2. Atualizar o Script de Inicialização
Modifique o arquivo `easypanel-entrypoint.sh` para adicionar a seguinte verificação:

```bash
# Verificar e remover importações do plugin do Replit
if grep -q "@replit/vite-plugin-runtime-error-modal" /app/dist/server/index.js; then
  echo "⚠️ Detectada referência ao plugin do Replit no código compilado!"
  echo "🔧 Removendo referências ao plugin do Replit do servidor..."
  sed -i 's/.*@replit\/vite-plugin-runtime-error-modal.*//g' /app/dist/server/index.js
  echo "✅ Correção aplicada para o plugin do Replit."
fi

# Verificar referências ao plugin do Replit em todos os arquivos JS
find /app/dist -type f -name "*.js" -exec grep -l "@replit/vite-plugin-runtime-error-modal" {} \; | while read file; do
  echo "🔧 Removendo referências ao plugin do Replit em: $file"
  sed -i 's/.*@replit\/vite-plugin-runtime-error-modal.*//g' "$file"
  # Remover possíveis importações vazias que possam ter ficado
  sed -i 's/import\s*{\s*}\s*from\s*['"'"'"]\([^'"'"'"]*\)['"'"'"];/\/\/ Importação removida: \1/g' "$file"
  echo "✅ Correção aplicada"
done
```

### 3. Criar Script de Patch de Emergência
Crie um novo arquivo `scripts/remove-replit-plugin.sh` com o script de correção de emergência fornecido. Este script pode ser executado manualmente dentro do container para remover todas as referências ao plugin do Replit dos arquivos JS compilados.

### 4. Configurar Variáveis de Ambiente no EasyPanel
No EasyPanel, é necessário configurar as variáveis de ambiente do Supabase:

1. Acesse o painel de controle do seu serviço no EasyPanel
2. Vá para a seção "Variáveis de Ambiente" ou "Environment Variables"
3. Adicione as seguintes variáveis:
   - `SUPABASE_URL`: URL do seu projeto Supabase (ex: https://seuprojeto.supabase.co)
   - `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço (service role key) do seu projeto Supabase

### 5. Aplicar Patch de Emergência no Container Atual (Opção Rápida)
Se você não quiser recriar o container, você pode aplicar o patch de emergência diretamente:

1. Acesse o terminal/shell do container no EasyPanel
2. Execute os seguintes comandos:

```bash
# Criar arquivo de patch diretamente
cat > /app/patch-replit.sh << 'EOF'
#!/bin/sh
set -e
echo "🔧 Removendo referências ao plugin do Replit..."
SERVER_INDEX="/app/dist/server/index.js"
[ -f "$SERVER_INDEX" ] && sed -i 's/.*@replit\/vite-plugin-runtime-error-modal.*//g' "$SERVER_INDEX"
[ -f "$SERVER_INDEX" ] && sed -i '/import\s*{\s*}\s*from/d' "$SERVER_INDEX"
find /app/dist -type f -name "*.js" -exec sed -i 's/.*@replit\/vite-plugin-runtime-error-modal.*//g' {} \;
find /app/dist -type f -name "*.js" -exec sed -i '/import\s*{\s*}\s*from/d' {} \;
echo "✅ Patch aplicado"
EOF

# Tornar o script executável
chmod +x /app/patch-replit.sh

# Executar o patch
/app/patch-replit.sh

# Reiniciar o serviço
exec node dist/server/index.js
```

### 6. Recriar o Container
Após realizar as alterações no código:

1. Salve as mudanças no Dockerfile e no script de inicialização no seu repositório
2. No EasyPanel, reconstrua o container usando o botão "Rebuild" ou equivalente
3. Verifique os logs do container para garantir que não há mais erros

## Verificação
Após a reconstrução, verifique se:

1. O build do Docker é concluído sem erros
2. A aplicação inicia corretamente e pode se conectar ao Supabase
3. Não há mais erros relacionados ao plugin do Replit

## Suporte Adicional
Se você continuar enfrentando problemas:

1. Verifique se as credenciais do Supabase estão corretas
2. Confirme que seu projeto Supabase está ativo e acessível
3. Verifique se há outros erros nos logs do container que possam indicar problemas adicionais 