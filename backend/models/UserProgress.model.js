import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    categoryProgress: [
      {
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
        completedQuizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
        progressPercentage: { type: Number, default: 0 },
      },
    ],

    quizAttempts: [
      {
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
        score: { type: Number, required: true },
        pointsAwarded: { type: Boolean, default: false },
        attemptedAt: { type: Date, default: Date.now },
      },
    ],

    achievements: [
      {
        achievement: { type: mongoose.Schema.Types.ObjectId, ref: "Achievement", required: true },
        earned: { type: Boolean, default: false },
        earnedAt: { type: Date },
      },
    ],

    totalPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("UserProgress", userProgressSchema);
