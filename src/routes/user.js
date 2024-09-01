const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validateUser');
const verifyToken = require('../middleware/verifyToken');

const {
    getUser,
    getUsers,
    registerUser,
    loginUser,
    updateUser
}= require('../controller/user');

router.get('/users',getUsers);

router.get('/user/:id',getUser);

router.post('/register',validateUser,registerUser);

router.post('/login',loginUser);

router.put('/updateUser/:id',verifyToken,updateUser);

console.log('User routes registered');

module.exports= router;


