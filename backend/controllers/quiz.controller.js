import Category from "../models/Category.model.js";
import Lesson from "../models/Lesson.model.js";
import Question from "../models/Question.model.js";
import Quiz from "../models/Quiz.model.js";
import Subcategory from "../models/Subcategory.model.js";
import UserProgress from "../models/UserProgress.model.js";

/**
 * GET /api/quizzes/categories/:slug
 * Fetch all quizzes for a category
 */
export const getQuizzesByCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Find quizzes directly linked to the category
    const quizzes = await Quiz.find()
      .populate({
        path: "category",
        match: { slug },
        select: "name slug",
      })
      .lean();

    const filtered = quizzes.filter((quiz) => quiz.category);

    res.json(filtered);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/quizzes/:id
 * Fetch a single quiz with randomized options
 */
export const getQuizById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id)
      .populate("category", "name slug")
      .populate("questions")
      .lean();

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Randomize options on-the-fly
    quiz.questions = quiz.questions.map((q) => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5),
    }));

    res.json(quiz);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/quizzes/:id/submit
 * Submit answers, evaluate score, update progress
 */
export const submitQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { answers } = req.body; // { questionId: selectedOption }

    const quiz = await Quiz.findById(id).populate("questions");
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Check if user already submitted this quiz
    let progress = await UserProgress.findOne({
      user: userId,
      category: quiz.category._id,
    });

    if (!progress) {
      progress = new UserProgress({
        user: userId,
        category: quiz.category._id,
        completedLessons: [],
        completedQuizzes: [],
        achievements: [],
      });
    }

    const alreadyAttempted = progress.completedQuizzes.find(
      (q) => q.quiz.toString() === quiz._id.toString()
    );

    if (alreadyAttempted) {
      return res.status(400).json({
        message: "You have already attempted this quiz",
        previousResult: alreadyAttempted,
      });
    }

    let score = 0;
    let correctAnswers = [];

    quiz.questions.forEach((q) => {
      const userAnswer = answers[q._id];
      const isCorrect = q.correctAnswer === userAnswer;

      if (isCorrect) score += q.points;
      correctAnswers.push({
        questionId: q._id,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      });
    });

    // Save quiz result in user progress
    progress.completedQuizzes.push({
      quiz: quiz._id,
      score,
    });

    await progress.save();

    res.json({
      message: "Quiz submitted successfully",
      score,
      totalPoints: quiz.questions.reduce((acc, q) => acc + q.points, 0),
      correctAnswers,
      progress,
    });
  } catch (err) {
    next(err);
  }
};


// POST /api/quizzes
export const createQuiz = async (req, res, next) => {
    try {
      const {
        title,
        category,
        subcategoryId,
        lessonId,
        difficulty,
        type,
        questions,
        timeLimit,
        passingScore
      } = req.body;
  
      const newQuiz = new Quiz({
        title,
        category,
        subcategoryId,
        lessonId,
        difficulty,
        type,
        questions,
        timeLimit,
        passingScore
      });
  
      await newQuiz.save();
  
      res.status(201).json({
        message: "Quiz created successfully",
        quiz: newQuiz
      });
    } catch (err) {
      next(err);
    }
  };

  /**
 * Create Lesson-level Quiz
 */
  export const createLessonQuiz = async (req, res) => {
    try {
      const { title, description, lessonId, difficulty, type, timeLimit, passingScore } = req.body;
  
      const lesson = await Lesson.findById(lessonId).populate("subcategoryId");
      if (!lesson) return res.status(404).json({ message: "Lesson not found" });
  
      const questions = await Question.find({ lessonId });
  
      const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  
      const quiz = new Quiz({
        title,
        description,
        category: lesson.categoryId, 
        subcategoryId: lesson.subcategoryId,
        lessonId,
        difficulty,
        level: "lesson",
        type,
        questions: questions.map(q => q._id),
        timeLimit,
        totalPoints,
        passingScore
      });
  
      await quiz.save();
      res.status(201).json({message:"lesson quiz created", id: quiz._id});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

/**
 * Create Subcategory-level Quiz
 */
export const createSubcategoryQuiz = async (req, res) => {
  try {
    const { title, description, category, subcategoryId, difficulty, type, timeLimit, passingScore } = req.body;

    const subcategory = await Subcategory.findById(subcategoryId).populate("categoryId");
    if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });

    const questions = await Question.find({ subcategoryId });

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    const quiz = new Quiz({
      title,
      description,
      category,
      subcategoryId,
      difficulty,
      level: "subcategory",
      type,
      questions: questions.map(q => q._id),
      timeLimit,
      totalPoints,
      passingScore
    });

    await quiz.save();
    res.status(201).json({message:"sub category quiz created", id: quiz._id});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * Create Category-level Quiz
 */
export const createCategoryQuiz = async (req, res) => {
  try {
    const { title, description, categoryId, difficulty, type, timeLimit, passingScore } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const questions = await Question.find({ category: categoryId });

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    const quiz = new Quiz({
      title,
      description,
      category: categoryId,
      difficulty,
      level: "category",
      type,
      questions: questions.map(q => q._id),
      timeLimit,
      totalPoints,
      passingScore
    });

    await quiz.save();
    res.status(201).json({message:"category quiz created", id: quiz._id});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};