# make-easy-hmis
Repository for Make-Easy HMIS

The technical implementation guide can be found [here](https://drive.google.com/drive/folders/1YjqVylXmq7H-xYRadxENCc-8_zBcDrpp?usp=sharing).


## Running Backend
### Windows
```
virtualenv venv
venv\scripts\activate
cd backend
pip install -r requirements.txt
python manage.py runserver
```

### Linux
```
virtualenv venv
source venv/bin/activate
cd backend
pip install -r requirements.txt
python manage.py runserver
```

API Endpoints:
```
api/v1/schema/redoc/
api/v1/schema/swagger-ui/
```