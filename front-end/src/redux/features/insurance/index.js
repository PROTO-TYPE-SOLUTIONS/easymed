import { createSlice } from "@reduxjs/toolkit";
import { fetchInsurance } from "@/redux/service/insurance";


const initialState = {
  insurance: [],
};

const InsuranceSlice = createSlice({
  name: "insurance",
  initialState,
  reducers: {
    setInsurance: (state, action) => {
      state.insurance = action.payload;
    },
  },
});

export const { setInsurance } = InsuranceSlice.actions;


export const getAllInsurance = () => async (dispatch) => {
  try {
    const response = await fetchInsurance();
    dispatch(setInsurance(response));
  } catch (error) {
    console.log("INSURANCE_ERROR ", error);
  }
};

export default InsuranceSlice.reducer;
