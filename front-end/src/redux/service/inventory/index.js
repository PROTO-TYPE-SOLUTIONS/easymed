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

export const fetchItems = () =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.FETCH_ITEMS}`)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const fetchSuppliers = () =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.FETCH_SUPPLIERS}`)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}