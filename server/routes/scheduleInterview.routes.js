const express = require('express')
const router = express.Router()
const {scheduleInterviews, getScheduledInterviews} = require('./../controllers/scheduleInterview.controller.js')
const isAuth = require('./../middlewares/isAuth.js')


router.post('/schedule', isAuth, scheduleInterviews);
router.get('/scheduled', isAuth, getScheduledInterviews);

module.exports = router