import { createSlice } from "@reduxjs/toolkit";
import { fetchDoctors } from "@/redux/service/doctor";


const initialState = {
  doctors: [],
};

const DoctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    setDoctors: (state, action) => {
      state.doctors = action.payload;
    },
  },
});

export const { setDoctors } = DoctorSlice.actions;


export const getAllDoctors = (auth) => async (dispatch) => {
  try {
    const response = await fetchDoctors(auth);
    dispatch(setDoctors(response));
  } catch (error) {
    console.log("DOCTORS_ERROR ", error);
  }
};


export default DoctorSlice.reducer;
