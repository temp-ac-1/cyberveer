// hooks/useGetQuizzes.js
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuizzesStart,
  fetchQuizzesSuccess,
  fetchQuizzesFailure,
  fetchQuizStart,
  fetchQuizSuccess,
  fetchQuizFailure,
  submitQuizStart,
  submitQuizSuccess,
  submitQuizFailure,
  clearSubmission,
} from "../redux/quizzesSlice";

export const useGetQuizzes = () => {
  const dispatch = useDispatch();
  const { quizzesByCategory, currentQuiz, loading, error, submissionResult } =
    useSelector((state) => state.quizzes);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Fetch quizzes by category slug
  const fetchQuizzesByCategory = async (slug) => {
    try {
      dispatch(fetchQuizzesStart());
      const res = await fetch(`${API_BASE}/quizzes/categories/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch quizzes");
      const data = await res.json();
      dispatch(fetchQuizzesSuccess({ slug, quizzes: data }));
    } catch (err) {
      dispatch(fetchQuizzesFailure(err.message));
    }
  };

  // Fetch single quiz by ID
  const fetchQuizById = async (id) => {
    try {
      dispatch(fetchQuizStart());
      const res = await fetch(`${API_BASE}/quizzes/${id}`);
      if (!res.ok) throw new Error("Failed to fetch quiz");
      const data = await res.json();
      dispatch(fetchQuizSuccess(data));
    } catch (err) {
      dispatch(fetchQuizFailure(err.message));
    }
  };

  // Submit quiz answers
  const submitQuiz = async (id, answers, token) => {
    try {
      dispatch(submitQuizStart());
      const res = await fetch(`${API_BASE}/quizzes/${id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error("Failed to submit quiz");
      const data = await res.json();
      dispatch(submitQuizSuccess(data));
    } catch (err) {
      dispatch(submitQuizFailure(err.message));
    }
  };

  return {
    quizzesByCategory,
    currentQuiz,
    loading,
    error,
    submissionResult,
    fetchQuizzesByCategory,
    fetchQuizById,
    submitQuiz,
    clearSubmission: () => dispatch(clearSubmission()),
  };
};
