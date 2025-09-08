import Subcategory from "../models/Subcategory.model.js";
import Category from "../models/Category.model.js";

// Create Subcategory
export const createSubcategory = async (req, res, next) => {
  try {
    const { categoryId, name, description, order } = req.body;

    // Validate category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const subcategory = await Subcategory.create({
      categoryId,
      name,
      description,
      order,
    });

    res.status(201).json({ success: true, subcategory });
  } catch (err) {
    next(err);
  }
};

// List subcategories by category
export const listSubcategoriesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const subcategories = await Subcategory.find({ categoryId })
      .sort({ order: 1 })
      .lean();

    res.json({ success: true, subcategories });
  } catch (err) {
    next(err);
  }
};

// Get single subcategory
export const getSubcategoryById = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
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
