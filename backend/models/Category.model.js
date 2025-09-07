import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, 
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "", // category image/icon
    },

    // Difficulty level of category
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    estimatedTime:{type: Number},

    // Progress & quiz stats
    overallProgress: {
      type: Number,
      default: 0, // % progress (average of users or example value)
      min: 0,
      max: 100,
    },
    totalQuizzes: {
      type: Number,
      default: 0,
    },
    completedQuizzes: {
      type: Number,
      default: 0,
    },

    // Engagement stats
    participants: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    pointsEarned: {
      type: Number,
      default: 0,
    },

    // Relations (optional, for expansions)
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],
    achievements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Achievement",
      },
    ],
  },
  { timestamps: true }
);

// 🔍 Indexes
CategorySchema.index({ name: "text", description: "text" }); // for search
CategorySchema.index({ slug: 1 }, { unique: true });          // fast lookups

export default mongoose.model("Category", CategorySchema);
