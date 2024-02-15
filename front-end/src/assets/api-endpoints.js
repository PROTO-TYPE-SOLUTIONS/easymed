//------------------------ Backend APIs ----------------------//
export const API_URL = {
  /***************** AUTHENTICATION APIS **********************/
  REGISTER_USER: "/users/register/",
  CREATE_USER: "/users/register/",
  LOGIN: "/users/login/",
  REFRESH_TOKEN: "/api/token/refresh/",
  GET_USER_PERMISSIONS: "/authperms/permissions/user",
  FETCH_GROUP: "/authperms/groups",

  /***************** PATIENT APIS **********************/
  CREATE_PATIENT: "/patients/patients/",
  EDIT_PATIENT: "/patients/patients/",
  DELETE_PATIENT: "/patients/patients/",
  FETCH_PATIENT: "/patients/patients/",
  SEARCH_PATIENT: "/patients/patients/",
  BOOK_APPOINTMENT: "/patients/publicappointments/",
  CREATE_APPOINTMENT: "/patients/appointments/",
  FETCH_APPOINTMENTS: "/patients/publicappointments/",
  FETCH_PATIENT_APPOINTMENTS: "/patients/appointments",
  FETCH_PATIENT_APPOINTMENTS_BY_PATIENT_ID: "/patients/appointments/by_patient_id",
  FETCH_DOCTOR_APPOINTMENTS: "/patients/appointments/",
  FETCH_SERVICES: "/patients/services/",
  FETCH_INSURANCE: "/patients/insurance-companies/",
  PRESCRIBE: "/patients/prescriptions/",
  ASSIGN_DOCTOR: "/patients/appointments",
  CONSULT_PATIENT: "/patients/consultations/",
  REFER_PATIENT: "/patients/referrals/",
  GET_PATIENT_PROFILE: "/patients/patients",
  PRESCRIBE_DRUG: "/patients/prescribed-drugs/",
  PRESCRIBE_DRUG_BY_PATIENT_ID: "/patients/prescribed-drugs/by_patient_id",
  CREATE_PRESCRIPTION: "/patients/prescriptions/",
  GET_PATIENT_TRIAGE: "/patients/triage/",

  /***************** DOCTOR APIS **********************/
  CREATE_DOCTOR: "/accounts/register/",
  FETCH_DOCTOR: "/users/doctors/",

  /***************** LABORATORY APIS **********************/
  FETCH_LAB_RESULTS: "/lab/lab-test-results/",
  SEND_LAB_RESULTS: "/lab/lab-test-results/",
  FETCH_LAB_REQUESTS: "/lab/lab-test-requests/",
  SEND_LAB_REQUESTS: "/lab/lab-test-requests/",
  FETCH_LAB_EQUIPMENT: "/lab/lab-equipment/",
  SEND_TO_EQUIPMENT: "/lab/equipment-test-request/",
  PUBLIC_LAB_REQUEST: "/lab/public-lab-test-request/",
  FETCH_LAB_TEST_PROFILE: "/lab/lab-test-profile/",
  FETCH_LAB_TEST_PANELS: "/lab/lab-test-panel/",
  FETCH_LAB_TEST_PANELS_BY_PROFILE_ID: "/lab/lab-test-panel/labtestpanels-byprofile-id",
  FETCH_LAB_TEST_REQUEST_PANELS: "/lab/lab-test-requests-panel/",
  FETCH_LAB_TEST_RESULT_PANELS: "/lab/lab-test-results-panel/",
  SEND_LAB_RESULTS_ITEMS: "/lab/lab-test-result-item/",

  /***************** INVENTORY APIS **********************/
  ADD_INVENTORY: "/inventory/inventories/",
  FETCH_INVENTORY: "/inventory/inventories/",
  FETCH_SUPPLIERS: "/inventory/suppliers/",
  FETCH_ITEMS: "/inventory/items/",
  DELETE_ITEM: "/inventory/items",
  FETCH_ORDER_BILL: "/inventory/orderbill/",
  REQUISITION: "/inventory/requisition/",
  REQUISITION_ITEM: "/inventory/requisition-item/",
  PURCHASE_ORDER: "/inventory/purchase-order/",
  PURCHASE_ORDER_ITEM: "/inventory/purchase-order-item/",
  FETCH_INCOMING_ITEMS: "/inventory/incoming-item/",


  /***************** NURSING APIS **********************/
  ADD_TRIAGE: "/patients/triage/",


  /***************** BILLING APIS **********************/
  FETCH_PATIENT_BILLING_APPOINTMENTS: "/patients/appointments",
  FETCH_PATIENT_BILLING_LAB_REQUEST: "/lab/lab-test-request-by-patient-id",
  FETCH_PATIENT_BILLING_PRESCRIBED_DRUG: "/patients/prescribed-drugs/by_patient_id",
  BILLING_INVOICE_ITEMS: "/billing/invoice-items/",
  BILLING_INVOICES: "/billing/invoices/",
  FETCH_INVOICES: "/billing/invoices/",

  /***************** PRESCRIPRION **********************/
  FETCH_PRESCRIPTION: "/patients/prescriptions",
  FETCH_PRESCRIBED_DRUGS: "/patients/prescribed-drugs/",
  FETCH_PRESCRIPTIONS_PRESCRIBED_DRUGS: "/patients/prescribed-drugs/by-prescription",

  /***************** User **********************/
  GET_USER_NAME: "/customuser/users",
  FETCH_ALL_USERS: "/customuser/users/",
  FETCH_USER_BY_ID: "/customuser/users",

  /***************** Announcements **********************/
  FETCH_ANNOUNCEMENTS_CHANNELS: "/announcement/channels/",
  FETCH_ANNOUNCEMENTS:"/announcement/announcements/",

  /***************** PDFs **********************/
  DOWNLOAD_PDF: "/download",

  /***************** PATIENTS USERS ENDPOINTS **********************/
  /***************** LABORATORY **********************/
  PATIENTLABTESTREQUEST: "/patientlabtestrequest",

  /***************** PRESCRIPTION **********************/
  PATIENTPRESCRIPTIONREQUEST: "/patientprescriptionrequest",


};

