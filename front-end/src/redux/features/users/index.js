import { createSlice } from "@reduxjs/toolkit";
import { getAllUsers, getUserById } from "@/redux/service/user";


const initialState = {
  users: [],
  userProfile: {}
};

const UserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});

export const { setUsers, setUserProfile } = UserSlice.actions;


export const getAllTheUsers = (auth) => async (dispatch) => {
  try {
    const response = await getAllUsers(auth);
    dispatch(setUsers(response));
  } catch (error) {
    console.log("ALL_USERS_ERROR ", error);
  }
};

export const getCurrentUser = (auth) => async (dispatch) => {
  try {
    const response = await getUserById(auth);
    dispatch(setUserProfile(response));
  } catch (error) {
    console.log("ALL_USERS_ERROR ", error);
  }
};

export default UserSlice.reducer;