import { createSlice } from "@reduxjs/toolkit";

// Fix: Rename this to categoriesSlice
const categoriesSlice = createSlice({
  name: "category",  // Ensure this is the same as you referenced in rootReducer
  initialState: {
    categories: null,
    loading: false,
  },
  reducers: {
    // actions
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setCategoriesLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// Fix: Ensure you export the correct actions
export const { setCategories, setCategoriesLoading } = categoriesSlice.actions;
export default categoriesSlice.reducer;  // Make sure this is correct
