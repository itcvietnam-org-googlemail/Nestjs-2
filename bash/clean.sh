#!/usr/bin/env bash

set -e

ROOT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_PATH"

docker system prune -a -f --volumes

# docker run --rm -it admin-nestjs sh
# docker images
# docker run --rm -p 3000:3000 admin-nestjs
# docker run --rm --env-file docker/admin.prod.env -p 3000:3000 admin-nestjs
# docker build --target production -t admin-nestjs .
# docker start admin-nestjs-1
# docker exec -it admin-nestjs-1 sh