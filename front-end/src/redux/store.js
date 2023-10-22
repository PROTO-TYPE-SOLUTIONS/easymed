import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth'
import patientReducer from './features/patients'
import inventoryReducer from './features/inventory'
import insuranceReducer from './features/insurance'
import appointmentReducer from './features/appointment'


export const store = configureStore({
    reducer:{
        auth: authReducer,
        patient: patientReducer,
        inventory: inventoryReducer,
        insurance: insuranceReducer,
        appointment: appointmentReducer,
    }
})