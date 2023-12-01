

# Running FrontEnd

#### First, create a .env.local file in the same directory as the src folder then add the following:

* NEXT_PUBLIC_BASE_URL=""
* NEXT_PUBLIC_ENCRYPTION_KEY="c2FubGFta2VueWFAZ21haWwuY29t"

###### Include your base_url in the field above then use the above encryption key

# Adding Permissions

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

Lastly run the development server using either of the following commands:

```bash
npm run dev

```

Visit localhost 3000 then visit /dashboard to access the dashboard route

