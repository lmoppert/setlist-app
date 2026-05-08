#!/bin/sh
set -e

cd apps/api
npx prisma migrate deploy
cd ../..

exec node main.js