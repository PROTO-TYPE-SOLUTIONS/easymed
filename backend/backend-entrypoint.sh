#!/bin/ash

until cd /app
do
    echo "Waiting for server volume..."
done

python manage.py collectstatic --noinput

sleep 10


python manage.py makemigrations announcement authperms customuser inventory laboratory patient pharmacy receptions
python manage.py migrate

# until python manage.py migrate
# do
#     echo "Waiting for db to be ready..."
#     sleep 2
# done

python manage.py createsuperuser --noinput --username admin@mail.com --email admin@mail.com --password admin

uvicorn --host 0.0.0.0 --port 8080 makeeasyhmis.asgi:application


