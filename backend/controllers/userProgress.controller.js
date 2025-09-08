import UserProgress from "../models/UserProgress.model.js";
import Category from "../models/Category.model.js";
import Lesson from "../models/Lesson.model.js";
import Quiz from "../models/Quiz.model.js";

/**
 * GET /api/users/:id/progress
 * Fetch a user's overall progress (all categories)
 */
export const getUserProgress = async (req, res, next) => {
  try {
    const { id } = req.params;

    const progress = await UserProgress.find({ user: id })
      .populate("category", "name slug")
      .populate("completedLessons.lesson", "title slug")
      .populate("completedQuizzes.quiz", "title slug")
      .lean();

    res.json(progress);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:id/progress/:categoryId
 * Fetch a user's progress for a single category
 */
export const getCategoryProgress = async (req, res, next) => {
  try {
    const { id, categoryId } = req.params;

    const progress = await UserProgress.findOne({
      user: id,
      category: categoryId,
    })
      .populate("category", "name slug")
      .populate("completedLessons.lesson", "title slug")
      .populate("completedQuizzes.quiz", "title slug")
      .lean();

    res.json(progress || {});
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/lessons/:id/complete
 * Mark a lesson as complete for a user
 */
export const completeLesson = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const lesson = await Lesson.findById(id).populate("category");
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    let progress = await UserProgress.findOne({
      user: userId,
      category: lesson.category._id,
    });

    if (!progress) {
      progress = new UserProgress({
        user: userId,
        category: lesson.category._id,
        completedLessons: [],
        completedQuizzes: [],
        achievements: [],
      });
    }

    const alreadyCompleted = progress.completedLessons.some(
      (l) => l.lesson.toString() === lesson._id.toString()
    );

    if (!alreadyCompleted) {
      progress.completedLessons.push({ lesson: lesson._id });
      await progress.save();
    }

    res.json({
      message: "Lesson marked complete",
      progress,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:id/achievements
 * Fetch all achievements earned by a user
 */
export const getUserAchievements = async (req, res, next) => {
  try {
    const { id } = req.params;

    const progress = await UserProgress.find({ user: id })
      .populate("achievements", "title description icon points")
      .lean();

    const achievements = progress.flatMap((p) => p.achievements);

    res.json(achievements);
  } catch (err) {
    next(err);
  }
};
