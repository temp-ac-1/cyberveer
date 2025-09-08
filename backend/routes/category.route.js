// routes/category.route.js
import express from "express";
import { createCategory, getAllCategories, getCategoryDetail, getLessonsByCategory, getSubcategoriesByCategory } from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", getAllCategories); // public
router.get("/:slug", getCategoryDetail); // needs auth to fetch user progress   // GET /api/categories/:slug
// NEW: Get all subcategories for a category
router.get("/:slug/subcategories", getSubcategoriesByCategory);

// NEW: Get all lessons grouped by subcategory
router.get("/:slug/lessons", getLessonsByCategory);

router.post("/create", createCategory);

export default router;
