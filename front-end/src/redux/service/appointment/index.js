import axios from "axios";
import { APP_API_URL } from "@/assets/api-endpoints";


export const bookAppointment = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.BOOK_APPOINTMENT}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const fetchAppointment = () =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.FETCH_APPOINTMENTS}`)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}


export const fetchDoctorAppointments = (userId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${APP_API_URL.FETCH_DOCTOR_APPOINTMENTS}`,{
        params:{
            userId: userId,
        }
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.message);
        });
    });
  };
  

export const fetchPatientAppointments = () =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.FETCH_PATIENT_APPOINTMENTS}`)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}