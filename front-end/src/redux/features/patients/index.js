import { createSlice } from "@reduxjs/toolkit";
import { fetchServices } from "@/redux/service/patients";


const initialState = {
  services: [],
};

const ServiceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setServices: (state, action) => {
      state.services = action.payload;
    },
  },
});

export const { setServices } = ServiceSlice.actions;


export const getAllServices = () => async (dispatch) => {
  try {
    const response = await fetchServices();
    dispatch(setServices(response));
  } catch (error) {
    console.log("SERVICES_ERROR ", error);
  }
};

export default ServiceSlice.reducer;
