import express from "express";
import { createMultiQuestions, createQuestion } from "../controllers/question.controller.js";

const router = express.Router();

router.post("/create-single", createQuestion);
router.post("/create-multi", createMultiQuestions);
// router.get("/:id", getQuestionById);

export default router;
