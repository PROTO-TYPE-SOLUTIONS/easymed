# 1.0.0 Getting Started

Repository for Make-Easy HMIS

Checkout the Wiki page for the technical implementation

## 1.2.0 Running with Docker

If you're running with docker, inside ./src/assets/backend-axios-instance/index.js
with docker baseURL = baseURL: "http://backend:8000",
Make sure you have the .env filed specified in the `docker-compose-local.yml` or `docker-compose.yml`
In the root directory run;
`docker compose up` 
If you want to run the development version, run:
`docker compose -f docker-compose-local.yml`
Frontend will be running on http://backend:3000 and backend on http://backend:8000
This well set up all the services you need including celery and redis. As of September, backend uses sqlite, so no need to set up external postgres,. This will however be changed when deployed.

After the steps above, jump to Adding Permissions and add permissions.

## 1.3.0 Running Manually
I highly suggest you use docker. However, if for some reason or the other you're not able to use docker, follow the steps below to run manually.

## 1.3.1 Running Backend
First rename the `./backend/.env.local` to `.env` with the sample code inside

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

python manage.py makemigrations customuser authperms patient pharmacy inventory laboratory company receptions billing announcement

python manage.py migrate
python manage.py runserver
```

Create a superuser with `python manage.py createsuperuser`
You'll use this account to log into the dashboard in frontend

To register patients using landing page, create a group in django Admin called PATIENT

API Endpoints:
```
127.0.0.1:8085/docs/swagger/
```
## Running celery
If not installed already, install celery and redis INSIDE YOUR VIRTUAL ENV
`pip install celery redis`
Run Celery: `celery -A easymed worker --loglevel=INFO`
Run Redis: `redis-cli -h 127.0.0.1 -p 6379`

## Running celery beat
If not installed already, install celery and redis INSIDE YOUR VIRTUAL ENV
`pip install celery redis`
Run Celery: `celery -A easymed beat --loglevel=INFO`

## Testing Socket connection for notifications
Django's runserver does not support asgi (socket connections required for notifications)
run with uvicorn to have the notifications working
`uvicorn --port 8080 easymed.asgi:application`

Currently, the notifications are sent to the group `doctor_notifications` and `inventory_notifications`

On a separate terminal
`npm install -g wscat`

# Patient Notifications
on a separate terminal
`wscat -c ws://localhost:8080/ws/doctor_notifications/` <-- appointment assigned notification will be seen here

# Inventory Notifications
First navigate to the admin panel and assign permission`CAN_RECEIVE_INVENTORY_NOTIFICATIONS` to a group to ensure specific users receive notifications via email

Example:
- Group: `LAB_TECH`
- Permission: `CAN_RECEIVE_INVENTORY_NOTIFICATIONS`

on a separate terminal
`wscat -c ws://localhost:8080/ws/inventory_notifications/` <-- inventory notification will be seen here


## Adding Permissions
You need to create groups and associate permissions. make sure groups follow this order `SYS_ADMIN`, `PATIENT` group then the rest ie `DOCTOR`,`PHARMACIST`, `RECEPTIONIST`, `LAB_TECH` , `NURSE`
Then create permissions below and link to the `GROUPS`.
N/B: Frontend will not work without permissions and Groups set up.
Create super user then navigate to localhost:8080/admin and add permissions;

- Doctor Dashboard => `CAN_ACCESS_DOCTOR_DASHBOARD`
- General Dashboard => `CAN_ACCESS_GENERAL_DASHBOARD`
- Admin Dashboard => `CAN_ACCESS_ADMIN_DASHBOARD`
- Reception Dashboard => `CAN_ACCESS_RECEPTION_DASHBOARD`
- Nursing Dashboard => `CAN_ACCESS_NURSING_DASHBOARD`
- Laboratory Dashboard => `CAN_ACCESS_LABORATORY_DASHBOARD`
- Patients Dashboard => `CAN_ACCESS_PATIENTS_DASHBOARD`
- AI ASSISTANT Dashboard => `CAN_ACCESS_AI_ASSISTANT_DASHBOARD`
- Announcement Dashboard => `CAN_ACCESS_ANNOUNCEMENT_DASHBOARD`
- Pharmacy Dashboard => `CAN_ACCESS_PHARMACY_DASHBOARD`
- Inventory Dashboard => `CAN_ACCESS_INVENTORY_DASHBOARD`
- Billing Dashboard => `CAN_ACCESS_BILLING_DASHBOARD`
-`CAN_RECEIVE_INVENTORY_NOTIFICATIONS`

