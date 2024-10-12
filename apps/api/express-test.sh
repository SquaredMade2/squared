#!/bin/sh
until curl -h localhost -p 5173; do
    echo "waiting for the express server..."
    sleep 1
done