// models/Question.js
import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },

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
  options: [{ type: String }],  
  correctIndex: { type: Number },  

  // For Fill in the Blank
  answer: { type: String },

  // For Scenarios / Practicals
  scenarioData: { type: String },      
  practicalInstructions: { type: String }, 

  explanation: { type: String },
  resources: [{ type: String }],       
  tags: [{ type: String }],            

  points: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now }
});

// Index for faster lookups
QuestionSchema.index({ lessonId: 1, subcategoryId: 1, category: 1 });

export default mongoose.model("Question", QuestionSchema);
