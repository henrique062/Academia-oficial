#!/bin/bash

# Script para fazer backup do banco de dados PostgreSQL
# Uso: ./backup-database.sh [ambiente]
# Exemplo: ./backup-database.sh production

# Configurações
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups"
ENV=${1:-development}
CONFIG_FILE=".env.${ENV}"

# Criando diretório de backup se não existir
mkdir -p "${BACKUP_DIR}"

# Carregando variáveis de ambiente
if [ -f "${CONFIG_FILE}" ]; then
  echo "Carregando configurações de ${CONFIG_FILE}..."
  source ${CONFIG_FILE}
else
  echo "Arquivo de configuração ${CONFIG_FILE} não encontrado!"
  exit 1
fi

# Validando a existência das variáveis necessárias
if [ -z "${DATABASE_URL}" ]; then
  echo "Variável DATABASE_URL não definida no arquivo ${CONFIG_FILE}!"
  exit 1
fi

# Extraindo parâmetros da URL do banco de dados
if [[ "${DATABASE_URL}" =~ postgres://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+) ]]; then
  DB_USER="${BASH_REMATCH[1]}"
  DB_PASSWORD="${BASH_REMATCH[2]}"
  DB_HOST="${BASH_REMATCH[3]}"
  DB_PORT="${BASH_REMATCH[4]}"
  DB_NAME="${BASH_REMATCH[5]}"
else
  echo "Formato da URL do banco de dados inválido!"
  exit 1
fi

# Nome do arquivo de backup
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_backup_${ENV}_${TIMESTAMP}.sql"

# Exportando senha para o comando pg_dump
export PGPASSWORD="${DB_PASSWORD}"

echo "Iniciando backup do banco de dados ${DB_NAME} (${ENV})..."

# Realizando o backup
pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -F p > "${BACKUP_FILE}"

# Verificando sucesso do backup
if [ $? -eq 0 ]; then
  echo "Backup realizado com sucesso: ${BACKUP_FILE}"
  
  # Comprimindo o arquivo de backup
  gzip "${BACKUP_FILE}"
  echo "Backup comprimido: ${BACKUP_FILE}.gz"
  
  # Removendo arquivos de backup antigos (mais de 30 dias)
  find "${BACKUP_DIR}" -name "*.gz" -type f -mtime +30 -exec rm {} \;
  echo "Arquivos de backup com mais de 30 dias foram removidos."
else
  echo "Falha ao realizar o backup do banco de dados!"
  exit 1
fi 