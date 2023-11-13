import axios from "axios";
import { APP_API_URL } from "@/assets/api-endpoints";
import UseAxios from "@/assets/hooks/use-axios";



export const registerUser = (payload,auth) =>{
    const axiosInstance = UseAxios(auth);
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

export const fetchUserPermissions = (userId,auth) =>{
    const axiosInstance = UseAxios()
    return new Promise((resolve,reject) =>{
        axiosInstance.get(`${APP_API_URL.GET_USER_PERMISSIONS}`,auth,{
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