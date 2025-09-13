// frontend/src/redux/subcategoriesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const subcategoriesSlice = createSlice({
  name: "subcategory",
  initialState: {
    subcategories: [], // store by categoryId for easier lookup
    loading: false,
  },
  reducers: {
    setSubcategories: (state, action) => {
      state.subcategories = action.payload;
    },
    setSubcategoriesLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setSubcategories, setSubcategoriesLoading } = subcategoriesSlice.actions;
export default subcategoriesSlice.reducer;
