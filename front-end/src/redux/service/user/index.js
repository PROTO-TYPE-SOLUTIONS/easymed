import { APP_API_URL } from "@/assets/api-endpoints";
import UseAxios from "@/assets/hooks/use-axios";

export const getUserName = (user_id, auth) =>{

    const axiosInstance = UseAxios(auth);
    return new Promise((resolve,reject) =>{
        axiosInstance.get(`${APP_API_URL.GET_USER_NAME}`,{
            params:{
                uid: user_id,
            },
        })
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const getAllUsers = (auth) =>{

    const axiosInstance = UseAxios(auth);
    return new Promise((resolve,reject) =>{
        axiosInstance.get(`${APP_API_URL.FETCH_ALL_USERS}`)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const getUserById = (auth) =>{
    const axiosInstance = UseAxios(auth);
    return new Promise((resolve,reject) =>{
        axiosInstance.get(`${APP_API_URL.FETCH_USER_BY_ID}`, {            
            params:{
                user_id:auth.user_id
            },
        })
        .then((res) =>{
            resolve(res.data)
        })
        .catch((err) =>{
            reject(err.message)
        })
    })
}

export const updateUser = (payload, auth) =>{
    const axiosInstance = UseAxios(auth);
    console.log("HELLO CALLED UPDATE USER")
    return new Promise((resolve,reject) =>{
        axiosInstance.put(`${APP_API_URL.FETCH_USER_BY_ID}`,{
            body:payload,
        })
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                console.log("USER_STATUS_UPDATE_ERROR ",err)
                reject(err.message)
            })
    })
}

export const deleteUser = (payload, auth) =>{
    const axiosInstance = UseAxios(auth);
    return new Promise((resolve,reject) =>{
        axiosInstance.delete(`${APP_API_URL.FETCH_USER_BY_ID}`,{
            params:{
                user_id: payload.id,
            },
        })
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                console.log("USER_DELETE_ERROR ",err)
                reject(err.message)
            })
    })
}