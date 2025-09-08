import express from "express";
import {
  getUserProgress,
  getCategoryProgress,
  completeLesson,
  getUserAchievements,
} from "../controllers/userProgress.controller.js";

const router = express.Router();

// All routes are protected
router.get("/users/:id/progress", getUserProgress);
router.get("/users/:id/progress/:categoryId", getCategoryProgress);
router.patch("/lessons/:id/complete", completeLesson);
router.get("/users/:id/achievements", getUserAchievements);

export default router;
