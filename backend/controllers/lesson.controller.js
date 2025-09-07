// controllers/lessonController.js
import Lesson from "../models/Lesson.model.js";
import UserProgress from "../models/UserProgress.model.js";

export const getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).lean();
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    res.json(lesson);
  } catch (err) {
    next(err);
  }
};

export const markLessonComplete = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const progress = await UserProgress.findOneAndUpdate(
      { user: userId, lesson: id },
      { status: "completed" },
      { upsert: true, new: true }
    );

    res.json({ message: "Lesson marked as complete", progress });
  } catch (err) {
    next(err);
  }
};
