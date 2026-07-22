#!/usr/bin/env bash

set -e

ROOT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_PATH"

docker system prune -a -f --volumes