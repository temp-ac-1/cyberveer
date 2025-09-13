import express from "express";
import {
  createSubcategory,
  listSubcategoriesByCategory,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
} from "../controllers/subcategory.controller.js";

const router = express.Router();

// Subcategories belong to categories
router.post("/create", createSubcategory);
router.get("/category/:categorySlug", listSubcategoriesByCategory);
router.get("/:id", getSubcategoryById);
router.put("/:id", updateSubcategory);
router.delete("/:id", deleteSubcategory);

export default router;
