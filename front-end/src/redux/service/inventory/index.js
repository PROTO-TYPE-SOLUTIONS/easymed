import axios from "axios";
import { APP_API_URL } from "@/assets/api-endpoints";


export const addInventory = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.ADD_INVENTORY}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}