// models/User.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Auth details
    username: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    fullname: {
      type: String,
      required: function () {
        return !this.provider; // password required only for local users
      },
    },
    password: {
      type: String,
      required: function () {
        return !this.provider; // password required only for local users
      },
    },

    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },

    providerId: {
      type: String, // e.g., Google or GitHub profile ID
    },

    // Account verification & MFA
    isVerified: { type: Boolean, default: false },

    // otp: {
    //   type: String,
    //   required: function () {
    //     return this.provider === "local";
    //   },
    // },

    // otpExpiry: {
    //   type: Date,
    //   required: function () {
    //     return this.provider === "local";
    //   },
    // },

    // Gamification / Points
    totalPoints: { type: Number, default: 0 },

    achievements: [
      {
        achievement: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Achievement",
        },
        earnedAt: { type: Date, default: Date.now },
      },
    ],

    // Roles & permissions
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },

    // Profile info
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },

    // Security & activity tracking
    lastLogin: { type: Date },
    loginHistory: [
      {
        ip: String,
        userAgent: String,
        loginAt: { type: Date, default: Date.now },
      },
    ],

    // Password reset
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
