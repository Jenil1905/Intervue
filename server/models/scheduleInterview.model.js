const mongoose = require('mongoose')

const scheduleInterviewSchema = new mongoose.Schema({
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Add an index for faster queries by user
    },
    topic: {
        type: String,
        required: true,
        trim: true
    },
    scheduledTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    reminderSent: { 
        type: Boolean,
        default: false
    }
}, {timestamps:true})

const ScheduleInterview = mongoose.model('ScheduleInterview', scheduleInterviewSchema)

module.exports = ScheduleInterview