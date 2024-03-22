import axios from "axios";
import { APP_API_URL } from "@/assets/api-endpoints";


export const fetchInsurance = () =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.FETCH_INSURANCE}`)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}
