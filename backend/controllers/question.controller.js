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
