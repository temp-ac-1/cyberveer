// models/Subcategory.js
import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  name: { type: String, required: true },
  description: String,

  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }]
});

export default mongoose.model("Subcategory", subcategorySchema);
