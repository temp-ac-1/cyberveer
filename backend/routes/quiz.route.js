import express from "express";
import {
  getQuizzesByCategory,
  getQuizById,
  submitQuiz,
  createLessonQuiz,
  createSubcategoryQuiz,
  createCategoryQuiz,
} from "../controllers/quiz.controller.js";

const router = express.Router();

// Public: list quizzes in a category
router.get("/categories/:slug", getQuizzesByCategory);

// Public: get quiz details
router.get("/:id", getQuizById);

// Auth required: submit quiz
router.post("/:id/submit", submitQuiz);

// Create quizzes at different levels
router.post("/lesson", createLessonQuiz);
router.post("/subcategory", createSubcategoryQuiz);
router.post("/category", createCategoryQuiz);

export default router;
