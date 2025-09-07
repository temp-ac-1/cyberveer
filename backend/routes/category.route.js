// routes/category.route.js
import express from "express";
import { listCategories, getCategoryBySlug } from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", listCategories);            // GET /api/categories
router.get("/:slug", getCategoryBySlug);    // GET /api/categories/:slug

export default router;
