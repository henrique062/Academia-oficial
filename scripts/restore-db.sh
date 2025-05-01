#!/bin/bash
# Script para restaurar backup do banco de dados PostgreSQL
# Uso: ./restore-db.sh [arquivo_backup] [nome_do_container]

# Verificar se o arquivo de backup foi fornecido
if [ -z "$1" ]; then
  echo "Erro: Arquivo de backup não especificado."
  echo "Uso: $0 [arquivo_backup] [nome_do_container]"
  exit 1
fi

# Configurações
BACKUP_FILE=$1
CONTAINER_NAME=${2:-tripulante-db-1}

# Verificar se o arquivo de backup existe
if [ ! -f "${BACKUP_FILE}" ]; then
  # Tentar com extensão .gz
  if [ -f "${BACKUP_FILE}.gz" ]; then
    echo "Encontrado arquivo compactado ${BACKUP_FILE}.gz"
    echo "Descompactando arquivo..."
    gunzip "${BACKUP_FILE}.gz"
  else
    echo "Erro: Arquivo de backup não encontrado: ${BACKUP_FILE}"
    exit 1
  fi
fi

echo "Iniciando restauração do banco de dados..."
echo "Arquivo de backup: ${BACKUP_FILE}"
echo "Container: ${CONTAINER_NAME}"

# Avisar sobre a perda de dados
echo "ATENÇÃO: Este processo irá sobrescrever todos os dados atuais no banco."
read -p "Deseja continuar? (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
  echo "Operação cancelada pelo usuário."
  exit 0
fi

# Executar a restauração
cat "${BACKUP_FILE}" | docker exec -i "${CONTAINER_NAME}" psql -U postgres

# Verificar se a restauração foi bem-sucedida
if [ $? -eq 0 ]; then
  echo "Restauração concluída com sucesso!"
else
  echo "Erro ao restaurar o banco de dados. Verifique os logs para mais detalhes."
  exit 1
fi