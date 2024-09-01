const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');  // Assuming you have an authentication middleware
const {  createOption,updateOption,deleteOption} = require('../controller/option');

// Route to create an option
router.post('/createOption',verifyToken,createOption);

// Route to update an option
router.put('/updateOption/:optionId',verifyToken,updateOption);

// Route to delete an option
router.delete('/deleteOption/:optionId',verifyToken,deleteOption);

module.exports = router;
