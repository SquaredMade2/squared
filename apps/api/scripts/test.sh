#!/bin/sh

# install docker containers
pnpm docker:api

# wait for the database to be available before pushing schema
docker cp  ./scripts/wait-db.sh postgres-api-test-db:/
docker exec postgres-api-test-db chmod +x /wait-db.sh
docker exec postgres-api-test-db /bin/sh /./wait-db.sh

# push the schema
docker exec --workdir /app api-test-1 pnpm db:push

# seed the testing data
docker exec --workdir /app/packages/seed api-test-1 pnpm test:db:seed

# wait for the express server to start running
docker exec --workdir /app/apps/api/scripts api-test-1 /bin/sh ./wait-express.sh

# run tests and log docker status if error occurs 
docker exec --workdir /app/apps/api api-test-1 pnpm jest --ci --maxWorkers=2 --forceExit || (docker logs api-test-1 && exit 1)

# destroy docker containers
pnpm docker:api:down