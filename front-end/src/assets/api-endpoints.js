//------------------------ Backend APIs ----------------------//
export const API_URL = {


    /***************** AUTHENTICATION APIS **********************/
    REGISTER_USER: '/api/v1/users/regigister/',
    LOGIN: '/api/login/',
    REFRESH_TOKEN: '/api/token/refresh/',
    GET_USER_PERMISSIONS: '/api/permissions',


    /***************** PATIENT APIS **********************/
    BOOK_APPOINTMENT: '/patients/publicappointments/',
    FETCH_SERVICES: '/patients/services/',

    /***************** INVENTORY APIS **********************/
    ADD_INVENTORY: '/api/v1/inventory/inventories/',

}


//------------------------ Application APIs ----------------------//
export const APP_API_URL = {

    /***************** AUTH **********************/
    REGISTER_USER: '/api/register',
    LOGIN: '/api/auth',
    REFRESH_TOKEN: '/api/auth/refresh',
    GET_USER_PERMISSIONS: '/api/auth/user-permissions',
   

    /***************** PATIENT APIS **********************/
    BOOK_APPOINTMENT: '/api/appointment',
    FETCH_SERVICES: '/api/patient/fetch-services',


    /***************** INVENTORY APIS **********************/
    ADD_INVENTORY: '/api/inventory/add-inventory',

}

export const API_METHODS = {
    GET:'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    PUT: 'PUT',
    DELETE: 'DELETE'
}
