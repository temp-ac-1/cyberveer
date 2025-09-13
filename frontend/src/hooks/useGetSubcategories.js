// frontend/src/hooks/useGetSubcategories.js
import { setSubcategories, setSubcategoriesLoading } from "@/redux/subcategoriesSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetSubcategories = (categorySlug) => {
  const dispatch = useDispatch();
  const { subcategories, loading } = useSelector((store) => store.subcategory);
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        dispatch(setSubcategoriesLoading(true));
        const res = await axios.get(
          `http://localhost:5000/api/subcategories/category/${categorySlug}`,
          { withCredentials: true }
        );
        dispatch(setSubcategories(res.data.subcategories));
      } catch (error) {
        console.log("Error fetching subcategories:", error);
      } finally {
        dispatch(setSubcategoriesLoading(false));
      }
    };
  
    if (categorySlug && !subcategories[categorySlug]) {
      fetchSubcategories();
    }
  }, [categorySlug, dispatch]);  // ✅ removed subcategories

  // return { subcategories: subcategories[categorySlug] || null, loading };
};

export default useGetSubcategories;
