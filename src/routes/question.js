const express = require('express');
const router = express.Router();
const {createQuestion,updateQuestion,deleteQuestion} = require('../controller/question');
const verifyToken = require('../middleware/verifyToken');

// Route to create a question
router.post('/createQuestion', verifyToken,createQuestion);

// Route to update a question
router.put('/updateQuestion/:questionId', verifyToken,updateQuestion);

// Route to delete a question
router.delete('/daleteQuestion/:questionId', verifyToken,deleteQuestion);

module.exports = router;
