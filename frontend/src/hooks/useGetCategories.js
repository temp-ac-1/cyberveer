import { setCategories, setCategoriesLoading } from "@/redux/categoriesSlice";
import axios from "axios";
import {useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";


const useGetCategory = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((store) => store.category);
    useEffect(() => {
        const fetchCategoryData = async () => {
          try {
            dispatch(setCategoriesLoading(true));
            const res = await axios.get("http://localhost:5000/api/categories/", { withCredentials: true });
            dispatch(setCategories(res.data.categories));
          } catch (error) {
            console.log("Error fetching category data:", error);
          } finally {
            dispatch(setCategoriesLoading(false));
          }
        };
      
        if (!categories) {
            fetchCategoryData();
        }
      }, [categories, dispatch]);

};

export default useGetCategory;