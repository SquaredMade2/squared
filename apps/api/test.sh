#!/bin/sh

POSTGRES_PRISMA_URL=postgresql://squared:squared@localhost:5433/squared-test?schema=public
TEST_POSTGRES_PRISMA_URL="postgresql://squared:squared@localhost:5433/squared-test?schema=public"

pnpm --filter=@repo/seed docker:db

until pg_isready -h localhost -p 5433; do
    echo "waiting for db..."
    sleep 1
done

pnpm --filter=@repo/db db:push
echo ">> DB PUSHED"
pnpm jest --ci --runInBand --forceExit
pnpm --filter=@repo/seed docker:db:down
