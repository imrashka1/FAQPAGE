const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/faq', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define Schema
const questionSchema = new mongoose.Schema({
    question: String,
    answer: String
});

const Question = mongoose.model('Question', questionSchema);

// Serve static files
app.use(express.static('faq-page'));

// API endpoint to submit a question
app.post('/api/questions', (req, res) => {
    const newQuestion = new Question({ question: req.body.question, answer: '' });
    newQuestion.save((err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send('Question submitted');
    });
});

// API endpoint to get all questions
app.get('/api/questions', (req, res) => {
    Question.find({}, (err, questions) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(questions);
    });
});

// API endpoint for admin to answer a question
app.post('/api/answer', (req, res) => {
    Question.findByIdAndUpdate(req.body.id, { answer: req.body.answer }, (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send('Answer submitted');
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