You will notice that we have a Role and a Group. A group is associated with permissions which determines which specific dashboards a user is allowed to access. A role helps differentiate staff from patients hence redirecting to patient profile if patient and to general dashboard if staff.

## 1.3.2 Running FrontEnd
Inside ./src/assets/backend-axios-instance/index.js
running manually = baseURL: "http://127.0.0.1:8000",

#### First, create a .env file in the same directory as the src folder then add the following:
- NEXT_PUBLIC_HMIS_VERSION=v0.0.1-alpha-0.1
- NEXT_PUBLIC_BASE_URL=""

Lastly run the development server using:
```
npm run dev
```
Dev version can be a little slow. To run a faster build version, use the follwoing commands:
```
npm run build
npm start
```
Visit localhost 127.0.0.1:3000/dashboard


## a word on patient processes
Each process starting form Appointment, should be billed first before it's actioned.
For Billing to work, these should be updated in order.
Patient must have Insurance if not, cash will be picked by default.
Payment Modes should be updated in that regard
Add Item
Add Inventory for that item
Add InsuranceSalePrise for specific Items depending on the Insurance


# 1.5.0 Reporting
## Sale by Date Range
To generate sales by given date, send sample request as shown below
`curl -X POST http://localhost:8080/reports/sale_by_date/   -H "Content-Type: application/json"   -d '{"start_date": "2024-02-01", "end_date": "2024-02-18"}' > report-log.txt`
curl
The `> report-log.txt` just dumps the logs to the report-log.txt file for troubleshooting.

If sending directly from frontend, just configure the payload and send to the endpoint `http://localhost:8080/reports/sale_by_date/ `
You can access the generated report here
`http://127.0.0.1:8080/sale_by_date/pdf/`


## Sale by Date Range and Item Id
To generated sales report by date range and given item id;
`curl -X POST http://localhost:8080/reports/sale_by_item_and_date/   -H "Content-Type: application/json"   -d '{"item_id": "1", "start_date": "2024-02-01", "end_date": "2024-02-10"}'`

You can access the generated pdf here ``/serve_sales_by_item_id_pdf/``

## sales by payment mode
Send POST request to the endpoint below, teh response will have the total amount 
for a given payment mode
```/reports/total_payment_mode_amount/?payment_mode=insurance&date=2024-02-18```

## Lab reports
By default, or when explicitly specified, all lab test will be quantitative and will use the following endpoints.  In the same order, create a report, add test-panel-results to that report
then generate the pdf report
```/lab/lab-test-results/```
```/lab/lab-test-results-panel/```
```/download_labtestresult_pdf/<int:labtestresult_id>/```

To get  a test result report for a particular patient, you send a GET request to this endpoint:
``http://127.0.0.1:8080/download_labtestresult_pdf/{processtestrequest_id}``


## Doctor Reports
This will give you all appointments by given doctor and date range
http://127.0.0.1:8080/patients/report/appointments/?doctor_id=1&start_date=2024-08-01&end_date=2024-08-31

If no date range is specified it will get you a report for all appointments
http://127.0.0.1:8080/patients/report/appointments/?doctor_id=2


## Goods Receipt note
Generates a receipt note for incoming items
``http://127.0.0.1:8080/inventory/receipt-note/{purchade_order_id}/``



# 1.6.0 Laboratory Integration
Due to the complexity of the lab module, the integration will be handled by a parser which 
is hosted on a separate repository [here](https://github.com/mosesmbadi/hl7_astm_parser).
Here's an overview of the process;
1. The parser listens to a specific port for incoming messages
2. If incoming message is HL7 or ASTM, it convirts to JSON and sends to the backend
3. The backend receives the JSON and saves to the database
4. If the incoming message is JSON, the parser will extract the equipment name, convirts the JSON to HL7 or ASTM and sends to the equipment.

# 1.7.0  System Requirements
Minimum system specifications
RAM 8GB
Disk SSD 250GB
CPU 3-10th Gen

Other requirements;
The system uses TCP to primarily integret with Equipment.
For equipment with any other form of coms other than TCP/Ethernet,
will need to be configured with additional hardware that converts
the coms to TCP
A device such us [this](https://www.whizz.co.ke/product/1443079/usr-tcp232-302-tiny-size-rs232-to-tcp-ip-converter-serial-rs232-to-ethernet-server-module-ethernet-converter-support-dhcp-dns/), can work.


