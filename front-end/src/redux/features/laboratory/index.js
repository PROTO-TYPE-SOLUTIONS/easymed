import { createSlice } from "@reduxjs/toolkit";
import { fetchLabResults } from "@/redux/service/laboratory";


const initialState = {
  labResults: [],
};

const LaboratorySlice = createSlice({
  name: "laboratory",
  initialState,
  reducers: {
    setLabResults: (state, action) => {
      state.labResults = action.payload;
    },
  },
});

export const { setLabResults } = LaboratorySlice.actions;


export const getAllLabResults = (auth) => async (dispatch) => {
  try {
    const response = await fetchLabResults(auth);
    dispatch(setLabResults(response));
  } catch (error) {
    console.log("LAB_ERROR ", error);
  }
};


export default LaboratorySlice.reducer;
