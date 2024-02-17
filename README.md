# 1.0.0 make-easy-hmis
Repository for Make-Easy HMIS

Checkout the Wiki page for the technical implementation

## 1.2.0 Running with Docker
If you're running with docker, inside ./src/assets/backend-axios-instance/index.js
with docker baseURL = baseURL: "http://backend:8000",

In the root directory run;
```docker compose up```
Frontend will be running on http://backend:3000 and backend on http://backend:8000

## 1.3.0 Running Manually
## 1.3.1 Running Backend
First rename the ``./backend/.env.local``  to ``.env`` with the sample code inside

### i) Windows
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

### ii) Linux
```
virtualenv venv
source venv/bin/activate
cd backend
pip install -r requirements.txt
python manage.py makemigrations customuser authperms patient pharmacy inventory laboratory receptions billing announcement
python manage.py migrate
python manage.py runserver
```
Create a superuser with ``python manage.py createsuperuser``
You'll use this account to log into the dashboard in frontend

To register patients using landing page, create a group in django Admin called PATIENT

API Endpoints:
```
/docs/
docs/swagger/
```


## 1.3.2 Running FrontEnd
Inside ./src/assets/backend-axios-instance/index.js
running manually  = baseURL: "http://127.0.0.1:8000",


#### First, create a .env file in the same directory as the src folder then add the following:

* NEXT_PUBLIC_BASE_URL=""
* NEXT_PUBLIC_ENCRYPTION_KEY="c2FubGFta2VueWFAZ21haWwuY29t"

Lastly run the development server using:

```
npm run dev
```
Dev version can be a little slow. To run a faster build version, use  the follwoing commands:

```
npm run build
npm start
```
Visit localhost 127.0.0.1:3000/dashboard

## Adding Permissions
You need to create groups and associate permissions. make sure groups follow this order ``SYS_ADMIN``, ``PATIENT`` group then the rest ie ``DOCTOR``,``PHARMACIST``, ``RECEPTIONIST``, ``LAB_TECH`` , ``NURSE``
Then create permissions below and link to the ``GROUPS``.

Create super user then navigate to localhost:8080/admin and add permissions;
* Doctor Dashboard => ``CAN_ACCESS_DOCTOR_DASHBOARD``
* General Dashboard => ``CAN_ACCESS_GENERAL_DASHBOARD``
* Admin Dashboard => ``CAN_ACCESS_ADMIN_DASHBOARD``
* Reception Dashboard => ``CAN_ACCESS_RECEPTION_DASHBOARD``
* Nursing Dashboard => ``CAN_ACCESS_NURSING_DASHBOARD``
* Laboratory Dashboard => ``CAN_ACCESS_LABORATORY_DASHBOARD``
* Patients Dashboard => ``CAN_ACCESS_PATIENTS_DASHBOARD``
* AI ASSISTANT Dashboard => ``CAN_ACCESS_AI_ASSISTANT_DASHBOARD``
* Announcement Dashboard => ``CAN_ACCESS_ANNOUNCEMENT_DASHBOARD``
* Pharmacy Dashboard => ``CAN_ACCESS_PHARMACY_DASHBOARD``
* Inventory Dashboard => ``CAN_ACCESS_INVENTORY_DASHBOARD``
* Billing Dashboard => ``CAN_ACCESS_BILLING_DASHBOARD``

You will notice that we have a Role and a Group. A group is associated with permissions which determines which specific dashboards a user is allowed to access. A role helps differentiate staff from patients hence redirecting to patient profile if patient and to general dashboard if staff.


## Running celery
If not installed already, install celery and redis INSIDE YOUR VIRTUAL ENV
``pip install celery redis``
Run Celery: ``celery -A makeeasyhmis worker --loglevel=INFO``
Run Redis: ``redis-cli -h 127.0.0.1 -p 6379``

Generated PDFs
``http://127.0.0.1:8080/download_{service_name}_pdf/{id}``
i.e ``http://127.0.0.1:8080/download_invoice_pdf/24``


## Testing Socket connection for notifications
Django's runserver does not support asgi
run with uvicorn to have the notifications working
``uvicorn --port 8080 makeeasyhmis.asgi:application``

On a separate terminal
``npm install -g wscat``
``wscat -c ws://localhost:8080/ws/doctor_notifications/`` <-- appointment assigned notification will be seen here