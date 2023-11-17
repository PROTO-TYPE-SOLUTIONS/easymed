import { createSlice } from "@reduxjs/toolkit";
import { fetchLabRequests, fetchLabResults } from "@/redux/service/laboratory";


const initialState = {
  labResults: [],
  labRequests: [],
};

const LaboratorySlice = createSlice({
  name: "laboratory",
  initialState,
  reducers: {
    setLabResults: (state, action) => {
      state.labResults = action.payload;
    },
    setLabRequests: (state, action) => {
      state.labResults = action.payload;
    },
  },
});

export const { setLabResults,setLabRequests } = LaboratorySlice.actions;


export const getAllLabResults = (auth) => async (dispatch) => {
  try {
    const response = await fetchLabResults(auth);
    dispatch(setLabResults(response));
  } catch (error) {
    console.log("LAB_ERROR ", error);
  }
};

export const getAllLabRequests = (auth) => async (dispatch) => {
  try {
    const response = await fetchLabRequests(auth);
    dispatch(setLabRequests(response));
  } catch (error) {
    console.log("LAB_ERROR ", error);
  }
};


export default LaboratorySlice.reducer;
