import axios from "axios";
import { APP_API_URL } from "@/assets/api-endpoints";
import UseAxios from "@/assets/hooks/use-axios";


export const fetchPatientBillingAppointments = (patient__id) =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.FETCH_PATIENT_BILLING_APPOINTMENTS}`,{
            params:{
                patient__id: patient__id,
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

export const fetchPatientBillingLabRequest = (patient_id) =>{
    // const axiosInstance = UseAxios(auth);
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.FETCH_PATIENT_BILLING_LAB_REQUEST}`,{
            params:{
                patient_id: patient_id,
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

export const fetchPatientBillingPrescribedDrug = (patient_id) =>{
    // const axiosInstance = UseAxios(auth);
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.FETCH_PATIENT_BILLING_PRESCRIBED_DRUG}`,{
            params:{
                patient_id: patient_id,
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

export const billingInvoiceItems = (auth,payloads) =>{
    const axiosInstance = UseAxios(auth);
    const requestData = {
        auth,
        ...payloads,
      };
    return new Promise((resolve,reject) =>{
        axiosInstance.post(`${APP_API_URL.BILLING_INVOICE_ITEMS}`,requestData)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}