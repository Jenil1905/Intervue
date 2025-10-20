const mongoose = require('mongoose');

async function connectDB(dbUrl) {
    return await mongoose.connect(dbUrl)
    .then(()=>{console.log('Connected to MongoDB')})
    .catch((err)=>{console.log(err)});
}

module.exports = connectDB;