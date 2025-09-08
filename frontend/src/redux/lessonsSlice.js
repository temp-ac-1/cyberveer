// redux/lessonsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const lessonsSlice = createSlice({
  name: "lessons",
  initialState: {
    currentLesson: null,
    loading: false,
    error: null,
    completionStatus: null, // { lessonsCompleted, totalLessons, percentage }
  },
  reducers: {
    fetchLessonStart: (state) => {
      state.loading = true;
      state.error = null;
      state.currentLesson = null;
    },
    fetchLessonSuccess: (state, action) => {
      state.loading = false;
      state.currentLesson = action.payload;
    },
    fetchLessonFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    completeLessonStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    completeLessonSuccess: (state, action) => {
      state.loading = false;
      state.completionStatus = action.payload;
    },
    completeLessonFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchLessonStart,
  fetchLessonSuccess,
  fetchLessonFailure,
  completeLessonStart,
  completeLessonSuccess,
  completeLessonFailure,
} = lessonsSlice.actions;

export default lessonsSlice.reducer;
