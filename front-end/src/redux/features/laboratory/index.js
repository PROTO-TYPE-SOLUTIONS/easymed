import { createSlice } from "@reduxjs/toolkit";
import { fetchLabRequests, fetchLabResults,fetchLabEquipment, fetchLabTestProfile, fetchLabTestPanels, fetchPublicLabRequests } from "@/redux/service/laboratory";


const initialState = {
  labResults: [],
  labResultItems: [],
  labTestPanels: [],
  labRequests: [],
  publicLabRequests: [],
  labEquipments: [],
  labTestProfiles: [],
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
    setPublicLabRequests: (state, action) => {
      state.publicLabRequests = action.payload;
    },
    setLabEquipments: (state, action) => {
      state.labEquipments = action.payload;
    },
    setLabTestProfile: (state, action) => {
      state.labTestProfiles = action.payload;
    },
    setLabTestPanels: (state, action) => {
      state.labTestPanels = action.payload;
    },
    clearLabResultItems: (state, action)=>{
      state.labResultItems = [];
    },
    setLabResultItemsAfterRemovingItem: (state, action) => {
      const labResultItem = state.labResultItems.filter(item => item.test_panel != action.payload.test_panel );
      state.labResultItems = labResultItem;
    },
    setLabResultItems: (state, action) => {

      const labResultItem = state.labResultItems.find(item => item.test_panel === action.payload.test_panel );
      console.log("REDUX_RESULT_ITEM", labResultItem)
      if (labResultItem) {
        // If labResultItem is found, update the existing item in the array
        state.labResultItems = state.labResultItems.map(item =>
          item.test_panel === action.payload.test_panel ? { ...item, result:action.payload.result, result_report:action.payload.result_report, ref_value:action.payload.ref_value } : item
        );
      } else {
        // If labResultItem is not found, add the new item to the array
        state.labResultItems = [...state.labResultItems, action.payload];
      }
    },
  },
});

export const { setLabResults,setLabRequests,setPublicLabRequests,setLabEquipments,setLabTestProfile, setLabResultItems, setLabResultItemsAfterRemovingItem, clearLabResultItems, setLabTestPanels } = LaboratorySlice.actions;


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

export const getAllPublicLabRequests = (auth) => async (dispatch) => {
  try {
    const response = await fetchPublicLabRequests(auth);
    dispatch(setPublicLabRequests(response));
  } catch (error) {
    console.log("PUBLIC_LAB_REQ_ERROR ", error);
  }
};

export const getAllLabTestProfiles = (auth) => async (dispatch) => {
  try {
    const response = await fetchLabTestProfile(auth);
    dispatch(setLabTestProfile(response));
  } catch (error) {
    console.log("LAB_ERROR ", error);
  }
};

export const getAllLabTestPanels = (auth) => async (dispatch) => {
  try {
    const response = await fetchLabTestPanels(auth);
    dispatch(setLabTestPanels(response));
  } catch (error) {
    console.log("LAB_TSEST_PANELS_ERROR ", error);
  }
};

export const addItemToLabResultsItems = (payload) => (dispatch) => {
  dispatch(setLabResultItems(payload));
};

export const removeItemToLabResultsItems = (payload) => (dispatch) => {
  dispatch(setLabResultItemsAfterRemovingItem(payload));
};

export const clearItemsToLabResultsItems = () => (dispatch) => {
  dispatch(clearLabResultItems());
};


export default LaboratorySlice.reducer;
