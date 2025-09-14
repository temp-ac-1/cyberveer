// frontend/src/redux/subcategoriesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const subcategoriesSlice = createSlice({
  name: "subcategory",
  initialState: {
    subcategories: [],  // ✅ Keep flat array
    loading: false,
  },
  reducers: {
    setSubcategories: (state, action) => {
      // ✅ Replace entire array with fetched subcategories
      state.subcategories = action.payload;
    },
    setSubcategoriesLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setSubcategories, setSubcategoriesLoading } = subcategoriesSlice.actions;
export default subcategoriesSlice.reducer;
