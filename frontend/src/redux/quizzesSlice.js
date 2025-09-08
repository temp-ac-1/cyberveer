// redux/quizzesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState: {
    quizzesByCategory: {}, // { [slug]: [quizObjects] }
    currentQuiz: null,     // detailed quiz with questions
    loading: false,
    error: null,
    submissionResult: null // { score, correctAnswers, progress }
  },
  reducers: {
    fetchQuizzesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchQuizzesSuccess: (state, action) => {
      const { slug, quizzes } = action.payload;
      state.loading = false;
      state.quizzesByCategory[slug] = quizzes;
    },
    fetchQuizzesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchQuizStart: (state) => {
      state.loading = true;
      state.error = null;
      state.currentQuiz = null;
    },
    fetchQuizSuccess: (state, action) => {
      state.loading = false;
      state.currentQuiz = action.payload;
    },
    fetchQuizFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    submitQuizStart: (state) => {
      state.loading = true;
      state.error = null;
      state.submissionResult = null;
    },
    submitQuizSuccess: (state, action) => {
      state.loading = false;
      state.submissionResult = action.payload;
    },
    submitQuizFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearSubmission: (state) => {
      state.submissionResult = null;
    }
  },
});

export const {
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
} = quizzesSlice.actions;

export default quizzesSlice.reducer;
