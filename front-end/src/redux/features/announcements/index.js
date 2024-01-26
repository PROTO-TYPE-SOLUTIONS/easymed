import { createSlice } from "@reduxjs/toolkit";
import { fetchAnnouncements, fetchAnnouncementChannels } from "@/redux/service/announcements";


const initialState = {
  announcements: [],
  channels: [],
};

const AnnouncementSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    setAnnouncements: (state, action) => {
      state.announcements = action.payload;
    },
    setAnnouncementsChannels: (state, action) => {
        state.channels = action.payload;
    },
  },
});

export const { setAnnouncements, setAnnouncementsChannels } = AnnouncementSlice.actions;


export const getAllAnnouncements = (auth) => async (dispatch) => {
  try {
    const response = await fetchAnnouncements(auth);
    dispatch(setAnnouncements(response));
  } catch (error) {
    console.log("Announcements_ERROR ", error);
  }
};

export const getAllAnnouncementsChannels = (auth) => async (dispatch) => {
    try {
      const response = await fetchAnnouncementChannels(auth);
      dispatch(setAnnouncementsChannels(response));
    } catch (error) {
      console.log("Announcements_Channels_ERROR ", error);
    }
};


export default AnnouncementSlice.reducer;
