#!/bin/sh
until wget -q -S -O - http://localhost:5173; do
    echo "waiting for the express server..."
    sleep 1
done