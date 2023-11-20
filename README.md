# make-easy-hmis
Repository for Make-Easy HMIS

The technical implementation guide can be found [here](https://drive.google.com/drive/folders/1YjqVylXmq7H-xYRadxENCc-8_zBcDrpp?usp=sharing).


## Running Backend
### Windows
[Install](https://medium.com/analytics-vidhya/virtual-environment-6ad5d9b6af59) python and virtualenv.
Next, in the project directory run:
```
virtualenv venv
venv\scripts\activate
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### Linux
```
virtualenv venv
source venv/bin/activate
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

API Endpoints:
```
api/v1/docs/
api/v1/docs/swagger/
```