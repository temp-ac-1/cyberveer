// controllers/userProgressController.js
import UserProgress from "../models/UserProgress.model.js";

export const getUserProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const progress = await UserProgress.find({ user: userId }).lean();

    res.json({ progress });
  } catch (err) {
    next(err);
  }
};
