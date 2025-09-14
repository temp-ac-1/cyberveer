import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    featured: [],
    all: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setFeaturedBlogs: (state, action) => {
      state.featured = action.payload;
    },
    setAllBlogs: (state, action) => {
      state.all = action.payload.blogs;
      state.total = action.payload.total;
    },
    setBlogsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBlogsError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFeaturedBlogs,
  setAllBlogs,
  setBlogsLoading,
  setBlogsError,
} = blogSlice.actions;

export default blogSlice.reducer;
