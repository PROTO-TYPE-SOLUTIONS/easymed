import axios from "axios";
import { APP_API_URL } from "@/assets/api-endpoints";

export const saleByDateRange = (payload) => {
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.SALE_BY_DATE_RANGE_GENERATE_REPORTS}`, payload)
        .then((res) =>{
            resolve(res.data)
        })
        .catch((err) =>{
            reject(err.message)
        })
    })
}

export const saleByDateRangeAndItem = (payload) =>{

    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.SALE_BY_DATE_RANGE_AND_ITEM_ID_GENERATE_REPORTS}`, payload)
        .then((res) =>{
            resolve(res.data)
        })
        .catch((err) =>{
            reject(err.message)
        })
    })
}

export const dayTransaction = (payload) =>{

    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.TOTALS_OF_THE_DAY}`, {
            params: {
                payment_method: payload.payment_method,
                date: payload.date
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