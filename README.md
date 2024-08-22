# 1.0.0 easymed

Repository for Make-Easy HMIS

Checkout the Wiki page for the technical implementation

## 1.2.0 Running with Docker

If you're running with docker, inside ./src/assets/backend-axios-instance/index.js
with docker baseURL = baseURL: "http://backend:8000",

In the root directory run;
`docker compose up`
Frontend will be running on http://backend:3000 and backend on http://backend:8000

## 1.3.0 Running Manually

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
python manage.py makemigrations customuser authperms patient pharmacy inventory laboratory receptions billing announcement
python manage.py migrate
python manage.py runserver
```

Create a superuser with `python manage.py createsuperuser`
You'll use this account to log into the dashboard in frontend

To register patients using landing page, create a group in django Admin called PATIENT

API Endpoints:

```
/docs/
docs/swagger/
```

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

## Adding Permissions

You need to create groups and associate permissions. make sure groups follow this order `SYS_ADMIN`, `PATIENT` group then the rest ie `DOCTOR`,`PHARMACIST`, `RECEPTIONIST`, `LAB_TECH` , `NURSE`
Then create permissions below and link to the `GROUPS`.

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

You will notice that we have a Role and a Group. A group is associated with permissions which determines which specific dashboards a user is allowed to access. A role helps differentiate staff from patients hence redirecting to patient profile if patient and to general dashboard if staff.

## Running celery

If not installed already, install celery and redis INSIDE YOUR VIRTUAL ENV
`pip install celery redis`
Run Celery: `celery -A easymed worker --loglevel=INFO`
Run Redis: `redis-cli -h 127.0.0.1 -p 6379`

Generated PDFs
`http://127.0.0.1:8080/download_{service_name}_pdf/{id}`
i.e `http://127.0.0.1:8080/download_invoice_pdf/24`

## Testing Socket connection for notifications

Django's runserver does not support asgi
run with uvicorn to have the notifications working
`uvicorn --port 8080 easymed.asgi:application`

On a separate terminal
`npm install -g wscat`
`wscat -c ws://localhost:8080/ws/doctor_notifications/` <-- appointment assigned notification will be seen here

# Financial Reporting
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


The /preflight directory contains set up files for an LIS Host listener.

Qualitative and quantitative results will be moved to specify the type in a test panel
## Qualitative reports;
If a Lab results is selected as qualitative, use this endpoint
``/lab/lab-test-results-qualitative/``
and the results for the test panels should be sent here
``/lab/lab-test-results-panel-qualitative``
Generated report can be gotten here
``/lab/download_qualitative_labtestresult_pdf/<int:labtestresult_id>/``

By default, or when explicitly specified, all lab test will be quantitative and will use the following endpoints.  In the same order, create a report, add test-panel-results to that report
then generate the pdf report
``/lab/lab-test-results/``
``/lab/lab-test-results-panel/``
``/download_labtestresult_pdf/<int:labtestresult_id>/``


## Laboratory Integration
When you click Send to Equipment and select the equiment in the dashboard, the test request gets converted to HL7 or ASTM and sent to the equipment.

The laboratory>addons>lis_list2.py will listen for any incoming data, then check the format, convert that format to json then send to the results endpoint

## System Requirements
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
