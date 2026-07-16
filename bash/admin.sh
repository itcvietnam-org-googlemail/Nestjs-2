#!/usr/bin/env bash

# Set
set -e

# Set root path
ROOT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Choose environment
echo "Choose environment:"
echo "1) Development"
echo "2) Production"
read -r -p "Choose [1]: " CHOICE
CHOICE="${CHOICE:-1}"

case "${CHOICE}" in
    1)
        ENVIRONMENT="dev"
        ;;
    2)
        ENVIRONMENT="prod"
        ;;
    *)
        echo "Invalid choose!"
        exit 1
        ;;
esac

# Run command
if [ "${ENVIRONMENT}" = "prod" ]; then
    docker compose -f "${ROOT_PATH}/docker/admin.compose.yaml" --env-file "${ROOT_PATH}/docker/admin.prod.env" up nestjs --build --force-recreate
else
    docker compose -f "${ROOT_PATH}/docker/admin.compose.yaml" --env-file "${ROOT_PATH}/docker/admin.${ENVIRONMENT}.env" up nestjs --build --force-recreate
fi