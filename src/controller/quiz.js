const Quiz = require('../model/quiz');  // Assuming your quiz schema is in the models folder
const User = require('../model/user');  // Assuming your user schema is in the models folder
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Create a new quiz
const createQuiz = async (req, res) => {
  try {
    const { quizName, questions } = req.body;
    const userId = req.user._id;

    // Log the received questions
    console.log('Received questions:', questions);

    const validatedQuestions = questions.map(question => {
      if (!question.questionType) {
        throw new Error('Each question must have a questionType');
      }
      // Log the question type for each question
      console.log('Question Type:', question.questionType);
    
      return {
        ...question,
        questionType: question.questionType,
        timer: question.timer || 0
      };
    });

    // Create the new quiz
    const newQuiz = new Quiz({
      quizName,
      questions: validatedQuestions,
      createdBy: userId,
    });

    await newQuiz.save();

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quiz: newQuiz,
    });
    console.log('Quiz:', newQuiz);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create quiz',
      error: error.message,
    });
  }
};


const getQuiz = async (req,res)=>{
  try{
    const quiz = await Quiz.findById(req.params.id);
    console.log('req.params.id:',req.params.id);
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }

    quiz.views += 1;
    console.log('Incremented views:', quiz.views);

    // Save the updated quiz
    await quiz.save();
    console.log('Updated quiz:', quiz);
    
    res.json(quiz);

  }catch(error){
    res.status(500).send('Server error');
  }
}

const getQuizzes = async (req,res)=>{
  try{
    const userId = req.user.id;

    const quizzes = await Quiz.find({ createdBy: userId })
    .select('quizName createdDate views questions.totalImpressions')
    .sort({ createdDate: 1 }); // Sort by most recent

  if (!quizzes.length) {
    return res.status(404).json({ message: 'No quizzes found for this user' });
  }

  res.json(quizzes);


  }catch(error){
    res.status(500).json({ message: 'Error fetching quizzes', error });
  }
}          

// Delete a quiz by ID
const deleteQuiz = async (req, res) => {
  try {
    const quizId  = req.params.id
    const userId = req.user._id;  // Assuming the user's ID is attached to req.user after authentication
    console.log('Deleting quiz with ID:', quizId);
    console.log('User ID:', userId);

    // Find the quiz to delete
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      console.log('Quiz not found');
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    // Ensure the user deleting the quiz is the creator
    if (quiz.createdBy.toString() !== userId.toString()) {
      console.log('Unauthorized deletion attempt');
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this quiz',
      });
    }

    // Delete the quiz
    await quiz.deleteOne();
    console.log('Quiz deleted successfully');

    // Update the user's quiz count and total questions
    const user = await User.findById(userId);
    user.quizzesCreated -= 1;
    user.totalQuestions -= quiz.questions.length;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting quiz:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete quiz',
      error: error.message,
    });
  }
};

// Assuming you're using Mongoose

const recordAnswer = async (req, res) => {
  const { quizId, questionId, selectedOptionId, selectedCount } = req.body;
  console.log('req.body:', req.body);

  try {
    const quiz = await Quiz.findOneAndUpdate(
      { _id: quizId, "questions._id": questionId, "questions.options._id": selectedOptionId },
      {
        $set: { "questions.$.options.$[option].selectedCount": selectedCount }
      },
      { arrayFilters: [{ "option._id": selectedOptionId }], new: true }
    );

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or Option/Question not found' });
    }

    const question = quiz.questions.id(questionId);
    console.log('Question Type:', question.questionType); // Log the question type

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.totalImpressions += 1;

    if (question.questionType === 'Qna') {
      if (question.correctAnswerIndex === selectedOptionId) {
        question.correctCount += 1;
      } else {
        question.incorrectCount += 1;
      }
    } else if (question.questionType === 'Poll') {
      const selectedOption = question.options.id(selectedOptionId);
      if (selectedOption) {
        selectedOption.selectedCount += 1;
      } else {
        return res.status(404).json({ message: 'Selected option not found' });
      }
    } else {
      console.error('Invalid question type:', question.questionType); // Log the invalid type
      return res.status(400).json({ message: 'Invalid question type' });
    }

    await quiz.save();

    res.status(200).json({ message: 'Answer recorded successfully' });
  } catch (error) {
    console.error('Error recording answer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;

    // Validate that quizId is a valid ObjectId
    if (!ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz ID',
      });
    }

    const { quizName, questions } = req.body;

    // Validate and prepare questions
    const validatedQuestions = questions.map((question) => {
      if (!question.questionType) {
        throw new Error('Each question must have a questionType');
      }
      return {
        ...question,
        questionType: question.questionType,
        timer: question.timer || 0
      };
    });

    // Find and update the quiz
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { quizName, questions: validatedQuestions },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      quiz: updatedQuiz,
    });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update quiz',
      error: error.message,
    });
  }
};


module.exports = {
  createQuiz,
  deleteQuiz,
  getQuiz,
  recordAnswer,
  getQuizzes,
  updateQuiz,  // Export the updateQuiz function
};

