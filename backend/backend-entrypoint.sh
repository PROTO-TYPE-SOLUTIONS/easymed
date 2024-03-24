#!/bin/ash

until cd /app
do
    echo "Waiting for server volume..."
done

python manage.py collectstatic --noinput

sleep 10


python manage.py makemigrations announcement authperms customuser inventory laboratory patient pharmacy receptions
python manage.py migrate


python manage.py createsuperuser --noinput --email admin@mail.com --password admin --skip-checks

uvicorn --host 0.0.0.0 --port 8080 makeeasyhmis.asgi:application


