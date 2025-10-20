const express = require('express');
const router = express.Router();
const { generateInterviewFeedback } = require('../service/feedbackService.js');
// ✅ PROPER IMPORT OF INTERVIEW MODEL
const Interview = require('../models/interview.model.js');

// ✅ GENERATE INTERVIEW FEEDBACK
router.post('/generate/:interviewId', async (req, res) => {
    try {
        const { interviewId } = req.params;
        const { completionStatus, violationType, totalTimeSpent } = req.body;

        console.log(`📊 Generating feedback for interview: ${interviewId}`);

        // Fetch interview data from database
        const interviewData = await getInterviewData(interviewId);
        
        if (!interviewData) {
            return res.status(404).json({ 
                success: false, 
                message: 'Interview not found' 
            });
        }

        // Add completion status from request
        interviewData.completionStatus = completionStatus || 'incomplete';
        interviewData.violationType = violationType || null;
        interviewData.totalTimeSpent = totalTimeSpent || 0;

        // Generate feedback using AI
        const feedback = await generateInterviewFeedback(interviewData);

        // Save feedback to database
        await saveFeedbackToDatabase(interviewId, feedback);

        res.json({
            success: true,
            data: feedback
        });

    } catch (error) {
        console.error('Error generating feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate feedback',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// ✅ GET EXISTING FEEDBACK
router.get('/:interviewId', async (req, res) => {
    try {
        const { interviewId } = req.params;
        
        const feedback = await getFeedbackFromDatabase(interviewId);
        
        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        res.json({
            success: true,
            data: feedback
        });

    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// ✅ CORRECTED DATABASE FUNCTIONS WITH PROPER ERROR HANDLING
async function getInterviewData(interviewId) {
    try {
        console.log(`🔍 Fetching interview data for ID: ${interviewId}`);
        
        // Validate interviewId format
        if (!interviewId || !interviewId.match(/^[0-9a-fA-F]{24}$/)) {
            console.log(`❌ Invalid interview ID format: ${interviewId}`);
            return null;
        }
        
        // Fetch from database with error handling
        const interview = await Interview.findById(interviewId).lean();
        
        if (!interview) {
            console.log(`❌ Interview not found in database: ${interviewId}`);
            return null;
        }

        console.log(`✅ Found interview with ${interview.questions.length} questions`);

        // Transform data to match AI expectations with proper validation
        const transformedData = {
            interviewId: interview._id.toString(),
            topic: interview.topic || 'Unknown Topic',
            questions: (interview.questions || []).map(q => ({
                qNo: q.qNo || 0,
                question: q.question || 'No question provided'
            })),
            conversations: (interview.questions || []).map(q => {
                // Extract conversation history safely
                const conversationHistory = q.conversationHistory || [];
                
                const candidateMessages = conversationHistory
                    .filter(msg => msg.role === 'candidate')
                    .map(msg => msg.message)
                    .join(' ');
                
                const interviewerMessages = conversationHistory
                    .filter(msg => msg.role === 'interviewer')
                    .map(msg => msg.message)
                    .join(' ');

                return {
                    questionNo: q.qNo || 0,
                    candidateResponse: candidateMessages || q.spokenAnswer || 'No spoken response provided',
                    followUpQuestions: interviewerMessages || q.crossQuestion || 'None',
                    followUpResponses: q.crossQuestionAnswer || 'None'
                };
            }),
            userCodes: (interview.questions || []).map(q => ({
                questionNo: q.qNo || 0,
                code: q.userCode || 'No code provided'
            })),
            // Additional metadata
            overallStatus: interview.overallStatus || 'inProgress',
            currentQIndex: interview.currentQIndex || 0,
            totalQuestions: interview.totalQuestions || interview.questions?.length || 0,
            timeLimit: interview.timeLimit || 2400
        };

        console.log(`✅ Successfully transformed interview data`);
        console.log(`📊 Questions: ${transformedData.questions.length}, Status: ${transformedData.overallStatus}`);
        
        return transformedData;

    } catch (error) {
        console.error('❌ Error in getInterviewData:', error);
        return null;
    }
}

async function saveFeedbackToDatabase(interviewId, feedback) {
    try {
        console.log(`💾 Saving feedback for interview: ${interviewId}`);
        
        // Validate inputs
        if (!interviewId || !feedback) {
            throw new Error('Invalid interviewId or feedback data');
        }

        // Update the interview document with feedback
        const updateResult = await Interview.findByIdAndUpdate(
            interviewId,
            {
                $set: {
                    feedback: feedback,
                    feedbackGeneratedAt: new Date(),
                    overallStatus: 'completed' // Mark as completed when feedback is generated
                }
            },
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!updateResult) {
            throw new Error('Interview not found for feedback update');
        }
        
        console.log(`✅ Feedback saved successfully for interview: ${interviewId}`);
        return updateResult;
        
    } catch (error) {
        console.error('❌ Error saving feedback:', error);
        throw error;
    }
}

async function getFeedbackFromDatabase(interviewId) {
    try {
        console.log(`🔍 Fetching existing feedback for interview: ${interviewId}`);
        
        // Validate interviewId format
        if (!interviewId || !interviewId.match(/^[0-9a-fA-F]{24}$/)) {
            console.log(`❌ Invalid interview ID format: ${interviewId}`);
            return null;
        }
        
        const interview = await Interview.findById(interviewId).lean();
        
        if (!interview) {
            console.log(`❌ Interview not found: ${interviewId}`);
            return null;
        }
        
        if (!interview.feedback) {
            console.log(`ℹ️  No existing feedback found for interview: ${interviewId}`);
            return null;
        }
        
        console.log(`✅ Found existing feedback for interview: ${interviewId}`);
        return interview.feedback;
        
    } catch (error) {
        console.error('❌ Error fetching feedback:', error);
        return null;
    }
}

module.exports = router;
