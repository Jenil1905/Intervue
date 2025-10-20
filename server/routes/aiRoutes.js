const express = require('express');
const {generateQuestions} = require('../controllers/aiController.js');
const router = express.Router();
const isAuth = require('./../middlewares/isAuth.js')

router.get('/generate-questions/:topic',isAuth, generateQuestions);

module.exports = router;
