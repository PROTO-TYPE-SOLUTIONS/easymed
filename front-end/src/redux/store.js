import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth'
import patientReducer from './features/patients'



export const store = configureStore({
    reducer:{
        auth: authReducer,
        patient: patientReducer,
    }
})