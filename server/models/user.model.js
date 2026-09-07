const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone_number: {type: String},
    profile_picture: {type: String},
    settings: {
        emailReminders: { type: Boolean, default: true },
        performanceDigests: { type: Boolean, default: true },
        difficulty: { type: String, enum: ['junior', 'intermediate', 'senior'], default: 'intermediate' },
        feedbackDepth: { type: String, enum: ['concise', 'detailed'], default: 'detailed' },
        autoVoice: { type: Boolean, default: true },
        speechRate: { type: String, default: '1.0' }
    }
} , {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;