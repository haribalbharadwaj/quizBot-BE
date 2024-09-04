const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

const {createQuiz,deleteQuiz,getQuiz,recordAnswer,getQuizzes,updateQuiz} = require('../controller/quiz');

// Route to create a quiz
router.post('/createQuiz', verifyToken,createQuiz);

// Route to delete a quiz
router.delete('/deleteQuiz/:id', verifyToken,deleteQuiz);

router.get('/quiz/:id',getQuiz);

router.post('/recordAnswer',recordAnswer);

router.get('/quizzes',verifyToken,getQuizzes);

router.put('/updateQuiz/:id',verifyToken,updateQuiz);

module.exports = router;
