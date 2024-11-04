#!/bin/sh
until pg_isready -h localhost -p 5432; do
    echo "waiting for db..."
    sleep 1
done