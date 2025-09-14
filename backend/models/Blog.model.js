import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    excerpt: String,
    content: { type: String, required: true }, // Markdown content
    coverImage: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    skillLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
    tags: [String],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    reactions: {
      like: { type: Number, default: 0 },
      heart: { type: Number, default: 0 },
      insight: { type: Number, default: 0 }
    },
    readTime: {type: String},
    isPublished: {type: Boolean, default:false},
    publishedAt: { type: Date, default: Date.now }
  }, { timestamps: true });
  

  export default mongoose.model("Blog", BlogSchema);