import Lesson from "../models/Lesson.model.js";
import UserProgress from "../models/UserProgress.model.js";

/**
 * GET /api/lessons/:id
 * Fetch a single lesson
 */
export const getLessonById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const lesson = await Lesson.findById(id)
      .populate("subcategory", "name slug")
      .populate({
        path: "subcategory",
        populate: { path: "category", select: "name slug" }
      })
      .lean();

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Check if user already completed this lesson
    let completed = false;
    if (userId) {
      const progress = await UserProgress.findOne({
        user: userId,
        completedLessons: lesson._id,
      });
      completed = !!progress;
    }

    res.json({ ...lesson, completed });
  } catch (err) {
    next(err);
  }
};


/**
 * GET /api/categories/:slug/lessons
 * Fetch all lessons for a category by slug
 */
export const listLessonsByCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const lessons = await Lesson.find()
      .populate({
        path: "subcategory",
        match: { category: category._id },
        select: "name slug",
      })
      .lean();

    // Filter lessons that actually belong to the category
    const filtered = lessons.filter(l => l.subcategory);

    res.json({ category: category.name, lessons: filtered });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/lessons/:id/complete
 * Mark lesson as completed for user
 */
export const completeLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const lesson = await Lesson.findById(id).populate({
      path: "subcategory",
      populate: { path: "category" }
    });
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const categoryId = lesson.subcategory.category._id;

    let progress = await UserProgress.findOne({
      user: userId,
      category: categoryId,
    });

    if (!progress) {
      progress = new UserProgress({
        user: userId,
        category: categoryId,
        completedLessons: [],
        completedQuizzes: [],
        achievements: [],
      });
    }

    // Prevent duplicate completions
    if (!progress.completedLessons.includes(lesson._id)) {
      progress.completedLessons.push(lesson._id);
      await progress.save();
    }

    // Calculate updated progress
    const totalLessons = await Lesson.countDocuments({ "subcategory.category": categoryId });
    const lessonsCompleted = progress.completedLessons.length;

    const percentage =
      totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;

    res.json({
      message: "Lesson marked as completed",
      progress: {
        lessonsCompleted,
        totalLessons,
        percentage,
      },
    });
  } catch (err) {
    next(err);
  }
};
