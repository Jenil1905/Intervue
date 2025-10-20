const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone_number: {type: String},
    profile_picture: {type: String},
} , {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;