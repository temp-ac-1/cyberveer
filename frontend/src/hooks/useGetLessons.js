// hooks/useLesson.js
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLessonStart,
  fetchLessonSuccess,
  fetchLessonFailure,
  completeLessonStart,
  completeLessonSuccess,
  completeLessonFailure,
} from "../redux/lessonsSlice";

export const useLesson = () => {
  const dispatch = useDispatch();
  const { currentLesson, loading, error, completionStatus } = useSelector(
    (state) => state.lessons
  );

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Fetch lesson by ID
  const fetchLessonById = async (id) => {
    try {
      dispatch(fetchLessonStart());
      const res = await fetch(`${API_BASE}/lessons/${id}`);
      if (!res.ok) throw new Error("Failed to fetch lesson");
      const data = await res.json();
      dispatch(fetchLessonSuccess(data));
    } catch (err) {
      dispatch(fetchLessonFailure(err.message));
    }
  };

  // Mark lesson as completed
  const completeLesson = async (id, token) => {
    try {
      dispatch(completeLessonStart());
      const res = await fetch(`${API_BASE}/lessons/${id}/complete`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to complete lesson");
      const data = await res.json();
      dispatch(completeLessonSuccess(data.progress));
    } catch (err) {
      dispatch(completeLessonFailure(err.message));
    }
  };

  return {
    currentLesson,
    loading,
    error,
    completionStatus,
    fetchLessonById,
    completeLesson,
  };
};
