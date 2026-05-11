#!/bin/sh
set -e

export DATABASE_URL="$(tr -d '\n' < /run/secrets/database_url)"
export JWT_SECRET="$(tr -d '\n' < /run/secrets/jwt_secret)"

exec "$@"