//------------------------ Application APIs ----------------------//
export const APP_API_URL = {
  /***************** AUTH **********************/
  REGISTER_USER: "/api/register",
  CREATE_USER: "/api/auth/create-user",
  LOGIN: "/api/register/login",
  REFRESH_TOKEN: "/api/auth/refresh",
  GET_USER_PERMISSIONS: "/api/auth/user-permissions",
  FETCH_GROUP: "/api/groups",
  FETCH_PATIENT_GROUP: "/api/auth/get-group",

  /***************** PATIENT APIS **********************/
  CREATE_PATIENT: "/api/patient",
  EDIT_PATIENT: "/api/patient/edit-patient",
  DELETE_PATIENT: "/api/patient/delete-patient",
  FETCH_PATIENT: "/api/patient",
  SEARCH_PATIENT: "/api/billing/search-patients",
  BOOK_APPOINTMENT: "/api/appointment",
  CREATE_APPOINTMENT: "/api/appointment/create-appointment",
  FETCH_APPOINTMENTS: "/api/appointment",
  FETCH_PATIENT_APPOINTMENTS: "/api/appointment/patient-appointment",
  FETCH_PATIENT_APPOINTMENTS_BY_PATIENT_ID: "/api/appointment/appointments-by-patient-id/",
  FETCH_DOCTOR_APPOINTMENTS: "/api/appointment/get-appointment-by-doctor",
  FETCH_SERVICES: "/api/patient/fetch-services",
  FETCH_INSURANCE: "/api/insurance",
  PRESCRIBE: "/api/patient/prescribe",
  ASSIGN_DOCTOR: "/api/patient/assign-doctor",
  CONSULT_PATIENT: "/api/patient/consult-patient",
  REFER_PATIENT: "/api/patient/refer-patient",
  GET_PATIENT_PROFILE: "/api/patient/patient-profile",
  PRESCRIBE_DRUG: "/api/patient/prescribe-drug",
  PRESCRIBE_DRUG_BY_PATIENT_ID: "/api/patient/prescribed-drugs-by-patient-id",
  CREATE_PRESCRIPTION: "/api/patient/create-prescription",
  GET_PATIENT_TRIAGE: "/api/patient/get-patient-triage",

  /***************** DOCTOR APIS **********************/
  CREATE_DOCTOR: "/api/doctor/create-doctor",
  FETCH_DOCTOR: "/api/doctor/fetch-doctor",

  /***************** LABORATORY APIS **********************/
  FETCH_LAB_RESULTS: "/api/laboratory/get-lab-results",
  SEND_LAB_RESULTS: "/api/laboratory/get-lab-results",
  FETCH_LAB_REQUESTS: "/api/laboratory/get-lab-requests",
  SEND_LAB_REQUESTS: "/api/laboratory/get-lab-requests",
  FETCH_LAB_EQUIPMENT: "/api/laboratory/get-lab-equipment",
  SEND_TO_EQUIPMENT: "/api/laboratory/send-to-equipment",
  PUBLIC_LAB_REQUEST: "/api/laboratory/public-lab-request",
  FETCH_LAB_TEST_PROFILE: "/api/laboratory/get-lab-test-profile",
  FETCH_LAB_TEST_PANELS: "/api/laboratory/get-lab-test-panels",
  FETCH_LAB_TEST_PANELS_BY_PROFILE_ID: "/api/laboratory/labtestpanels-byprofile-id",
  SEND_LAB_RESULTS_ITEMS: "/api/laboratory/get-lab-test-result-item",
  FETCH_LAB_TEST_REQUEST_PANELS: "/api/laboratory/lab-test-requests-panel/",
  FETCH_LAB_TEST_RESULT_PANELS: "/api/laboratory/lab-test-results-panel/",

  /***************** INVENTORY APIS **********************/
  ADD_INVENTORY: "/api/inventory/add-inventory",
  FETCH_INVENTORY: "/api/inventory/fetch-inventory",
  FETCH_SUPPLIERS: "/api/inventory/fetch-suppliers",
  FETCH_ITEMS: "/api/inventory/fetch-items",
  FETCH_ITEM: "/api/inventory/get-item",
  DELETE_ITEM: "/api/inventory/delete-item",
  FETCH_ORDER_BILL: "/api/order-bills/fetch-order-bill",
  REQUISITION: "/api/inventory/requisition",
  REQUISITION_ITEM: "/api/inventory/requisition-item",
  PURCHASE_ORDER: "/api/inventory/purchase-order",
  PURCHASE_ORDER_ITEM: "/api/inventory/purchase-order-item",
  FETCH_INCOMING_ITEMS: "/api/inventory/incomingItem",


  /***************** NURSING APIS **********************/
  ADD_TRIAGE: "/api/nursing/add-triage",

  /***************** BILLING APIS **********************/
  FETCH_PATIENT_BILLING_APPOINTMENTS: "/api/billing/patient-appointments",
  FETCH_PATIENT_BILLING_LAB_REQUEST: "/api/billing/patient-lab-request",
  FETCH_PATIENT_BILLING_PRESCRIBED_DRUG: "/api/billing/prescribed-drug",
  BILLING_INVOICE_ITEMS: "/api/billing/invoice-items",
  BILLING_INVOICES: "/api/billing/billing-invoices",
  FETCH_INVOICES: "/api/billing/fetch-invoices",

  /***************** PRESCRIPRION **********************/
  FETCH_PRESCRIPTION: "/api/pharmacy/fetch-prescriptions",
  FETCH_PRESCRIBED_DRUGS: "/api/pharmacy/fetch-prescribed-drugs",
  FETCH_PRESCRIPTIONS_PRESCRIBED_DRUGS: "/api/pharmacy/fetch-prescriptions-prescribed-drug",

  /***************** User **********************/
  GET_USER_NAME: "/api/user/getUserName",
  FETCH_ALL_USERS: "/api/user/getAllUsers",
  FETCH_USER_BY_ID: "/api/user/user-by-id",

  /***************** Announcements **********************/
  FETCH_ANNOUNCEMENTS_CHANNELS: "/api/announcement/channels/",
  FETCH_ANNOUNCEMENTS:"/api/announcement/announcements/",

  /***************** PDFs **********************/
  DOWNLOAD_PDF: "/api/pdf/download_pdf",

    /***************** PATIENTS USERS ENDPOINTS **********************/
  /***************** LABORATORY **********************/
  PATIENTLABTESTREQUEST: "/api/patient-profile/patientlabtestrequest",

  /***************** PRESCRIPTION **********************/
  PATIENTPRESCRIPTIONREQUEST: "/api/patient-profile/patientprescriptionrequest",

};

export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  PUT: "PUT",
  DELETE: "DELETE",
};
