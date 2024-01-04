import { createSlice } from "@reduxjs/toolkit";
import {
  fetchServices,
  fetchPatient,
  fetchPatientProfile,
  fetchPatientTriage,
  searchPatients,
} from "@/redux/service/patients";
import {
  fetchPatientBillingAppointments,
  fetchPatientBillingLabRequest,
  fetchPatientBillingPrescribedDrug,
} from "@/redux/service/billing";

const initialState = {
  patientAppointment: {},
  patientLabRequest: {},
  patientPrescribedDrug: {},
  selectedAppointments: [],
  selectedLabRequests: [],
  selectedPrescribedDrugs: [],
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
    setSelectedPrescribedDrug: (state, action) => {
      state.selectedPrescribedDrugs = action.payload;
    },
    setSelectedAppointment: (state, action) => {
      state.selectedAppointments = action.payload;
    },
    setSelectedLabRequest: (state, action) => {
      state.selectedLabRequests = action.payload;
    },
  },
});

export const {
  setPatientAppointment,
  setPatientLabRequest,
  setPatientPrescrribedDrug,
  setSelectedAppointment,
  setSelectedLabRequest,
  setSelectedPrescribedDrug
} = BillingSlice.actions;

export const getAllPatientBillingAppointments =
  (patient__id) => async (dispatch) => {
    try {
      const response = await fetchPatientBillingAppointments(patient__id);
      dispatch(setPatientAppointment(response));
    } catch (error) {
      console.log("BILLING_ERROR ", error);
    }
  };

export const getAllPatientBillingLabRequest =
  (patient_id) => async (dispatch) => {
    try {
      const response = await fetchPatientBillingLabRequest(patient_id);
      dispatch(setPatientLabRequest(response));
    } catch (error) {
      console.log("BILLING_ERROR ", error);
    }
  };

export const getAllPatientBillingPrescribedDrug =
  (patient_id) => async (dispatch) => {
    try {
      const response = await fetchPatientBillingPrescribedDrug(patient_id);
      dispatch(setPatientPrescrribedDrug(response));
    } catch (error) {
      console.log("BILLING_ERROR ", error);
    }
  };

export default BillingSlice.reducer;
