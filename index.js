const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const userRoutes = require('./src/routes/user');
const quizRoutes = require('./src/routes/quiz');
const questionRoutes = require('./src/routes/question');
const optionRoutes = require('./src/routes/option');
const errorHandler = require('./src/middleware/errorHandler');
const verifyToken = require('./src/middleware/verifyToken');


dotenv.config();


const corsOptions = {
    origin: 'https://quiz-bot-fe.vercel.app', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware for JSON and URL encoding
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/user', userRoutes);
app.use('/quiz',quizRoutes);
app.use('/question',questionRoutes);
app.use('/option',optionRoutes);

// Error handling middleware
app.use(errorHandler);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'QuizBot app is working fine',
        status: 'Server is up',
        now: new Date().toLocaleDateString()
    });
});

// Debug route with token verification
app.get('/debug', verifyToken, (req, res) => {
    res.json({
        status: 'DEBUG',
        userId: req.refUserId
    });
});

// Log all routes (for debugging purposes)
app._router.stack.forEach(function (r) {
    if (r.route && r.route.path) {
        console.log(r.route.path);
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MongoDBUrl)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((error) => {
        console.error('Mongodb connection error', error);
    });

// Start the server
const Port = process.env.PORT || 4000;
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});
