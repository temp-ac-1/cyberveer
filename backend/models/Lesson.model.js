// backend/models/Lesson.model.js
import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    // optionally link at both levels so queries can be simpler
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", index: true },
    subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", index: true },

    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true, index: true },

    // content can be markdown/html, stored as string
    content: { type: String, default: "" },

    // ordering within a section
    order: { type: Number, default: 0 },

    // human friendly estimate (minutes)
    estimatedTimeMinutes: { type: Number, default: 0 },

    // optional metadata
    tags: [{ type: String }],

    // optionally a boolean to toggle published or draft
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// useful indexes for lookups
LessonSchema.index({ title: "text", content: "text" });
LessonSchema.index({ categoryId: 1, subcategoryId: 1, order: 1 });

export default mongoose.model("Lesson", LessonSchema);
