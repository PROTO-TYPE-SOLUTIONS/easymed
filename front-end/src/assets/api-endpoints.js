//------------------------ Backend APIs ----------------------//
export const API_URL = {


    /***************** AUTHENTICATION APIS **********************/
    REGISTER_USER: '/users/register/',
    LOGIN: '/users/login/',
    REFRESH_TOKEN: '/api/token/refresh/',
    GET_USER_PERMISSIONS: '/api/permissions',


    /***************** PATIENT APIS **********************/
    CREATE_PATIENT: '/patients/patients/',
    EDIT_PATIENT: '/patients/patients/',
    DELETE_PATIENT: '/patients/patients/',
    FETCH_PATIENT: '/patients/patients/',
    BOOK_APPOINTMENT: '/patients/publicappointments/',
    FETCH_APPOINTMENTS: '/patients/publicappointments/',
    FETCH_SERVICES: '/patients/services/',
    FETCH_INSURANCE: '/patients/insurance-companies/',
    PRESCRIBE: '/patients/prescriptions/',
    ASSIGN_DOCTOR: '/patients/appointments/',
    CONSULT_PATIENT: '/patients/consultation/',
    REFER_PATIENT: '/patients/referrals/',


    /***************** DOCTOR APIS **********************/
    CREATE_DOCTOR: '/accounts/register/',
    FETCH_DOCTOR: '/users/doctors/',


    /***************** INVENTORY APIS **********************/
    ADD_INVENTORY: '/inventory/inventories/',
    FETCH_SUPPLIERS: '/inventory/suppliers/',
    FETCH_ITEMS: '/inventory/items/',

}


//------------------------ Application APIs ----------------------//
export const APP_API_URL = {

    /***************** AUTH **********************/
    REGISTER_USER: '/api/register',
    LOGIN: '/api/register/login',
    REFRESH_TOKEN: '/api/auth/refresh',
    GET_USER_PERMISSIONS: '/api/auth/user-permissions',
   

    /***************** PATIENT APIS **********************/
    CREATE_PATIENT: '/api/patient',
    EDIT_PATIENT: '/api/patient/edit-patient',
    DELETE_PATIENT: '/api/patient/delete-patient',
    FETCH_PATIENT: '/api/patient',
    BOOK_APPOINTMENT: '/api/appointment',
    FETCH_APPOINTMENTS: '/api/appointment',
    FETCH_SERVICES: '/api/patient/fetch-services',
    FETCH_INSURANCE: '/api/insurance',
    PRESCRIBE: '/api/patient/prescribe',
    ASSIGN_DOCTOR: '/api/patient/assign-doctor',
    CONSULT_PATIENT: '/api/patient/consult-patient',
    REFER_PATIENT: '/api/patient/refer-patient',


    /***************** DOCTOR APIS **********************/
    CREATE_DOCTOR: '/api/doctor/create-doctor',
    FETCH_DOCTOR: '/api/doctor/fetch-doctor',


    /***************** INVENTORY APIS **********************/
    ADD_INVENTORY: '/api/inventory/add-inventory',
    FETCH_SUPPLIERS: '/api/inventory/fetch-suppliers',
    FETCH_ITEMS: '/api/inventory/fetch-items',

}

export const API_METHODS = {
    GET:'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    PUT: 'PUT',
    DELETE: 'DELETE'
}
