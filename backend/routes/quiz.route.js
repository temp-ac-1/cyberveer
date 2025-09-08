import express from "express";
import {
  getQuizzesByCategory,
  getQuizById,
  submitQuiz,
} from "../controllers/quiz.controller.js";

const router = express.Router();

// Public: list quizzes in a category
router.get("/categories/:slug/quizzes", getQuizzesByCategory);

// Public: get quiz details
router.get("/quizzes/:id", getQuizById);

// Auth required: submit quiz
router.post("/quizzes/:id/submit", submitQuiz);

export default router;
