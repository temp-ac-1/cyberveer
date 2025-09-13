// models/Quiz.js
import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }, // optional if quiz belongs to lesson
  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
  level: {
    type: String,
    enum: ["lesson", "subcategory", "category"],
    required: true
  },

  type: { type: String, enum: ["mcq", "true_false", "fill_blank", "scenario", "practical"] },

  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }], // linked questions

  timeLimit: { type: Number },   // in minutes
  totalPoints: { type: Number, default: 0 },
  passingScore: { type: Number }, // e.g., 70 (%)

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Quiz", QuizSchema);
