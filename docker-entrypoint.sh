#!/bin/sh
set -e

export DATABASE_URL="$(tr -d '\n' < /run/secrets/database_url)"

exec "$@"
