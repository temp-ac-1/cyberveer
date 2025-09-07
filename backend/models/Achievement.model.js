// models/Achievement.js
import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // optional
  points: { type: Number, default: 0 },
  badgeIcon: String // image url for badge
});

export default mongoose.model("Achievement", achievementSchema);
