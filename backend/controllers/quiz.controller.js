// controllers/quizController.js
import Quiz from "../models/Quiz.model.js";
import Question from "../models/Question.model.js";
import UserQuizAttempt from "../models/UserQuizAttempt.model.js";
import UserProgress from "../models/UserProgress.model.js";

export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).lean();
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const questions = await Question.find({ quiz: quiz._id }).select("-correctAnswer").lean();

    res.json({ ...quiz, questions });
  } catch (err) {
    next(err);
  }
};

export const submitQuiz = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { answers } = req.body; // {questionId: answer}

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const questions = await Question.find({ quiz: id });

    let score = 0;
    const results = questions.map((q) => {
      const userAnswer = answers[q._id];
      const correct = String(userAnswer).trim() === String(q.correctAnswer).trim();
      if (correct) score += q.points || 1;
      return { questionId: q._id, userAnswer, correct };
    });

    // Save attempt
    const attempt = await UserQuizAttempt.create({
      user: userId,
      quiz: id,
      answers: results,
      score,
      totalQuestions: questions.length,
    });

    // Update progress
    await UserProgress.findOneAndUpdate(
      { user: userId, quiz: id },
      { status: "completed", score },
      { upsert: true, new: true }
    );

    res.json({ message: "Quiz submitted", score, results, attemptId: attempt._id });
  } catch (err) {
    next(err);
  }
};
