#!/bin/sh
# "test": "pnpm docker:api && pnpm test:db:wait && pnpm test:db:push && docker stats --no-stream && pnpm docker:api:check && docker exec -i --workdir /app/apps/api api-test-1 pnpm jest --ci --maxWorkers=2 --forceExit || (docker logs api-test-1 && docker stats api-test-1 --no-stream) && pnpm docker:api:down",

# install docker
pnpm docker:api

# wait for the database to be available before pushing schema
docker cp  ./scripts/wait-db.sh postgres-api-test-db:/
docker exec postgres-api-test-db chmod +x /wait-db.sh
docker exec -i postgres-api-test-db /bin/sh /./wait-db.sh

# push the schema
docker exec --workdir /app api-test-1 pnpm db:push

# wait for the express server to start running
docker cp ./scripts/wait-express.sh api-test-1:/
docker exec -i --workdir / api-test-1 /bin/sh ./wait-express.sh

# run tests and log docker status if error happens
docker exec -i --workdir /app/apps/api api-test-1 pnpm jest --ci --maxWorkers=2 --forceExit || (docker logs api-test-1 && exit 1)

# destroy docker containers
pnpm docker:api:down