// backend/routes/lessons.route.js
import express from "express";
import { getLessonById, completeLesson, listLessonsByCategory } from "../controllers/lesson.controller.js";

const router = express.Router();

// GET /api/lessons/category/:slug

router.get("/:id", getLessonById); 
router.patch("/:id/complete", completeLesson);
router.get("/categories/:slug/lessons", listLessonsByCategory);
export default router;
