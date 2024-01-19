import { createSlice } from "@reduxjs/toolkit";
import { fetchServices,fetchPatient, fetchPatientProfile, fetchPatientTriage, searchPatients } from "@/redux/service/patients";


const initialState = {
  services: [],
  patients: [],
  prescriptionItems: [],
  searchedPatients: [],
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
    setSearchedPatients: (state, action) => {
      state.searchedPatients = action.payload;
    },
    setProfile: (state, action) => {
      state.profileDetails = action.payload;
    },
    setPatientTriage: (state, action) => {
      state.patientTriage = action.payload;
    },
    setPatientPrescriptionItem: (state, action) => {
      const prescriptionItem = state.prescriptionItems.find(item => item.item === action.payload.item );
      if (prescriptionItem) {
        // If prescriptionItem is found, update the existing item in the array
        state.prescriptionItems = state.prescriptionItems.map(item =>
          item.item === action.payload.item ? { ...item, dosage:action.payload.dosage, frequency:action.payload.frequency, duration:action.payload.duration, note:action.payload.note } : item
        );
      } else {
        // If prescriptionItem is not found, add the new item to the array
        state.prescriptionItems = [...state.prescriptionItems, action.payload];
      }
    },
    removePrescriptionItem: (state, action) => {
      const prescriptionItem = state.prescriptionItems.filter(item => item.item != action.payload.item );
      state.prescriptionItems = prescriptionItem;
    },
    clearPrescriptionItems: (state, action)=>{
      state.prescriptionItems = [];
    },
  },
});

export const { setServices,setPatients,setProfile,setPatientTriage,setSearchedPatients, removePrescriptionItem, setPatientPrescriptionItem, clearPrescriptionItems } = PatientSlice.actions;


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

export const getAllSearchedPatients = (first_name) => async (dispatch) => {
  try {
    const response = await searchPatients(first_name);
    dispatch(setSearchedPatients(response));
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

export const addPrescriptionItem = (payload) => (dispatch) => {
  dispatch(setPatientPrescriptionItem(payload));
};

export const removeAPrescriptionItem = (payload) => (dispatch) => {
  dispatch(removePrescriptionItem(payload));
};

export const clearAllPrescriptionItems = () => (dispatch) => {
  dispatch(clearPrescriptionItems());
};

export default PatientSlice.reducer;
