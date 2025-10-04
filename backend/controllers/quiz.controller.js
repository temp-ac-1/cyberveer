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
export const getQuizByCategoryId = async (req, res, next) => {
  try {
    const { categoryId, quizType } = req.params;

    // Fetch the quiz and populate category and questions
    const quizData = await Quiz.findOne({ category: categoryId, type: quizType, level: "category" })
      .populate("category", "name slug")
      .populate({
        path: "questions",
        select: "-__v -createdAt", // exclude unnecessary fields
      })
      .lean();

    if (!quizData) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Transform questions to frontend-friendly format
    const transformedQuestions = quizData.questions.map((q) => ({
      id: q._id,
      type: q.type,
      question: q.question,
      options: q.options || [],
      correctAnswer: q.correctIndex ?? null,
      answer: q.answer || null,
      explanation: q.explanation || "",
      points: q.points || 5,
      difficulty: q.difficulty,
      scenario: q.scenarioData || null,
      practicalInstructions: q.practicalInstructions || null,
      resources: q.resources || [],
      tags: q.tags || []
    }));

    const quizResponse = {
      id: quizData._id,
      title: quizData.title,
      description: quizData.description,
      category: quizData.category,
      difficulty: quizData.difficulty,
      level: quizData.level,
      type: quizData.type,
      questions: transformedQuestions,
      timeLimit: quizData.timeLimit || 60,
      totalPoints: quizData.totalPoints || 0,
      passingScore: quizData.passingScore || 70,
      createdAt: quizData.createdAt
    };
    res.json({quizResponse});

  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/quizzes/:id/submit
 * Submit answers, evaluate score, update progress with incremental point system
 */
export const submitQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { answers } = req.body; // { questionId: selectedOption }
    
    console.log('Quiz submission - User ID:', userId);
    console.log('Quiz submission - Quiz ID:', id);
    console.log('Quiz submission - Answers:', answers);

    const quiz = await Quiz.findById(id).populate("questions").populate("category", "name slug");
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Get or create user progress
    let progress = await UserProgress.findOne({ user: userId });
    if (!progress) {
      progress = new UserProgress({
        user: userId,
        categoryProgress: [],
        quizAttempts: [],
        achievements: [],
        totalPoints: 0,
      });
    }

    // Find or create category progress
    let categoryProgress = progress.categoryProgress.find(
      (cp) => cp.category.toString() === quiz.category._id.toString()
    );

    if (!categoryProgress) {
      categoryProgress = {
        category: quiz.category._id,
        completedLessons: [],
        completedQuizzes: [],
        progressPercentage: 0,
      };
      progress.categoryProgress.push(categoryProgress);
    }

    // Check previous quiz attempts for this quiz
    const previousAttempts = progress.quizAttempts.filter(
      (attempt) => attempt.quiz.toString() === quiz._id.toString()
    );

    // Get questions that were previously answered correctly
    const previouslyCorrectQuestions = new Set();
    if (previousAttempts.length > 0) {
      // For simplicity, we'll track which questions were answered correctly in the last attempt
      // In a more sophisticated system, you'd track each question individually
      const lastAttempt = previousAttempts[previousAttempts.length - 1];
      if (lastAttempt.pointsAwarded) {
        // If points were already awarded, we need to check which questions were correct
        // This is a simplified approach - in reality you'd store question-level results
        quiz.questions.forEach((question) => {
          const wasCorrect = answers[question._id] === question.correctIndex;
          if (wasCorrect) {
            previouslyCorrectQuestions.add(question._id.toString());
          }
        });
      }
    }

    let totalScore = 0;
    let newPointsEarned = 0;
    let correctAnswers = [];
    let questionResults = [];

    quiz.questions.forEach((question) => {
      const userAnswer = answers[question._id];
      let isCorrect = false;

      console.log(`Question ${question._id}:`, {
        type: question.type,
        userAnswer,
        correctIndex: question.correctIndex,
        correctAnswer: question.answer,
        question: question.question.substring(0, 50) + '...'
      });

      // Check if answer is correct based on question type
      if (question.type === 'fill_blank') {
        isCorrect = userAnswer && userAnswer.toString().toLowerCase().trim() === question.answer.toString().toLowerCase();
      } else {
        // Convert userAnswer to number for comparison with correctIndex
        const userAnswerIndex = parseInt(userAnswer);
        isCorrect = userAnswerIndex === question.correctIndex;
      }

      console.log(`Question ${question._id} - isCorrect:`, isCorrect);

      const wasPreviouslyCorrect = previouslyCorrectQuestions.has(question._id.toString());
      
      // Only award points for questions that were not previously answered correctly
      if (isCorrect && !wasPreviouslyCorrect) {
        newPointsEarned += question.points;
      }

      totalScore += isCorrect ? question.points : 0;

      correctAnswers.push({
        questionId: question._id,
        userAnswer: userAnswer || 'No answer',
        correctAnswer: question.type === 'fill_blank' ? question.answer : question.correctIndex,
        isCorrect,
        explanation: question.explanation,
        points: question.points,
        pointsEarned: isCorrect && !wasPreviouslyCorrect ? question.points : 0,
        wasPreviouslyCorrect
      });

      questionResults.push({
        question: {
          id: question._id,
          type: question.type,
          question: question.question,
          options: question.options || [],
          correctAnswer: question.type === 'fill_blank' ? question.answer : question.correctIndex,
          explanation: question.explanation,
          difficulty: question.difficulty,
          points: question.points,
          scenario: question.scenarioData || null
        },
        userAnswer: userAnswer || 'No answer',
        isCorrect,
        pointsEarned: isCorrect && !wasPreviouslyCorrect ? question.points : 0,
        wasPreviouslyCorrect
      });
    });

    // Update total points
    progress.totalPoints += newPointsEarned;

    // Add new quiz attempt
    progress.quizAttempts.push({
      quiz: quiz._id,
      score: totalScore,
      pointsAwarded: newPointsEarned > 0,
      attemptedAt: new Date(),
    });

    // Update category progress
    if (!categoryProgress.completedQuizzes.includes(quiz._id)) {
      categoryProgress.completedQuizzes.push(quiz._id);
    }

    // Calculate progress percentage for category
    const totalQuizzes = await Quiz.countDocuments({ category: quiz.category._id });
    categoryProgress.progressPercentage = Math.round((categoryProgress.completedQuizzes.length / totalQuizzes) * 100);

    await progress.save();

    const percentage = quiz.questions.length > 0 ? Math.round((totalScore / quiz.totalPoints) * 100) : 0;
    let rank = 'Needs Improvement';
    if (percentage >= 90) rank = 'Excellent';
    else if (percentage >= 80) rank = 'Good';
    else if (percentage >= 70) rank = 'Average';

    res.json({
      message: "Quiz submitted successfully",
      totalQuestions: quiz.questions.length,
      correctAnswers: correctAnswers.filter(ca => ca.isCorrect).length,
      totalPoints: quiz.totalPoints,
      earnedPoints: totalScore,
      newPointsEarned,
      percentage,
      rank,
      timeSpent: "0:00", // This should be passed from frontend
      questionResults,
      progress: {
        totalPoints: progress.totalPoints,
        categoryProgress: categoryProgress.progressPercentage
      }
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
      passingScore,
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
      passingScore,
    });

    await newQuiz.save();

    res.status(201).json({
      message: "Quiz created successfully",
      quiz: newQuiz,
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
    const {
      title,
      description,
      lessonId,
      difficulty,
      type,
      timeLimit,
      passingScore,
    } = req.body;

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
      questions: questions.map((q) => q._id),
      timeLimit,
      totalPoints,
      passingScore,
    });

    await quiz.save();
    res.status(201).json({ message: "lesson quiz created", id: quiz._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create Subcategory-level Quiz
 */
export const createSubcategoryQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subcategoryId,
      difficulty,
      type,
      timeLimit,
      passingScore,
    } = req.body;

    const subcategory = await Subcategory.findById(subcategoryId).populate(
      "categoryId"
    );
    if (!subcategory)
      return res.status(404).json({ message: "Subcategory not found" });

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
      questions: questions.map((q) => q._id),
      timeLimit,
      totalPoints,
      passingScore,
    });

    await quiz.save();
    res
      .status(201)
      .json({ message: "sub category quiz created", id: quiz._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create Category-level Quiz
 */
export const createCategoryQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      categoryId,
      difficulty,
      type,
      timeLimit,
      passingScore,
    } = req.body;

    const category = await Category.findById(categoryId);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const questions = await Question.find({ category: categoryId });

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    const quiz = new Quiz({
      title,
      description,
      category: categoryId,
      difficulty,
      level: "category",
      type,
      questions: questions.map((q) => q._id),
      timeLimit,
      totalPoints,
      passingScore,
    });

    await quiz.save();
    res.status(201).json({ message: "category quiz created", id: quiz._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
