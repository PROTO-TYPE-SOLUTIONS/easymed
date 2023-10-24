import { createSlice } from "@reduxjs/toolkit";
import { fetchServices,fetchPatient } from "@/redux/service/patients";


const initialState = {
  services: [],
  patients: [],
};

const PatientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    setServices: (state, action) => {
      state.services = action.payload;
    },
    setPatients: (state, action) => {
      state.patients = action.payload;
    },
  },
});

export const { setServices,setPatients } = PatientSlice.actions;


export const getAllServices = () => async (dispatch) => {
  try {
    const response = await fetchServices();
    dispatch(setServices(response));
  } catch (error) {
    console.log("SERVICES_ERROR ", error);
  }
};

export const getAllPatients = () => async (dispatch) => {
  try {
    const response = await fetchPatient();
    dispatch(setPatients(response));
  } catch (error) {
    console.log("PATIENTS_ERROR ", error);
  }
};

export default PatientSlice.reducer;
