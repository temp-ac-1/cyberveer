import express from "express";
import {
  getQuizzesByCategory,
  submitQuiz,
  createLessonQuiz,
  createSubcategoryQuiz,
  createCategoryQuiz,
  getQuizByCategoryId,
} from "../controllers/quiz.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public: list quizzes in a category
router.get("/categories/:slug", getQuizzesByCategory);

// Public: get quiz details
router.get("/:categoryId/:quizType", getQuizByCategoryId);

// Auth required: submit quiz
router.post("/:id/submit", protect, submitQuiz);

// Create quizzes at different levels
router.post("/lesson", createLessonQuiz);
router.post("/subcategory", createSubcategoryQuiz);
router.post("/category", createCategoryQuiz);

export default router;
