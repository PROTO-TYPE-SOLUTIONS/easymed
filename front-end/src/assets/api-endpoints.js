//------------------------ Backend APIs ----------------------//
export const API_URL = {
  /***************** AUTHENTICATION APIS **********************/
  REGISTER_USER: "/users/register/",
  LOGIN: "/users/login/",
  REFRESH_TOKEN: "/api/token/refresh/",
  GET_USER_PERMISSIONS: "/authperms/permissions/user",
  FETCH_GROUP: "/authperms/groups",

  /***************** PATIENT APIS **********************/
  CREATE_PATIENT: "/patients/patients/",
  EDIT_PATIENT: "/patients/patients/",
  DELETE_PATIENT: "/patients/patients/",
  FETCH_PATIENT: "/patients/patients/",
  BOOK_APPOINTMENT: "/patients/publicappointments/",
  FETCH_APPOINTMENTS: "/patients/publicappointments/",
  FETCH_PATIENT_APPOINTMENTS: "/patients/appointments/",
  FETCH_DOCTOR_APPOINTMENTS: "/patients/appointments/",
  FETCH_SERVICES: "/patients/services/",
  FETCH_INSURANCE: "/patients/insurance-companies/",
  PRESCRIBE: "/patients/prescriptions/",
  ASSIGN_DOCTOR: "/patients/appointments",
  CONSULT_PATIENT: "/patients/consultations/",
  REFER_PATIENT: "/patients/referrals/",
  GET_PATIENT_PROFILE: "/patients/patients",
  PRESCRIBE_DRUG: "/patients/prescribed-drugs/",
  CREATE_PRESCRIPTION: "/patients/prescriptions/",

  /***************** DOCTOR APIS **********************/
  CREATE_DOCTOR: "/accounts/register/",
  FETCH_DOCTOR: "/users/doctors/",

  /***************** LABORATORY APIS **********************/
  FETCH_LAB_RESULTS: "/lab/lab-test-results/",
  FETCH_LAB_REQUESTS: "/lab/lab-test-requests/",
  SEND_LAB_REQUESTS: "/lab/lab-test-requests/",
  FETCH_LAB_EQUIPMENT: "/lab/lab-equipment/",
  SEND_TO_EQUIPMENT: "/lab/equipment-test-request/",
  PUBLIC_LAB_REQUEST: "/lab/public-lab-test-request/",

  /***************** INVENTORY APIS **********************/
  ADD_INVENTORY: "/inventory/inventories/",
  FETCH_SUPPLIERS: "/inventory/suppliers/",
  FETCH_ITEMS: "/inventory/items/",
  DELETE_ITEM: "/inventory/items",

  /***************** NURSING APIS **********************/
  ADD_TRIAGE: "/patients/triage/",
};

//------------------------ Application APIs ----------------------//
export const APP_API_URL = {
  /***************** AUTH **********************/
  REGISTER_USER: "/api/register",
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
  BOOK_APPOINTMENT: "/api/appointment",
  FETCH_APPOINTMENTS: "/api/appointment",
  FETCH_PATIENT_APPOINTMENTS: "/api/appointment/patient-appointment",
  FETCH_DOCTOR_APPOINTMENTS: "/api/appointment/get-appointment-by-doctor",
  FETCH_SERVICES: "/api/patient/fetch-services",
  FETCH_INSURANCE: "/api/insurance",
  PRESCRIBE: "/api/patient/prescribe",
  ASSIGN_DOCTOR: "/api/patient/assign-doctor",
  CONSULT_PATIENT: "/api/patient/consult-patient",
  REFER_PATIENT: "/api/patient/refer-patient",
  GET_PATIENT_PROFILE: "/api/patient/patient-profile",
  PRESCRIBE_DRUG: "/api/patient/prescribe-drug",
  CREATE_PRESCRIPTION: "/api/patient/create-prescription",

  /***************** DOCTOR APIS **********************/
  CREATE_DOCTOR: "/api/doctor/create-doctor",
  FETCH_DOCTOR: "/api/doctor/fetch-doctor",

  /***************** LABORATORY APIS **********************/
  FETCH_LAB_RESULTS: "/api/laboratory/get-lab-results",
  FETCH_LAB_REQUESTS: "/api/laboratory/get-lab-requests",
  SEND_LAB_REQUESTS: "/api/laboratory/get-lab-requests",
  FETCH_LAB_EQUIPMENT: "/api/laboratory/get-lab-equipment",
  SEND_TO_EQUIPMENT: "/api/laboratory/send-to-equipment",
  PUBLIC_LAB_REQUEST: "/api/laboratory/public-lab-request",

  /***************** INVENTORY APIS **********************/
  ADD_INVENTORY: "/api/inventory/add-inventory",
  FETCH_SUPPLIERS: "/api/inventory/fetch-suppliers",
  FETCH_ITEMS: "/api/inventory/fetch-items",
  DELETE_ITEM: "/api/inventory/delete-item",

  /***************** NURSING APIS **********************/
  ADD_TRIAGE: "/api/nursing",
};

export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  PUT: "PUT",
  DELETE: "DELETE",
};
