const Interview = require('./../models/interview.model.js');

async function getInterviewById(req, res) {
    try {
        const { interviewId } = req.params;
        const userId = req.userId;

        // Find the interview by ID and ensure it belongs to the current user
        const interview = await Interview.findOne({ 
            _id: interviewId, 
            userId: userId,
            overallStatus: 'inProgress'
        });

        if (!interview) {
            return res.status(404).json({ error: "Interview not found or already completed" });
        }

        // Calculate time left
        const timeLimit = 2400; // 40 minutes in seconds
        const startedAt = new Date(interview.startedAt);
        const now = new Date();
        const elapsedSeconds = Math.floor((now - startedAt) / 1000);
        const timeLeft = Math.max(0, timeLimit - elapsedSeconds);

        // Send interview data to client
        res.status(200).json({
            interviewId: interview._id,
            currentQuestion: interview.questions[interview.currentQIndex],
            totalQuestions: interview.questions.length,
            timeLeft: timeLeft,
            topic: interview.topic
        });

    } catch (err) { 
        console.error("Error retrieving interview:", err);
        res.status(500).json({ error: "Failed to retrieve interview" });
    }
}

module.exports = getInterviewById;
