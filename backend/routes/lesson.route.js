// backend/routes/lessons.route.js
import express from "express";
import { getLessonById, completeLesson, getLessonsByCategory, createLesson, getLessonsBySubCategory } from "../controllers/lesson.controller.js";

const router = express.Router();

// Place specific routes before ":id" to avoid conflicts
router.get("/categories/:slug", getLessonsByCategory);
router.get("/subcategories/:slug", getLessonsBySubCategory);
router.get("/:id", getLessonById); 
router.patch("/:id/complete", completeLesson);
router.post("/create", createLesson);

export default router;
