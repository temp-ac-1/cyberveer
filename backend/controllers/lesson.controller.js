import Category from "../models/Category.model.js";
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
      .populate("subcategoryId", "name")
      .populate("categoryId", "name slug")
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
export const getLessonsByCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    // Fetch lessons linked to this category directly
    const lessons = await Lesson.find({ categoryId: category._id })
      .populate("subcategoryId", "name")
      .lean();

    res.json({ success: true, category: category.title, lessons });
  } catch (err) {
    next(err);
  }
};


/**
 * GET /api/lessons/by-lesson/:lessonId
 * Returns all lessons in the same subcategory as the given lessonId
 */
export const getLessonsBySubCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    // Step 1: Find the lesson by ID
    const lesson = await Lesson.findById(slug);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Step 2: Use its subcategoryId to get all lessons in that subcategory
    const lessons = await Lesson.find({
      subcategoryId: lesson.subcategoryId,
    }).sort({ order: 1, createdAt: 1 }); // optional: keep them ordered

    return res.status(200).json({
      subcategoryId: lesson.subcategoryId,
      total: lessons.length,
      lessons,
    });
  } catch (error) {
    console.error("Error fetching lessons by lessonId:", error);
    res.status(500).json({ message: "Server error" });
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

    const lesson = await Lesson.findById(id)
      .populate("subcategoryId")
      .populate("categoryId");
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const categoryId = lesson.categoryId;

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
    const totalLessons = await Lesson.countDocuments({ categoryId });
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


/**
 * POST /api/lessons
 */
export const createLesson = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      content,
      categoryId,
      subcategoryId,
      order,
      estimatedTimeMinutes,
      tags,
      published
    } = req.body;

    const lesson = new Lesson({
      title,
      slug,
      content,
      categoryId,
      subcategoryId,
      order,
      estimatedTimeMinutes,
      tags,
      published
    });

    await lesson.save();
    res.status(201).json(lesson);
  } catch (err) {
    next(err);
  }
};