#!/bin/sh

POSTGRES_PRISMA_URL=postgresql://squared:squared@localhost:5433/squared-test?schema=public

pnpm --filter=@repo/seed docker:db;
pnpm --filter=@repo/db db:push;

until pg_isready -h localhost -p 5433; do
    echo "waiting for db..."
    sleep 1
done

pnpm start & sleep 5 && pnpm jest --ci --runInBand;