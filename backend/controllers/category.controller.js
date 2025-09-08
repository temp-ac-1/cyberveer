import Category from "../models/Category.model.js";
import Subcategory from "../models/Subcategory.model.js";
import Lesson from "../models/Lesson.model.js";
import Quiz from "../models/Quiz.model.js";
import UserProgress from "../models/UserProgress.model.js";

/**
 * GET /api/categories
 * Fetch all categories (summary view)
 */
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({})
      .select("name slug description difficulty avatar participants rating createdAt")
      .lean();

    res.json({
      categories,
      meta: {
        total: categories.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/categories/:slug
 * Fetch category detail (subcategories + lessons + quizzes + user progress)
 */
export const getCategoryDetail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const userId = req.user?._id; // from auth middleware

    // 1. Find category
    const category = await Category.findOne({ slug }).lean();
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 2. Find subcategories
    const subcategories = await Subcategory.find({ category: category._id }).lean();

    // 3. For each subcategory, fetch lessons
    const lessonsBySubcategory = await Promise.all(
      subcategories.map(async (sub) => {
        const lessons = await Lesson.find({ subcategory: sub._id })
          .select("title difficulty estimatedTime")
          .lean();

        // Mark completed if user progress exists
        if (userId) {
          const userProgress = await UserProgress.findOne({
            user: userId,
            category: category._id,
          }).lean();

          const completedLessons = new Set(userProgress?.completedLessons?.map(l => l.toString()) || []);

          lessons.forEach((lesson) => {
            lesson.completed = completedLessons.has(lesson._id.toString());
          });
        }

        return {
          ...sub,
          lessons,
        };
      })
    );

    // 4. Fetch quizzes for this category
    const quizzes = await Quiz.find({ category: category._id })
      .select("type questions points timeEstimate")
      .lean();

    // 5. Calculate progress
    let progress = {
      lessonsCompleted: 0,
      totalLessons: 0,
      quizzesCompleted: 0,
      totalQuizzes: quizzes.length,
      percentage: 0,
    };

    if (userId) {
      const userProgress = await UserProgress.findOne({
        user: userId,
        category: category._id,
      }).lean();

      if (userProgress) {
        progress.lessonsCompleted = userProgress.completedLessons?.length || 0;
        progress.totalLessons = lessonsBySubcategory.reduce(
          (acc, sub) => acc + sub.lessons.length,
          0
        );
        progress.quizzesCompleted = userProgress.completedQuizzes?.length || 0;
        progress.percentage =
          progress.totalLessons + progress.totalQuizzes > 0
            ? Math.round(
                ((progress.lessonsCompleted + progress.quizzesCompleted) /
                  (progress.totalLessons + progress.totalQuizzes)) *
                  100
              )
            : 0;
      }
    }

    res.json({
      category,
      subcategories: lessonsBySubcategory,
      quizzes,
      progress,
    });
  } catch (err) {
    next(err);
  }
};
