#!/bin/ash

until cd /app
do
    echo "Waiting for server volume..."
done

python manage.py collectstatic --noinput

sleep 4


# python manage.py makemigrations announcement authperms customuser inventory laboratory patient pharmacy receptions billing reports company
# python manage.py migrate


# python manage.py createsuperuser --noinput --email admin@mail.com --password admin --skip-checks




