// models/UserQuizAttempt.js
import mongoose from "mongoose";

const UserQuizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // if you have users
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },  // for predefined quizzes
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // for dynamic quizzes

  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  type: { type: String, enum: ["mcq", "true_false", "fill_blank", "scenario", "practical"] },

  score: { type: Number },       // percentage / raw
  correctAnswers: { type: Number },
  totalQuestions: { type: Number },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      selected: String,  // user’s chosen answer
      isCorrect: Boolean
    }
  ],

  attemptedAt: { type: Date, default: Date.now }
});

export default mongoose.model("UserQuizAttempt", UserQuizAttemptSchema);
