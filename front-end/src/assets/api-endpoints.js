//------------------------ Backend APIs ----------------------//
export const API_URL = {
  /***************** AUTHENTICATION APIS **********************/
  REGISTER_USER: "/users/register/",
  CREATE_USER: "/users/register/",
  LOGIN: "/users/login/",
  REFRESH_TOKEN: "/api/token/refresh/",
  GET_USER_PERMISSIONS: "/authperms/permissions/user",
  FETCH_GROUP: "/authperms/groups",
  FETCH_ALL_PERMISSIONS: "/authperms/permissions",
  FETCH_GROUP_PERMISSIONS: "/authperms/groups/",

  /***************** PATIENT APIS **********************/
  CREATE_PATIENT: "/patients/patients/",
  EDIT_PATIENT: "/patients/patients",
  DELETE_PATIENT: "/patients/patients/",
  FETCH_PATIENT: "/patients/patients/",
  FETCH_PATIENT_BY_ID: "/patients/patients",
  PATIENT_KIN: "/patients/next-of-kin/",
  PATIENT_KIN_CONTACT: "/patients/contact-details/",
  SEARCH_PATIENT: "/patients/patients/",
  BOOK_APPOINTMENT: "/patients/publicappointments/",
  CREATE_APPOINTMENT: "/patients/appointments/",
  FETCH_APPOINTMENTS: "/patients/publicappointments/",
  FETCH_PATIENT_APPOINTMENTS: "/patients/appointments",
  FETCH_PATIENT_APPOINTMENTS_BY_PATIENT_ID: "/patients/appointments/by_patient_id",
  FETCH_DOCTOR_APPOINTMENTS: "/patients/appointments/",
  FETCH_SERVICES: "/patients/services/",
  FETCH_INSURANCE: "/company/insurance-companies/",
  PRESCRIBE: "/patients/prescriptions/",
  ASSIGN_DOCTOR: "/patients/appointments",
  CONSULT_PATIENT: "/patients/consultations/",
  REFER_PATIENT: "/patients/referrals/",
  GET_PATIENT_PROFILE: "/patients/patients",
  PRESCRIBE_DRUG: "/patients/prescribed-drugs/",
  PRESCRIBE_DRUG_BY_PATIENT_ID: "/patients/prescribed-drugs/by_patient_id",
  CREATE_PRESCRIPTION: "/patients/prescriptions/",
  GET_PATIENT_TRIAGE: "/patients/triage/",

  PATIENT_ATTENDANCE_PROCESS: "/patients/initiate-attendance-process/",

  /***************** DOCTOR APIS **********************/
  CREATE_DOCTOR: "/accounts/register/",
  FETCH_DOCTOR: "/users/doctors/",

  /***************** LABORATORY APIS **********************/
  FETCH_LAB_RESULTS: "/lab/lab-test-results/",
  SEND_LAB_RESULTS: "/lab/lab-test-results/",
  FETCH_LAB_REQUESTS: "/lab/lab-test-requests/",
  FETCH_ONE_LAB_REQUESTS: "/lab/lab-test-requests/",
  FETCH_LAB_REQUESTS_BY_PATIENT_ID: "/lab/lab-test-request-by-patient-id",
  SEND_LAB_REQUESTS: "/lab/lab-test-requests/",
  FETCH_LAB_EQUIPMENT: "/lab/lab-equipment/",
  SEND_TO_EQUIPMENT: "/lab/equipment-test-request/",
  PUBLIC_LAB_REQUEST: "/lab/public-lab-test-request/",
  FETCH_LAB_TEST_PROFILE: "/lab/lab-test-profile/",
  FETCH_LAB_TEST_PANELS: "/lab/lab-test-panel/",
  FETCH_LAB_TEST_PANELS_BY_PROFILE_ID: "/lab/lab-test-panel/labtestpanels-byprofile-id",
  FETCH_LAB_TEST_REQUEST_PANELS: "/lab/lab-test-requests-panel/",
  FETCH_PANELS_BY_RESULT:"/lab/lab-test-result-panels-by-lab-test-result-id/",
  FETCH_QUALITATIVE_PANELS_BY_RESULT:"/lab/qualitative-lab-test-result-panels-by-lab-test-result-id/",
  FETCH_LAB_TEST_RESULT_PANELS: "/lab/lab-test-results-panel/",
  QUALITATIVE_LAB_TEST_RESULTS:"/lab/lab-test-results-qualitative/",
  QUALITATIVE_LAB_TEST_RESULTS_PANEL_ITEM: "/lab/lab-test-results-panel-qualitative/",
  GET_LAB_TEST_PANELS_BY_LAB_TEST_REQUEST_ID: "lab/lab-test-request-panels-by-lab-test-request-id/",
  SEND_LAB_RESULTS_ITEMS: "/lab/lab-test-result-item/",
  APPROVE_LAB_RESULTS: "/lab/approve-results/",
  APPROVE_QUALITATIVE_LAB_RESULTS: "/lab/approve-qualitative-results/",
  LAB_TEST_REQ_BY_PROCESS_ID: "lab/lab-test-request-by-process-id/",
  SAMPLES_BY_process_ID: "/lab/patient-samples-by-process-id/",
  PANELS_BY_SAMPLE_ID: "/lab/labtestrequestpanels/sample/",
  PHLEBOTOMY_PATIENT_SAMPLES:"/lab/patient-samples/",

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
  FeTCH_PATIENT_INVOICES: "/billing/invoices/patient/",
  FETCH_INVOICE_ITEMS_BY_INVOICE: "/billing/invoices/items/",
  TOTALS_OF_THE_DAY: "/reports/total_payment_mode_amount/",
  PAYMENT_MODES: "/billing/payment-modes/",

  /***************** PRESCRIPRION **********************/
  FETCH_PRESCRIPTION: "/patients/prescriptions",
  FETCH_PUBLIC_PRESCRIPTION: "/pharmacy/public-prescription-requests/",
  PATIENTPRESCRIPTIONREQUEST: "/pharmacy/public-prescription-requests/",
  FETCH_PRESCRIBED_DRUGS: "/patients/prescribed-drugs/",
  FETCH_PRESCRIPTIONS_PRESCRIBED_DRUGS: "/patients/prescribed-drugs/by-prescription",

  /***************** User **********************/
  GET_USER_NAME: "/customuser/users",
  FETCH_ALL_USERS: "/customuser/users/",
  FETCH_USER_BY_ID: "/customuser/users",

  /***************** Announcements **********************/
  FETCH_ANNOUNCEMENTS_CHANNELS: "/announcement/channels/",
  FETCH_ANNOUNCEMENTS:"/announcement/announcements/",

  /***************** Company **********************/
  FETCH_COMPANY_INFO: "/company/company/",

  /***************** PDFs **********************/
  DOWNLOAD_PDF: "/download",
  DOWNLOAD_RESULT_PDF: "/lab/download",
  SALE_BY_DATE_RANGE_PDF: "/sale_by_date/pdf/",
  SALE_BY_DATE_RANGE_AND_ITEM_PDF: "/serve_sales_by_item_id_pdf/",

  /***************** REPORTS **********************/
  SALE_BY_DATE_RANGE_GENERATE_REPORTS: "/reports/sale_by_date/",
  SALE_BY_DATE_RANGE_AND_ITEM_ID_GENERATE_REPORTS: "/reports/sale_by_item_and_date/",


  /***************** PATIENTS USERS ENDPOINTS **********************/
  /***************** LABORATORY **********************/
  PATIENTLABTESTREQUEST: "/patientlabtestrequest",


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
  FETCH_ALL_PERMISSIONS: "/api/groups/fetchPermissions",
  FETCH_GROUP_PERMISSIONS: "/api/groups/fetchGroupPermissions",

  /***************** PATIENT APIS **********************/
  CREATE_PATIENT: "/api/patient",
  EDIT_PATIENT: "/api/patient/edit-patient",
  DELETE_PATIENT: "/api/patient/delete-patient",
  FETCH_PATIENT: "/api/patient",
  FETCH_PATIENT_BY_ID: "/api/patient/patient_by_id",
  PATIENT_KIN: "/api/patient/patientKin",
  PATIENT_KIN_CONTACT: "/api/patient/next-of-kin-contact/",
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

  PATIENT_ATTENDANCE_PROCESS: "/api/patient/attendance-process",


  /***************** DOCTOR APIS **********************/
  CREATE_DOCTOR: "/api/doctor/create-doctor",
  FETCH_DOCTOR: "/api/doctor/fetch-doctor",

  /***************** LABORATORY APIS **********************/
  FETCH_LAB_RESULTS: "/api/laboratory/get-lab-results",
  SEND_LAB_RESULTS: "/api/laboratory/get-lab-results",
  FETCH_LAB_REQUESTS: "/api/laboratory/get-lab-requests",
  FETCH_ONE_LAB_REQUESTS: "/api/laboratory/getOneTestRequest",
  FETCH_LAB_REQUESTS_BY_PATIENT_ID: "/api/laboratory/labRequestsByPatientId",
  SEND_LAB_REQUESTS: "/api/laboratory/get-lab-requests",
  FETCH_LAB_EQUIPMENT: "/api/laboratory/get-lab-equipment",
  SEND_TO_EQUIPMENT: "/api/laboratory/send-to-equipment",
  PUBLIC_LAB_REQUEST: "/api/laboratory/public-lab-request",
  FETCH_LAB_TEST_PROFILE: "/api/laboratory/get-lab-test-profile",
  FETCH_LAB_TEST_PANELS: "/api/laboratory/get-lab-test-panels",
  FETCH_LAB_TEST_PANELS_BY_PROFILE_ID: "/api/laboratory/labtestpanels-byprofile-id",
  SEND_LAB_RESULTS_ITEMS: "/api/laboratory/get-lab-test-result-item",
  FETCH_LAB_TEST_REQUEST_PANELS: "/api/laboratory/lab-test-requests-panel/",
  FETCH_PANELS_BY_RESULT:"/api/laboratory/lab-test-result-panels-by-lab-test-result-id/",
  FETCH_QUALITATIVE_PANELS_BY_RESULT:"/api/laboratory/qualitative-lab-test-result-panels-by-lab-test-result-id/",
  FETCH_LAB_TEST_RESULT_PANELS: "/api/laboratory/lab-test-results-panel/",
  QUALITATIVE_LAB_TEST_RESULTS:"/api/laboratory/lab-test-results-qualitative/",
  QUALITATIVE_LAB_TEST_RESULTS_PANEL_ITEM: "/api/laboratory/lab-test-results-panel-qualitative/",
  GET_LAB_TEST_PANELS_BY_LAB_TEST_REQUEST_ID: "/api/laboratory/lab-test-request-panels-by-lab-test-request-id/",
  APPROVE_LAB_RESULTS: "/api/laboratory/approve-results/",
  APPROVE_QUALITATIVE_LAB_RESULTS: "/api/laboratory/approve-qualitative-results/",
  LAB_TEST_REQ_BY_PROCESS_ID: "/api/laboratory/lab-test-request-by-process-id",
  SAMPLES_BY_process_ID: "/api/laboratory/samples-by-process-id/",
  PANELS_BY_SAMPLE_ID: "/api/laboratory/panels-by-specific-sample/",
  PHLEBOTOMY_PATIENT_SAMPLES:"/api/laboratory/patient-samples",

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
  FeTCH_PATIENT_INVOICES: "/api/billing/fetch-invoices-by-patient/",
  FETCH_INVOICE_ITEMS_BY_INVOICE: "/api/billing/fetch-invoices-items-by-invoice/",
  TOTALS_OF_THE_DAY: "/api/billing/transactionAday/",
  PAYMENT_MODES: "/api/billing/payment-modes/",


  /***************** PRESCRIPRION **********************/
  FETCH_PRESCRIPTION: "/api/pharmacy/fetch-prescriptions",
  FETCH_PUBLIC_PRESCRIPTION: "/api/pharmacy/fetch-public-prescriptions",
  FETCH_PRESCRIBED_DRUGS: "/api/pharmacy/fetch-prescribed-drugs",
  FETCH_PRESCRIPTIONS_PRESCRIBED_DRUGS: "/api/pharmacy/fetch-prescriptions-prescribed-drug",

  /***************** User **********************/
  GET_USER_NAME: "/api/user/getUserName",
  FETCH_ALL_USERS: "/api/user/getAllUsers",
  FETCH_USER_BY_ID: "/api/user/user-by-id",

  /***************** Announcements **********************/
  FETCH_ANNOUNCEMENTS_CHANNELS: "/api/announcement/channels/",
  FETCH_ANNOUNCEMENTS:"/api/announcement/announcements/",

  /***************** Company **********************/
  FETCH_COMPANY_INFO: "/api/company/company/",

  /***************** PDFs **********************/
  DOWNLOAD_PDF: "/api/pdf/download_pdf",
  DOWNLOAD_RESULT_PDF: "/api/pdf/result_pdf",
  SALE_BY_DATE_RANGE_PDF: "/api/pdf/sale-by-date-range-report-pdf",
  SALE_BY_DATE_RANGE_AND_ITEM_PDF: "/api/pdf/sale-by-date-range-and-item-report-pdf",

  /***************** REPORTS **********************/
  SALE_BY_DATE_RANGE_GENERATE_REPORTS: "/api/reports/sale-by-date-range/",
  SALE_BY_DATE_RANGE_AND_ITEM_ID_GENERATE_REPORTS: "/api/reports/sale-by-date-range-and-item",

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
