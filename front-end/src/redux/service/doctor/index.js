import axios from "axios";
import { APP_API_URL } from "@/assets/api-endpoints";


export const createDoctor = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.CREATE_DOCTOR}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}