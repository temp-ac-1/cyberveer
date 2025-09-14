// routes/blogRoutes.js
import express from "express";
import { createBlog, getAllBlogs, getFeaturedBlogs } from "../controllers/blog.controller.js";
import upload from "../config/multer.js";

const router = express.Router();

// Add multer middleware to handle file upload
router.post('/create', upload.single('coverImage'), createBlog);

// Get featured & trending blogs
router.get("/featured", getFeaturedBlogs);

// Get all blogs (with optional pagination, filters, search later)
router.get("/", getAllBlogs)

export default router;
