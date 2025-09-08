import Achievement from "../models/Achievement.model.js";

// POST /api/achievements
export const createAchievement = async (req, res, next) => {
  try {
    const { title, description, categoryId, points, badgeIcon } = req.body;

    const achievement = new Achievement({
      title,
      description,
      categoryId,
      points,
      badgeIcon
    });

    await achievement.save();

    res.status(201).json({
      message: "Achievement created successfully",
      achievement
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/achievements/:id
 */
export const getAchievementById = async (req, res, next) => {
    try {
      const achievement = await Achievement.findById(req.params.id).lean();
      if (!achievement) return res.status(404).json({ message: "Achievement not found" });
      res.json(achievement);
    } catch (err) {
      next(err);
    }
  };