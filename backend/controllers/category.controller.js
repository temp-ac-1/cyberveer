// controllers/categoryController.js
import Category from "../models/Category.model.js";
import Lesson from "../models/Lesson.model.js";
import Quiz from "../models/Quiz.model.js";

export const listCategories = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(parseInt(req.query.limit || "12", 10), 100);
    const skip = (page - 1) * limit;

    const search = (req.query.search || "").trim();
    const difficulty = req.query.difficulty;
    const sortBy = req.query.sortBy || "recent";

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (difficulty && difficulty !== "all") {
      filter.difficulty = difficulty;
    }

    let sort = { createdAt: -1 };
    if (sortBy === "popularity") sort = { participants: -1 };
    else if (sortBy === "rating") sort = { rating: -1 };
    else if (sortBy === "progress") sort = { overallProgress: -1 };

    const projection =
      "title description slug difficulty overallProgress totalQuizzes completedQuizzes participants rating pointsEarned avatar";

    const [categories, total] = await Promise.all([
      Category.find(filter).select(projection).sort(sort).skip(skip).limit(limit).lean(),
      Category.countDocuments(filter),
    ]);

    res.json({
      categories,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// 🔹 Get single category details
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug }).lean();
    if (!category) return res.status(404).json({ message: "Category not found" });

    res.json(category);
  } catch (err) {
    next(err);
  }
};

// 🔹 Get lessons for category
export const getCategoryLessons = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug }).lean();
    if (!category) return res.status(404).json({ message: "Category not found" });

    const lessons = await Lesson.find({ category: category._id }).sort({ order: 1 }).lean();
    res.json({ lessons });
  } catch (err) {
    next(err);
  }
};

// 🔹 Get quizzes for category
export const getCategoryQuizzes = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug }).lean();
    if (!category) return res.status(404).json({ message: "Category not found" });

    const quizzes = await Quiz.find({ category: category._id })
      .select("title description difficulty type totalQuestions timeLimit points")
      .lean();

    res.json({ quizzes });
  } catch (err) {
    next(err);
  }
};
