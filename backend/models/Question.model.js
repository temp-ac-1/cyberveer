// models/Question.js
import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },

  type: { 
    type: String, 
    enum: ["mcq", "true_false", "fill_blank", "scenario", "practical"], 
    required: true 
  },

  difficulty: { 
    type: String, 
    enum: ["beginner", "intermediate", "advanced"], 
    required: true 
  },

  question: { type: String, required: true },

  // For MCQ / TrueFalse
  options: [{ text: String }],  // ["A", "B", "C", "D"]
  correctIndex: { type: Number },  // index of correct option (MCQ/TF)

  // For Fill in the Blank
  answer: { type: String },

  // For Scenarios / Practicals
  scenarioData: { type: String },      // case study / description
  practicalInstructions: { type: String }, // hands-on exercise

  explanation: { type: String },
  resources: [{ type: String }],       // optional links, images, etc.
  tags: [{ type: String }],            // e.g., ["encryption", "SQLi"]


  points: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now }
});

// Compound index for fast queries
QuestionSchema.index({ category: 1, type: 1, difficulty: 1 });

export default mongoose.model("Question", QuestionSchema);
