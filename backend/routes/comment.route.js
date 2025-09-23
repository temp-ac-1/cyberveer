// routes/commentRoutes.js
import express from "express";
import {
  getCommentsByBlog,
  addComment,
  editComment,
  deleteComment
} from "../controllers/comment.controller.js";

// If you have auth middleware (recommended)
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET comments for a blog
router.get("/:blogId", getCommentsByBlog);

// POST a comment -> require auth in production (you can remove protect for testing)
router.post("/:blogId", protect, addComment);

// EDIT / DELETE -> protect
router.patch("/:commentId", protect, editComment);
router.delete("/:commentId", protect, deleteComment);

export default router;
