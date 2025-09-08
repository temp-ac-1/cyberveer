// routes/category.route.js
import express from "express";
import { getAllCategories, getCategoryDetail } from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", getAllCategories); // public
router.get("/:slug", getCategoryDetail); // needs auth to fetch user progress   // GET /api/categories/:slug

export default router;
