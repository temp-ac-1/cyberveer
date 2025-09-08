import express from "express";
import { createQuestion } from "../controllers/question.controller.js";

const router = express.Router();

router.post("/", createQuestion);
// router.get("/:id", getQuestionById);

export default router;
