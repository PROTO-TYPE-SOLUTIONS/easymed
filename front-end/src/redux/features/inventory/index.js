import { createSlice } from "@reduxjs/toolkit";
import { fetchItem, fetchItems, fetchOrderBills, fetchSuppliers } from "@/redux/service/inventory";


const initialState = {
  items: [],
  suppliers: [],
  orderBills: [],
  item: [],
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
    setOrderBills: (state, action) => {
      state.orderBills = action.payload;
    },
    setItem: (state, action) => {
      state.item = action.payload;
    },
  },
});

export const { setItems,setSuppliers,setOrderBills,setItem } = InventorySlice.actions;


export const getAllItems = (name) => async (dispatch) => {
  try {
    const response = await fetchItems(name);
    dispatch(setItems(response));
  } catch (error) {
    console.log("ITEMS_ERROR ", error);
  }
};

export const getItems = (name) => async (dispatch) => {
  try {
    const response = await fetchItem(name);
    dispatch(setItem(response));
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

export const getAllOrderBills = () => async (dispatch) => {
  try {
    const response = await fetchOrderBills();
    dispatch(setOrderBills(response));
  } catch (error) {
    console.log("SUPPLIERS_ERROR ", error);
  }
};

export default InventorySlice.reducer;
