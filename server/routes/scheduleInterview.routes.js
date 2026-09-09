const express = require('express')
const router = express.Router()
const {scheduleInterviews, getScheduledInterviews, deleteScheduledInterview} = require('./../controllers/scheduleInterview.controller.js')
const isAuth = require('./../middlewares/isAuth.js')


router.post('/schedule', isAuth, scheduleInterviews);
router.get('/scheduled', isAuth, getScheduledInterviews);
router.delete('/scheduled/:id', isAuth, deleteScheduledInterview);

module.exports = router