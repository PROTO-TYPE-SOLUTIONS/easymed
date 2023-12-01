# make-easy-hmis
Repository for Make-Easy HMIS

The technical implementation guide can be found [here](https://drive.google.com/drive/folders/1YjqVylXmq7H-xYRadxENCc-8_zBcDrpp?usp=sharing).


### Running with Docker
In the root directory run;
```docker compose up```

### Running manually
## Running Backend
(refer to ./front-end/README.md to run frontend)
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


## Adding Permissions
Create super user then navigate to localhost:8080/admin and add permissions;
* Doctor Dashboard => CAN_ACCESS_DOCTOR_DASHBOARD
* General Dashboard => CAN_ACCESS_GENERAL_DASHBOARD
* Admin Dashboard => CAN_ACCESS_ADMIN_DASHBOARD
* Reception Dashboard => CAN_ACCESS_RECEPTION_DASHBOARD
* Nursing Dashboard => CAN_ACCESS_NURSING_DASHBOARD
* Laboratory Dashboard => CAN_ACCESS_LABORATORY_DASHBOARD
* Patients Dashboard => CAN_ACCESS_PATIENTS_DASHBOARD
* AI ASSISTANT Dashboard => CAN_ACCESS_AI_ASSISTANT_DASHBOARD
* Announcement Dashboard => CAN_ACCESS_ANNOUNCEMENT_DASHBOARD
* Pharmacy Dashboard => CAN_ACCESS_PHARMACY_DASHBOARD
* Inventory Dashboard => CAN_ACCESS_INVENTORY_DASHBOARD