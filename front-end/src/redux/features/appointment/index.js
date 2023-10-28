import { createSlice } from "@reduxjs/toolkit";
import { fetchAppointment, fetchPatientAppointments } from "@/redux/service/appointment";


const initialState = {
  appointments: [],
  patientAppointments:[]
};

const AppointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
    setPatientAppointments: (state, action) => {
      state.patientAppointments = action.payload;
    },
  },
});

export const { setAppointments,setPatientAppointments } = AppointmentSlice.actions;


export const getAllAppointments = () => async (dispatch) => {
  try {
    const response = await fetchAppointment();
    dispatch(setAppointments(response));
  } catch (error) {
    console.log("APPOINTMENTS_ERROR ", error);
  }
};

export const getAllPatientAppointments = () => async (dispatch) => {
  try {
    const response = await fetchPatientAppointments();
    dispatch(setPatientAppointments(response));
  } catch (error) {
    console.log("APPOINTMENTS_ERROR ", error);
  }
};

export default AppointmentSlice.reducer;
