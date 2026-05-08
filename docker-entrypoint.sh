#!/bin/sh
set -e

export DATABASE_URL="$(cat /run/secrets/database_url)"

exec "$@"