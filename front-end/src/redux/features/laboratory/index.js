import { createSlice } from "@reduxjs/toolkit";
import { fetchLabRequests, fetchLabResults,fetchLabEquipment } from "@/redux/service/laboratory";


const initialState = {
  labResults: [],
  labRequests: [],
  labEquipments: [],
};

const LaboratorySlice = createSlice({
  name: "laboratory",
  initialState,
  reducers: {
    setLabResults: (state, action) => {
      state.labResults = action.payload;
    },
    setLabRequests: (state, action) => {
      state.labRequests = action.payload;
    },
    setLabEquipments: (state, action) => {
      state.labEquipments = action.payload;
    },
  },
});

export const { setLabResults,setLabRequests,setLabEquipments } = LaboratorySlice.actions;


export const getAllLabResults = (auth) => async (dispatch) => {
  try {
    const response = await fetchLabResults(auth);
    dispatch(setLabResults(response));
  } catch (error) {
    console.log("LAB_ERROR ", error);
  }
};

export const getAllLabEquipments = (auth) => async (dispatch) => {
  try {
    const response = await fetchLabEquipment(auth);
    dispatch(setLabEquipments(response));
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
