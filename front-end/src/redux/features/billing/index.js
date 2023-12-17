import { createSlice } from "@reduxjs/toolkit";
import { fetchServices,fetchPatient, fetchPatientProfile, fetchPatientTriage, searchPatients } from "@/redux/service/patients";
import { fetchPatientBillingAppointments, fetchPatientBillingLabRequest, fetchPatientBillingPrescribedDrug } from "@/redux/service/billing";


const initialState = {
  patientAppointment: {},
  patientLabRequest: {},
  patientPrescribedDrug: {},
};

const BillingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    setPatientAppointment: (state, action) => {
      state.patientAppointment = action.payload;
    },
    setPatientLabRequest: (state, action) => {
      state.patientLabRequest = action.payload;
    },
    setPatientPrescrribedDrug: (state, action) => {
      state.patientPrescribedDrug = action.payload;
    },
  },
});

export const { setPatientAppointment,setPatientLabRequest,setPatientPrescrribedDrug } = BillingSlice.actions;

export const getAllPatientBillingAppointments = (id) => async (dispatch) => {
  try {
    const response = await fetchPatientBillingAppointments(id);
    dispatch(setPatientAppointment(response));
  } catch (error) {
    console.log("BILLING_ERROR ", error);
  }
};

export const getAllPatientBillingLabRequest = (auth,id) => async (dispatch) => {
  try {
    const response = await fetchPatientBillingLabRequest(auth,id);
    dispatch(setPatientLabRequest(response));
  } catch (error) {
    console.log("BILLING_ERROR ", error);
  }
};

export const getAllPatientBillingPrescribedDrug = (auth,id) => async (dispatch) => {
  try {
    const response = await fetchPatientBillingPrescribedDrug(auth,id);
    dispatch(setPatientPrescrribedDrug(response));
  } catch (error) {
    console.log("BILLING_ERROR ", error);
  }
};

export default BillingSlice.reducer;
