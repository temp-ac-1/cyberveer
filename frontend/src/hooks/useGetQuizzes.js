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
import axios from "axios";

export const useGetQuizzes = () => {
  const dispatch = useDispatch();
  const { quizzesByCategory, currentQuiz, loading, error, submissionResult } =
    useSelector((state) => state.quizzes);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Fetch quizzes by category slug
  const fetchQuizzesByCategory = async (slug) => {
    try {
      dispatch(fetchQuizzesStart());
      const res = await axios.get(`${API_BASE}/quizzes/categories/${slug}`, {
        withCredentials: true,
      });
      dispatch(fetchQuizzesSuccess({ slug, quizzes: res.data }));
    } catch (err) {
      dispatch(fetchQuizzesFailure(err.message));
    }
  };

  // Fetch single quiz by ID
  const fetchQuizById = async (id) => {
    try {
      dispatch(fetchQuizStart());
      const res = await axios.get(`${API_BASE}/quizzes/${id}`, {
        withCredentials: true,
      });
      dispatch(fetchQuizSuccess(res.data));
    } catch (err) {
      dispatch(fetchQuizFailure(err.message));
    }
  };

  // Fetch quiz by category and quiz type
  const fetchQuizByCategoryAndType = async (categoryId, quizType) => {
    try {
      dispatch(fetchQuizStart());
      const res = await axios.get(`${API_BASE}/quizzes/${categoryId}/${quizType}`, {
        withCredentials: true,
      });
      dispatch(fetchQuizSuccess(res.data.quizResponse));
    } catch (err) {
      dispatch(fetchQuizFailure(err.message));
    }
  };

  // Submit quiz answers
  const submitQuiz = async (id, answers) => {
    try {
      dispatch(submitQuizStart());
      const res = await axios.post(`${API_BASE}/quizzes/${id}/submit`, { answers }, {
        withCredentials: true,
      });
      dispatch(submitQuizSuccess(res.data));
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
    fetchQuizByCategoryAndType,
    submitQuiz,
    clearSubmission: () => dispatch(clearSubmission()),
  };
};
