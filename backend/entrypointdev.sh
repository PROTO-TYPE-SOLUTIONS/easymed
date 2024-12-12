#!/bin/sh
python manage.py collectstatic --no-input
python manage.py makemigrations authperms customuser patient pharmacy inventory laboratory receptions billing announcement company reports
python manage.py migrate

exec "$@"
