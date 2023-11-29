import { createSlice } from "@reduxjs/toolkit";
import { fetchServices,fetchPatient, fetchPatientProfile, fetchPatientTriage } from "@/redux/service/patients";


const initialState = {
  services: [],
  patients: [],
  profileDetails: {},
  patientTriage: {},
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
    setProfile: (state, action) => {
      state.profileDetails = action.payload;
    },
    setPatientTriage: (state, action) => {
      state.patientTriage = action.payload;
    },
  },
});

export const { setServices,setPatients,setProfile,setPatientTriage } = PatientSlice.actions;


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

export const getPatientProfile = (userId) => async (dispatch) => {
  try {
    const response = await fetchPatientProfile(userId);
    dispatch(setProfile(response));
  } catch (error) {
    console.log("PROFILE_ERROR ", error);
  }
};

export const getPatientTriage = (id) => async (dispatch) => {
  try {
    const response = await fetchPatientTriage(id);
    dispatch(setPatientTriage(response));
  } catch (error) {
    console.log("PROFILE_ERROR ", error);
  }
};

export default PatientSlice.reducer;
