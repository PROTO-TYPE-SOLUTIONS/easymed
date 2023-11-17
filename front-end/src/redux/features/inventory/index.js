import { createSlice } from "@reduxjs/toolkit";
import { fetchItems, fetchSuppliers } from "@/redux/service/inventory";


const initialState = {
  items: [],
  suppliers: [],
};

const InventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setSuppliers: (state, action) => {
      state.suppliers = action.payload;
    },
  },
});

export const { setItems,setSuppliers } = InventorySlice.actions;


export const getAllItems = (name) => async (dispatch) => {
  try {
    const response = await fetchItems(name);
    dispatch(setItems(response));
  } catch (error) {
    console.log("ITEMS_ERROR ", error);
  }
};

export const getAllSuppliers = () => async (dispatch) => {
  try {
    const response = await fetchSuppliers();
    dispatch(setSuppliers(response));
  } catch (error) {
    console.log("SUPPLIERS_ERROR ", error);
  }
};

export default InventorySlice.reducer;
