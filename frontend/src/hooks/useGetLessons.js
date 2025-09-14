// hooks/useGetLessons.js
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setLessonsBySubCategory, setLessonsLoading } from "@/redux/lessonsSlice";
import axios from "axios";

export const useGetLessons = (lessonId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchLessonsBySubCategory = async () => {
      try {
        dispatch(setLessonsLoading(true));
        const res = await axios.get(
          `http://localhost:5000/api/lessons/subcategories/${lessonId}`,
          { withCredentials: true }
        );
        dispatch(setLessonsBySubCategory(res.data.lessons));
      } catch (error) {
        console.log("Error fetching lessons:", error);
      } finally {
        dispatch(setLessonsLoading(false));
      }
    };
  
    if (lessonId) {
      fetchLessonsBySubCategory();
    }
  }, [lessonId, dispatch]);
};

export default useGetLessons;
