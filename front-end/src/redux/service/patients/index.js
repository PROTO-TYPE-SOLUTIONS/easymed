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

export const fetchPatient = () =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.FETCH_PATIENT}`)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const createPatient = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.CREATE_PATIENT}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const editPatient = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.EDIT_PATIENT_PATIENT}/${payload.id}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                console.log("EDIT_ERROR ",err)
                reject(err.message)
            })
    })
}

export const prescribePatient = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.PRESCRIBE}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}