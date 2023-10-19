//------------------------ Backend APIs ----------------------//
export const API_URL = {


    /***************** AUTHENTICATION APIS **********************/
    REGISTER_USER: '/users/register/',
    LOGIN: '/users/login/',
    REFRESH_TOKEN: '/api/token/refresh/',
    GET_USER_PERMISSIONS: '/api/permissions',


    /***************** PATIENT APIS **********************/
    CREATE_PATIENT: '/patients/patients/',
    BOOK_APPOINTMENT: '/patients/publicappointments/',
    FETCH_SERVICES: '/patients/services/',


    /***************** DOCTOR APIS **********************/
    CREATE_DOCTOR: '/accounts/register/',


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
    BOOK_APPOINTMENT: '/api/appointment',
    FETCH_SERVICES: '/api/patient/fetch-services',

    /***************** DOCTOR APIS **********************/
    CREATE_DOCTOR: '/api/doctor/create-doctor',


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
