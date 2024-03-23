import { createSlice } from "@reduxjs/toolkit";
import {
  fetchGroups,
  fetchPatientGroup,
  fetchUserPermissions,
  fetchAllThePermissions
} from "@/redux/service/auth";

const initialState = {
  userPermissions: [],
  allPermissions: [],
  groups: [],
  // groups: [],
  patientGroups: [],
};

const PermissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setUserPermissions: (state, action) => {
      state.userPermissions = action.payload;
    },
    setAllPermissions: (state, action) => {
      state.allPermissions = action.payload
    },
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    setPatientGroups: (state, action) => {
      state.patientGroups = action.payload;
    },
  },
});

export const { setUserPermissions, setGroups, setPatientGroups, setAllPermissions } =
  PermissionSlice.actions;

export const getAllUserPermissions = (user_id) => async (dispatch) => {
  try {
    const response = await fetchUserPermissions(user_id);
    dispatch(setUserPermissions(response));
  } catch (error) {
    console.log("USER_PERMISSIONS_ERROR ", error);
  }
};

export const getAllPermissions = (auth) => async (dispatch) => {
  try {
    const response = await fetchAllThePermissions(auth);
    dispatch(setAllPermissions(response));
  } catch (error) {
    console.log("ALL_PERMISSIONS_ERROR ", error);
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
