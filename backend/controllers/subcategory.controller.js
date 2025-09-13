import Subcategory from "../models/Subcategory.model.js";
import Category from "../models/Category.model.js";
import Lesson from "../models/Lesson.model.js";

// List subcategories by category
export const listSubcategoriesByCategory = async (req, res, next) => {
  try {
    const { categorySlug } = req.params;
    const category = await Category.findOne({slug: categorySlug});
    const subcategories = await Subcategory.find({ categoryId: category._id })
      .populate({
        path: 'lessons',
        select: 'title',  // We only want to populate the 'title' field from lessons
        model: Lesson
      })
      .sort({ order: 1 })
      .lean();

    res.json({ success: true, subcategories });
  } catch (err) {
    next(err);
  }
};

// Get single subcategory with lesson titles
export const getSubcategoryById = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id)
      .populate({
        path: 'lessons',
        select: 'title',  // We only want to populate the 'title' field from lessons
        model: Lesson
      });

    if (!subcategory) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    res.json({ success: true, subcategory });
  } catch (err) {
    next(err);
  }
};

// Update subcategory
export const updateSubcategory = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!subcategory) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }
    res.json({ success: true, subcategory });
  } catch (err) {
    next(err);
  }
};

// Delete subcategory
export const deleteSubcategory = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }
    res.json({ success: true, message: "Subcategory deleted" });
  } catch (err) {
    next(err);
  }
};


/**
 * POST /api/subcategories
 */
export const createSubcategory = async (req, res, next) => {
  try {
    const { categoryId, name, description, lessons = [], quizzes = [] } = req.body;

    const subcategory = new Subcategory({
      categoryId,
      name,
      description,
      lessons,
      quizzes,
    });

    await subcategory.save();
    res.status(201).json(subcategory);
  } catch (err) {
    next(err);
  }
};