#!/bin/sh
until wget -q -S -O - http://localhost:${PORT}; do
    echo "waiting for the express server..."
    sleep 1
done