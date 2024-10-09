#!/bin/sh
until pg_isready -h postgres-api-test-db -p 5432; do
    echo "waiting for db..."
    sleep 1
done