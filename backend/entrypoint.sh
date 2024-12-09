#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $POSTGRES_HOST $POSTGRESS_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

python manage.py collectstatic --no-input
python manage.py makemigrations authperms customuser patient pharmacy inventory laboratory receptions billing announcement company reports
python manage.py migrate

exec "$@"
