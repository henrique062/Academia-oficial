#!/bin/bash
# Script para backup do banco de dados PostgreSQL
# Uso: ./backup-db.sh [nome_do_container]

# Configurações
CONTAINER_NAME=${1:-tripulante-db-1}
BACKUP_DIR="./backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="${BACKUP_DIR}/tripulante_backup_${DATE}.sql"

# Criar diretório de backup se não existir
mkdir -p "${BACKUP_DIR}"

echo "Iniciando backup do banco de dados..."
echo "Container: ${CONTAINER_NAME}"
echo "Arquivo de destino: ${BACKUP_FILE}"

# Executar o dump
docker exec -t "${CONTAINER_NAME}" pg_dumpall -c -U postgres > "${BACKUP_FILE}"

# Verificar se o backup foi bem-sucedido
if [ $? -eq 0 ]; then
  echo "Backup concluído com sucesso: ${BACKUP_FILE}"
  
  # Compactar o arquivo para economizar espaço
  gzip "${BACKUP_FILE}"
  echo "Backup compactado: ${BACKUP_FILE}.gz"
else
  echo "Erro ao realizar o backup. Verifique se o container está em execução."
  exit 1
fi