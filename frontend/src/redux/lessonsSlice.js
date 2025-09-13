// redux/lessonsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const lessonsSlice = createSlice({
  name: "lessons",
  initialState: {
    currentLesson: null,
    lessonsByCategory: {}, // { [slug]: [lessonObjects] }
    lessonsBySubCategory: [],
    lessonsLoading: false,
    error: null,
    completionStatus: null, // { lessonsCompleted, totalLessons, percentage }
  },
  reducers: {
    setLessonsBySubCategory: (state, action) =>{
      state.lessonsBySubCategory = action.payload;
    },
    setLessonsLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const {
  setLessonsBySubCategory,
  setLessonsLoading,
} = lessonsSlice.actions;

export default lessonsSlice.reducer;
