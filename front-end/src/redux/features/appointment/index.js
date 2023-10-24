import { createSlice } from "@reduxjs/toolkit";
import { fetchAppointment } from "@/redux/service/appointment";


const initialState = {
  appointments: [],
};

const AppointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
  },
});

export const { setAppointments } = AppointmentSlice.actions;


export const getAllAppointments = () => async (dispatch) => {
  try {
    const response = await fetchAppointment();
    dispatch(setAppointments(response));
  } catch (error) {
    console.log("APPOINTMENTS_ERROR ", error);
  }
};

export default AppointmentSlice.reducer;
