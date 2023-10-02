//------------------------ Backend APIs ----------------------//
export const API_URL = {


    /***************** AUTHENTICATION APIS **********************/
    LOGIN: '/api/login/',
    REFRESH_TOKEN: '/api/token/refresh/',
    GET_USER_PERMISSIONS: '/api/permissions',
}


//------------------------ Application APIs ----------------------//
export const APP_API_URL = {

    /***************** AUTH **********************/
    LOGIN: '/api/auth',
    REFRESH_TOKEN: '/api/auth/refresh',
    GET_USER_PERMISSIONS: '/api/auth/user-permissions',
   

}

export const API_METHODS = {
    GET:'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    PUT: 'PUT',
    DELETE: 'DELETE'
}
