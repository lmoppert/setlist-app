#!/bin/sh
set -e

echo "Checking secret..."
ls -ls /run/secrets

export DATABASE_URL="$(cat /run/secrets/database_url)"

echo "DATABASE_URL is set"

exec "$@"