// hooks/useGetLessons.js
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setLessonsBySubCategory, setLessonsLoading } from "@/redux/lessonsSlice";
import axios from "axios";

export const useGetLessons = (lessonId) => {
  console.log("called");
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchLessonsBySubCategory = async () => {
      try {
        console.log("calling");
        dispatch(setLessonsLoading(true));
        const res = await axios.get(
          `http://localhost:5000/api/lessons/subcategories/${lessonId}`,
          { withCredentials: true }
        );
        console.log(res.data.lessons);
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
