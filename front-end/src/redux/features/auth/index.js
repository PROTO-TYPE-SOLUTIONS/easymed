import { createSlice } from "@reduxjs/toolkit";
import { fetchGroups, fetchUserPermissions } from "@/redux/service/auth";


const initialState = {
  userPermissions: [],
  groups: [],
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
  },
});

export const { setUserPermissions,setGroups } = PermissionSlice.actions;


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

export default PermissionSlice.reducer;
