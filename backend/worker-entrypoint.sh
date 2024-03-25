#!/bin/sh
echo "This script works......"

until cd /app
do
    echo "Waiting for server volume..."
done

# run a worker :)
# celery -A app worker --loglevel=info --concurrency 1 -E
celery -A easymed worker --loglevel=INFO