const Interview = require('./../models/interview.model.js')

async function getInterviewHistory(req,res){
    try{
        const userId = req.userId
        const interviews = await Interview.find({userId: userId}).sort({createdAt:-1})
        if(!interviews){
            return res.status(404).json({message:"No interview found"})
        }
        res.status(200).json({interviews})
    }catch(error){
        res.status(500).json({message:"Server error"})
    }
}

module.exports = getInterviewHistory