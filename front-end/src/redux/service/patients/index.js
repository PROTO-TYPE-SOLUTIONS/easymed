import axios from "axios";
import { APP_API_URL } from "@/assets/api-endpoints";


export const fetchServices = () =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.FETCH_SERVICES}`)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}