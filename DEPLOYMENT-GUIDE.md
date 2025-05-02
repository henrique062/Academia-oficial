# Guia de Implantação - Dashboard Tripulante

Este guia fornece instruções detalhadas para implantar o Dashboard Tripulante no EasyPanel ou em qualquer ambiente baseado em Docker.

## Problemas Conhecidos e Soluções

### Erro `Cannot find package '@vitejs/plugin-react'`

Este erro ocorre quando o build tenta usar o plugin React do Vite, mas o pacote não está disponível. As modificações feitas neste projeto resolvem esse problema automaticamente por meio das seguintes estratégias:

1. **Verificação Automática**: Um script `prebuild` agora verifica e instala o pacote quando necessário.
2. **Instalação Explícita no Dockerfile**: O Dockerfile agora inclui etapas específicas para garantir que o plugin seja instalado.
3. **Verificação no Script de Entrypoint**: O script de entrypoint verifica se o plugin está disponível e tenta corrigir se necessário.

## Passo a Passo para Implantação no EasyPanel

1. **Preparação do Repositório**

   Certifique-se de que seu repositório contém os seguintes arquivos atualizados:
   - `Dockerfile.easypanel`
   - `easypanel-entrypoint.sh`
   - `scripts/fix-vite-plugin.js`
   - `.easypanel.yml`

2. **Configuração no EasyPanel**

   No EasyPanel, crie um novo serviço:
   
   - Selecione a opção "GitHub Repository"
   - Informe a URL do seu repositório Git
   - Certifique-se de que o Dockerfile selecionado seja `Dockerfile.easypanel`
   - Configure as variáveis de ambiente necessárias:
     - `NODE_ENV`: `production`
     - `PORT`: `3000`
     - `SUPABASE_URL`: Sua URL do Supabase
     - `SUPABASE_SERVICE_ROLE_KEY`: Sua chave de serviço do Supabase

3. **Build e Implantação**

   - Inicie o build no EasyPanel
   - Monitore os logs para confirmar que as verificações estão funcionando corretamente
   - Verifique se o serviço inicia sem erros

## Solução Manual (se necessário)

Se ainda encontrar problemas, você pode resolver manualmente:

1. Clone o repositório localmente
2. Execute:
   ```bash
   npm install @vitejs/plugin-react --save-dev
   npm run build
   ```
3. Verifique se o build foi concluído com sucesso
4. Atualize seu repositório Git e reimplante no EasyPanel

## Verificação de Sucesso

O deploy foi bem-sucedido se:

1. Os logs mostram "✅ Plugin React do Vite encontrado!"
2. A aplicação inicia sem erros
3. A interface web está acessível na porta configurada

## Otimizações de Docker

O Dockerfile foi otimizado para:

1. Usar um processo de build em multi-estágios
2. Minimizar o tamanho da imagem final
3. Executar a aplicação com um usuário não-root
4. Incluir verificações de saúde

## Solução de Problemas

Se encontrar problemas, verifique:

1. Se o pacote `@vitejs/plugin-react` está listado nas devDependencies do package.json
2. Se o script `scripts/fix-vite-plugin.js` está presente e configurado corretamente
3. Se o Dockerfile está copiando corretamente os arquivos necessários para a imagem final

Para mais informações, consulte os logs do container e verifique a saída do script `easypanel-entrypoint.sh`. 