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


export const searchPatients = (first_name) =>{
    return new Promise((resolve,reject) =>{
        console.log("PATIENT_URL ",`${APP_API_URL.SEARCH_PATIENT}`)
        axios.get(`${APP_API_URL.SEARCH_PATIENT}`,{
            params:{
                first_name:first_name,
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

export const fetchPatientProfile = (userId) =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.GET_PATIENT_PROFILE}`,{
            params:{
                userId: userId
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
        axios.put(`${APP_API_URL.EDIT_PATIENT}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                console.log("EDIT_ERROR ",err)
                reject(err.message)
            })
    })
}

export const deletePatient = (id) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.DELETE_PATIENT}`,{id})
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                console.log("DELETE_ERROR ",err)
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

export const assignDoctor = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.ASSIGN_DOCTOR}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}


export const consultPatient = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.CONSULT_PATIENT}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const referPatient = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.REFER_PATIENT}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const prescribeDrug = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.PRESCRIBE_DRUG}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const createPrescription = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.CREATE_PRESCRIPTION}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const fetchPatientTriage = (id) =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.GET_PATIENT_TRIAGE}`,{
            params:{
                id: id
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

export const fetchPatientPrescribeDrugs = (patient_id) =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.PRESCRIBE_DRUG_BY_PATIENT_ID}`,{
            params:{
                patient_id: patient_id
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

