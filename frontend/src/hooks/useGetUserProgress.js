// hooks/useProgress.js
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProgressStart,
  fetchProgressSuccess,
  fetchProgressFailure,
  resetProgress,
} from "../redux/progressSlice";

export const useProgress = () => {
  const dispatch = useDispatch();
  const { userProgress, loading, error } = useSelector(
    (state) => state.progress
  );

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Fetch progress for logged-in user
  const fetchUserProgress = async (token) => {
    try {
      dispatch(fetchProgressStart());
      const res = await fetch(`${API_BASE}/userProgress/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch progress");
      const data = await res.json();
      dispatch(fetchProgressSuccess(data));
    } catch (err) {
      dispatch(fetchProgressFailure(err.message));
    }
  };

  return {
    userProgress,
    loading,
    error,
    fetchUserProgress,
    resetProgress: () => dispatch(resetProgress()),
  };
};
