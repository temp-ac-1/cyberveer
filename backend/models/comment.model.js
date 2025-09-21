// models/Comment.js
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // optional for anonymous/testing
  authorName: { type: String },    // fallback/display name
  authorAvatar: { type: String },  // optional avatar url
  content: { type: String, required: true },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // reply-to
  isEdited: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

// virtual (not required, but handy) for replies if you want to populate later
CommentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentComment",
  justOne: false
});

export default mongoose.model("Comment", CommentSchema);
