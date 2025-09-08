// redux/progressSlice.js
import { createSlice } from "@reduxjs/toolkit";

const progressSlice = createSlice({
  name: "progress",
  initialState: {
    userProgress: {}, // keyed by categoryId
    loading: false,
    error: null,
  },
  reducers: {
    fetchProgressStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProgressSuccess: (state, action) => {
      state.loading = false;
      state.userProgress = action.payload; // { categoryId: { lessonsCompleted, quizzesCompleted, achievements } }
    },
    fetchProgressFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetProgress: (state) => {
      state.userProgress = {};
    },
  },
});

export const {
  fetchProgressStart,
  fetchProgressSuccess,
  fetchProgressFailure,
  resetProgress,
} = progressSlice.actions;

export default progressSlice.reducer;
