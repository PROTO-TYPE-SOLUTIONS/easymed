import { createSlice } from "@reduxjs/toolkit";
import { fetchGroups, fetchPatientGroup, fetchUserPermissions } from "@/redux/service/auth";


const initialState = {
  userPermissions: [],
  groups: [],
  groups: [],
patientGroups: [],
};

const PermissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setUserPermissions: (state, action) => {
      state.userPermissions = action.payload;
    },
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    setPatientGroups: (state, action) => {
      state.patientGroups = action.payload;
    },
  },
});

export const { setUserPermissions,setGroups,setPatientGroups } = PermissionSlice.actions;


export const getAllUserPermissions = (auth) => async (dispatch) => {
  try {
    const response = await fetchUserPermissions(auth);
    dispatch(setUserPermissions(response));
  } catch (error) {
    console.log("USER_PERMISSIONS_ERROR ", error);
  }
};

export const getAllGroups = (auth) => async (dispatch) => {
  try {
    const response = await fetchGroups(auth);
    dispatch(setGroups(response));
  } catch (error) {
    console.log("USER_PERMISSIONS_ERROR ", error);
  }
};

export const getAllPatientGroups = (name) => async (dispatch) => {
  try {
    const response = await fetchPatientGroup(name);
    dispatch(setPatientGroups(response));
  } catch (error) {
    console.log("USER_PERMISSIONS_ERROR ", error);
  }
};

export default PermissionSlice.reducer;
