import Question from "../models/Question.model.js";

// POST /api/questions
export const createQuestion = async (req, res, next) => {
  try {
    const {
      category,
      type,
      difficulty,
      question,
      options,
      correctIndex,
      answer,
      scenarioData,
      practicalInstructions,
      explanation,
      resources,
      tags,
      points
    } = req.body;

    const newQuestion = new Question({
      category,
      type,
      difficulty,
      question,
      options,
      correctIndex,
      answer,
      scenarioData,
      practicalInstructions,
      explanation,
      resources,
      tags,
      points
    });

    await newQuestion.save();

    res.status(201).json({
      message: "Question created successfully",
      question: newQuestion
    });
  } catch (err) {
    next(err);
  }
};



export const createMultiQuestions = async (req, res, next) => {
  try {
    const questions = req.body; // Expecting an array of questions
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Please provide an array of questions" });
    }

    // Insert multiple questions at once
    const newQuestions = await Question.insertMany(questions);
    const ids = newQuestions.map((q) => q._id);

    res.status(201).json({
      message: `${ids.length} questions created successfully`,
      questions: ids
    });
  } catch (err) {
    next(err);
  }
};