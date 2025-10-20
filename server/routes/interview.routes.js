const express = require('express')
const router = express.Router()
const {startInterview, saveUserCode,saveSpokenAnswer, submitAnswer, saveCrossQuestionAnswer,generateContextualResponseController, saveConversationMessage, 
getNextMainQuestion, finalizeCurrentQuestion
 } = require('./../controllers/interviewController.js')
const isAuth = require('./../middlewares/isAuth.js')
const getInterviewHistory = require('./../controllers/interview.controller.js')

router.post('/start/:topic' ,isAuth, startInterview)
router.get('/get-history', isAuth , getInterviewHistory)
router.patch('/save-code', isAuth , saveUserCode)
router.patch('/save-spoken-answer', isAuth , saveSpokenAnswer)
router.patch('/save-cross-question-answer', isAuth , saveCrossQuestionAnswer)
router.post('/submit-answer', isAuth , submitAnswer)
router.post('/generate-contextual-response', isAuth, generateContextualResponseController);
router.post('/save-conversation', isAuth, saveConversationMessage);
router.post('/get-next-question', isAuth, getNextMainQuestion);
router.post('/finalize-question', isAuth, finalizeCurrentQuestion);


module.exports = router