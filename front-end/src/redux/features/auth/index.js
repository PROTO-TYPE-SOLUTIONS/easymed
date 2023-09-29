import { createSlice } from "@reduxjs/toolkit";
import { fetchUserPermissions } from "../../services/auth";


const initialState = {
  userPermissions: [],
};

const PermissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setUserPermissions: (state, action) => {
      state.userPermissions = action.payload;
    },
  },
});

export const { setUserPermissions } = PermissionSlice.actions;


export const getAllUserPermissions = (userId) => async (dispatch) => {
  try {
    const response = await fetchUserPermissions(userId);
    dispatch(setUserPermissions(response));
  } catch (error) {
    console.log("USER_PERMISSIONS_ERROR ", error);
  }
};

export default PermissionSlice.reducer;
