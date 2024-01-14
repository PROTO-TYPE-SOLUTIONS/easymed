import { createSlice } from "@reduxjs/toolkit";
import { getAllUsers } from "@/redux/service/user";


const initialState = {
  users: [],
};

const UserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = UserSlice.actions;


export const getAllTheUsers = (auth) => async (dispatch) => {
  try {
    const response = await getAllUsers(auth);
    dispatch(setUsers(response));
  } catch (error) {
    console.log("ALL_USERS_ERROR ", error);
  }
};

export default UserSlice.reducer;