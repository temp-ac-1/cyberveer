// backend/routes/lessons.route.js
import express from "express";
import { getLessonById, completeLesson, listLessonsByCategory, createLesson } from "../controllers/lesson.controller.js";

const router = express.Router();

// GET /api/lessons/category/:slug

router.get("/:id", getLessonById); 
router.patch("/:id/complete", completeLesson);
router.get("/categories/:slug/lessons", listLessonsByCategory);
router.post("/", createLesson);

export default router;
