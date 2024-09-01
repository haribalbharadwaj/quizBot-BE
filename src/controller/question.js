const Question = require('../model/question');

const createQuestion = async (req, res) => {
  try {
    const { questionText, type, options = [], correctOptionIndex } = req.body;

    // Log incoming data for debugging
    console.log('Received request body:', req.body);

    // Validate that required fields are provided
    if (!questionText || !type) {
      return res.status(400).json({
        success: false,
        message: 'Question text and type are required',
      });
    }

    // Ensure options is an array and has at least 2 options if the type is not 'Q&A'
    if (type !== 'Q&A' && (!Array.isArray(options) || options.length < 2)) {
      return res.status(400).json({
        success: false,
        message: 'Options must be an array with at least 2 items',
      });
    }

    // Validate correctOptionIndex if applicable
    if (type !== 'Q&A' && (correctOptionIndex < 0 || correctOptionIndex >= options.length)) {
      return res.status(400).json({
        success: false,
        message: 'Correct option index is out of bounds',
      });
    }

    // Create and save options if they exist
    const optionIds = [];
    for (const option of options) {
      const newOption = new Option(option);
      await newOption.save();
      optionIds.push(newOption._id);
    }

    const newQuestion = new Question({
      questionText,
      type,
      options: optionIds,
      correctOptionIndex: type === 'Q&A' ? correctOptionIndex : undefined,
    });

    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      question: newQuestion,
    });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create question',
      error: error.message,
    });
  }
};

// Update an existing question
const updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { questionText, options } = req.body;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Update the question text
    if (questionText) {
      question.questionText = questionText;
    }

    // Update options but do not allow changing the correctOptionIndex
    if (options && options.length >= 2) {
      question.options = options;

      // Validate that the correctOptionIndex still points to a valid option after the update
      if (question.type === 'Q&A' && (question.correctOptionIndex < 0 || question.correctOptionIndex >= options.length)) {
        return res.status(400).json({
          success: false,
          message: 'Correct option index is out of bounds after updating options',
        });
      }
    }

    await question.save();

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update question',
      error: error.message,
    });
  }
};

// Delete a question by ID
const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    await question.delete();

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete question',
      error: error.message,
    });
  }
};

module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
