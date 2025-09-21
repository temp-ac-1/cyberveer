// controllers/commentController.js
import Comment from "../models/Comment.model.js";
import Blog from "../models/Blog.model.js";
import User from "../models/User.model.js"; // optional, for validation

// Helper: build nested tree from flat list
const buildTree = (comments) => {
  const map = {};
  comments.forEach(c => { c.replies = []; map[c._id.toString()] = c; });

  const roots = [];
  comments.forEach(c => {
    if (c.parentComment) {
      const parent = map[c.parentComment.toString()];
      if (parent) parent.replies.push(c);
      else roots.push(c); // fallback if parent missing
    } else {
      roots.push(c);
    }
  });
  return roots;
};

// GET comments for a blog (returns nested tree)
export const getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    // check blog exists
    const blog = await Blog.findById(blogId).select("_id");
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // fetch all comments for the blog, populate user basic info
    const comments = await Comment.find({ blog: blogId })
      .sort({ createdAt: 1 })
      .populate("user", "fullname avatar")
      .lean();

    // normalize authorName/avatar: if user populated use user data
    comments.forEach(c => {
      if (c.user) {
        c.authorName = c.user.fullname || c.authorName;
        c.authorAvatar = c.user.avatar || c.authorAvatar;
      }
      // remove user._id from response if you don't want it
    });

    const tree = buildTree(comments);
    res.json(tree);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST add a comment or reply
export const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content, parentComment } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Determine author info: prefer authenticated user (req.user), else fallback to body
    let userId = req.userId;
    const user = await User.findById(userId);
    let authorName = req.body.authorName || "Anonymous";
    let authorAvatar = req.body.authorAvatar || "";

    if (req.user) {
      userId = req.user._id;
      // if req.user holds name/avatar fields:
      authorName = req.user.name || authorName;
      authorAvatar = req.user.avatar || authorAvatar;
    }

    const newComment = new Comment({
      blog: blogId,
      user: userId,
      authorName: user.fullname,
      authorAvatar: user.avatar,
      content,
      parentComment: parentComment || null
    });

    await newComment.save();
    // populate user for response
    await newComment.populate("user", "name avatar").execPopulate?.() || await newComment.populate("user", "name avatar");

    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH edit comment (only owner or admin)
export const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // authorization: allow if user is comment owner or (optionally) admin
    if (req.user) {
      const isOwner = comment.user && comment.user.toString() === req.user._id.toString();
      const isAdmin = req.user.isAdmin;
      if (!isOwner && !isAdmin) return res.status(403).json({ message: "Not authorized to edit" });
    } else {
      return res.status(401).json({ message: "Authentication required to edit comment" });
    }

    comment.content = content;
    comment.isEdited = true;
    await comment.save();

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE comment -> soft delete to preserve thread
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (req.user) {
      const isOwner = comment.user && comment.user.toString() === req.user._id.toString();
      const isAdmin = req.user.isAdmin;
      if (!isOwner && !isAdmin) return res.status(403).json({ message: "Not authorized to delete" });
    } else {
      return res.status(401).json({ message: "Authentication required to delete comment" });
    }

    // soft-delete: replace content and flag
    comment.content = "[deleted]";
    comment.authorName = "Deleted";
    comment.user = null;
    comment.isDeleted = true;
    await comment.save();

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
