import axios from "axios";
import { APP_API_URL } from "@/assets/api-endpoints";


export const registerUser = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.REGISTER_USER}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const fetchUserPermissions = (userId) =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.GET_USER_PERMISSIONS}`,{
            params:{
                userId: userId,
            }
        })
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}