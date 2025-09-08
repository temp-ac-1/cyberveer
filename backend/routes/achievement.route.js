import express from "express";
import { createAchievement, getAchievementById } from "../controllers/achievement.controller.js";

const router = express.Router();

router.post("/create", createAchievement);
router.get("/:id", getAchievementById);

export default router;
