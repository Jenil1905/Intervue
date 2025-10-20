const Interview = require('./../models/interview.model.js');
const { generateAIResponse, generateCrossQuestion, generateContextualResponse } = require('./../service/aiService.js');

// ===== EXISTING FUNCTIONS =====

const startInterview = async (req, res) => {
    try {
        const { topic } = req.params;
        const userId = req.userId;

        const questions = await generateAIResponse(topic);
        
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(500).json({ error: "AI service failed to generate questions." });
        }

        const formattedQuestions = questions.map((q, index) => ({
            qNo: q.qNo || index + 1,
            question: q.question || "No question text provided.", 
            // Your model defaults (userCode: "", etc.) will be applied here
        }));

        const interview = await Interview.create({
            userId,
            topic,
            questions: formattedQuestions,
            currentQIndex: 0,
            totalQuestions: formattedQuestions.length,
            timeLimit: 2400,
            overallStatus: 'inProgress', // From your latest model
            aiSettings: {
                useContextualResponses: true,
                maxFollowUps: 1
            }
        });

        res.status(201).json({
            interviewId: interview._id,
            currentQuestion: interview.questions[0],
            totalQuestions: interview.questions.length,
            timeLimit: 2400
        });

    } catch (err) { 
        console.error("Error starting interview:", err);
        res.status(500).json({ error: "Failed to start interview" });
    }
};

// Save user code
const saveUserCode = async (req, res) => {
    try {
        const { interviewId, questionNo, userCode } = req.body;
        
        await Interview.updateOne(
            { _id: interviewId, 'questions.qNo': questionNo },
            { $set: { 'questions.$.userCode': userCode } }
        );
        
        res.status(200).json({ message: "Code saved." });
    } catch (error) {
        console.error("Error saving code:", error);
        res.status(500).json({ message: "Error saving code." });
    }
};

// Save spoken answer (Legacy)
const saveSpokenAnswer = async (req, res) => {
    try {
        const { interviewId, questionNo, spokenAnswer } = req.body;
        
        await Interview.updateOne(
            { _id: interviewId, 'questions.qNo': questionNo },
            { $set: { 'questions.$.spokenAnswer': spokenAnswer } }
        );
        
        res.status(200).json({ message: "Spoken answer saved." });
    } catch (error) {
        console.error("Error saving spoken answer:", error);
        res.status(500).json({ message: "Error saving spoken answer." });
    }
};

// Save cross-question answer (Legacy)
const saveCrossQuestionAnswer = async (req, res) => {
    try {
        const { interviewId, questionNo, crossQuestionAnswer } = req.body;
        
        await Interview.updateOne(
            { _id: interviewId, 'questions.qNo': questionNo },
            { $set: { 'questions.$.crossQuestionAnswer': crossQuestionAnswer } }
        );
        
        res.status(200).json({ message: "Cross-question answer saved." });
    } catch (error) {
        console.error("Error saving cross-question answer:", error);
        res.status(500).json({ message: "Error saving cross-question answer." });
    }
};

// Submit answer (Legacy)
const submitAnswer = async (req, res) => {
    const { interviewId, currentQuestionNo } = req.body;
    try {
        const interview = await Interview.findById(interviewId);
        if (!interview) return res.status(404).json({ message: "Interview not found" });

        const questionIndex = interview.questions.findIndex(q => q.qNo === currentQuestionNo);
        if (questionIndex === -1) return res.status(404).json({ message: "Question not found" });
        
        const currentQuestion = interview.questions[questionIndex];

        if (!currentQuestion.crossQuestion || currentQuestion.crossQuestion === "") {
            const crossQuestionText = await generateCrossQuestion(
                currentQuestion.question,
                currentQuestion.userCode,
                currentQuestion.spokenAnswer
            );
            interview.questions[questionIndex].crossQuestion = crossQuestionText;
            interview.questions[questionIndex].currentPhase = 'cross'; // Use your new enum
            await interview.save();
            return res.status(200).json({ crossQuestionText: crossQuestionText });
        }
        
        else if (!currentQuestion.crossQuestionAnswer || currentQuestion.crossQuestionAnswer === "") {
            interview.questions[questionIndex].crossQuestionAnswer = currentQuestion.spokenAnswer;
            // Mark as complete
            interview.questions[questionIndex].isComplete = true;
            interview.questions[questionIndex].currentPhase = 'completed';
            
            const nextQuestionIndex = interview.currentQIndex + 1;

            if (nextQuestionIndex >= interview.questions.length) {
                interview.overallStatus = 'completed';
                await interview.save();
                return res.status(200).json({ interviewCompleted: true });
            }

            interview.currentQIndex = nextQuestionIndex;
            interview.questions[nextQuestionIndex].currentPhase = 'main'; // Set next to main
            await interview.save();
            const nextMainQuestion = interview.questions[nextQuestionIndex];
            
            return res.status(200).json({ nextQuestion: nextMainQuestion });
        }
        
        else {
            const nextQuestionIndex = interview.currentQIndex + 1;
            if (nextQuestionIndex >= interview.questions.length) {
                interview.overallStatus = 'completed';
                await interview.save();
                return res.status(200).json({ interviewCompleted: true });
            }
            interview.currentQIndex = nextQuestionIndex;
            await interview.save();
            const nextMainQuestion = interview.questions[nextQuestionIndex];
            return res.status(200).json({ nextQuestion: nextMainQuestion });
        }
    } catch (error) {
        console.error("Error submitting answer:", error);
        res.status(500).json({ message: "Server error during answer submission." });
    }
};

// ===== NEW CONTEXTUAL AI FUNCTIONS =====

// Generate contextual response
const generateContextualResponseController = async (req, res) => {
    try {
        const { 
            transcript, 
            question, 
            questionPhase, 
            interviewId, 
            conversationHistory = [],
            topic 
        } = req.body;
        
        if (!transcript || !question || !interviewId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ error: 'Interview not found' });
        }

        // ✅ FIXED: Removed redundant `if` blocks for "repeat" and "clarify".
        // This is now handled by the AI service (for natural language)
        // or the frontend (for simple commands).

        // Use AI service for complex analysis
        try {
            const contextualResponse = await generateContextualResponse(
                transcript,
                question,
                questionPhase,
                conversationHistory,
                topic
            );
            return res.status(200).json(contextualResponse);
        } catch (aiError) {
            console.error('AI service error, using fallback:', aiError);
            
            // Fallback logic
            if (questionPhase === 'main' && transcript.length > 20) {
                return res.status(200).json({
                    action: 'FOLLOW_UP',
                    response: 'Interesting approach! Can you tell me about any edge cases?',
                    shouldMoveToNext: false,
                    reasoning: 'Fallback follow-up'
                });
            } else {
                return res.status(200).json({
                    action: 'MOVE_NEXT',
                    response: 'Thank you. Let\'s move to the next question.',
                    shouldMoveToNext: true,
                    reasoning: 'Fallback progression'
                });
            }
        }

    } catch (error) {
        console.error('Error generating contextual response:', error);
        res.status(500).json({ 
            action: 'MOVE_NEXT',
            response: 'Thank you. Let\'s move to the next question.',
            shouldMoveToNext: true,
            reasoning: 'Error fallback'
        });
    }
};

// Save conversation message
const saveConversationMessage = async (req, res) => {
    try {
        const { interviewId, questionNo, transcript, role } = req.body;
        
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ error: 'Interview not found' });
        }

        const questionIndex = interview.questions.findIndex(q => q.qNo === questionNo);
        if (questionIndex === -1) {
            return res.status(404).json({ error: 'Question not found' });
        }

        if (!interview.questions[questionIndex].conversationHistory) {
            interview.questions[questionIndex].conversationHistory = [];
        }

        interview.questions[questionIndex].conversationHistory.push({
            role,
            message: transcript,
            timestamp: new Date()
        });

        // Update phase based on your new model
        if (role === 'interviewer' && interview.questions[questionIndex].currentPhase === 'main') {
            interview.questions[questionIndex].currentPhase = 'followup';
        }

        await interview.save();
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error saving conversation:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get next main question
const getNextMainQuestion = async (req, res) => {
    try {
        const { interviewId, currentQuestionNo } = req.body;
        
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ error: 'Interview not found' });
        }

        const currentQuestionIndex = interview.questions.findIndex(q => q.qNo === currentQuestionNo);
        if (currentQuestionIndex === -1) {
            return res.status(404).json({ error: 'Current question not found' });
        }
        
        // Mark current as complete
        interview.questions[currentQuestionIndex].isComplete = true;
        interview.questions[currentQuestionIndex].currentPhase = 'completed';

        const nextQuestionIndex = currentQuestionIndex + 1;
        
        interview.currentQIndex = nextQuestionIndex;
        
        if (nextQuestionIndex >= interview.questions.length) {
            interview.overallStatus = 'completed';
            await interview.save();
            return res.status(200).json({ interviewCompleted: true });
        }
        
        // Reset the next question's phase
        interview.questions[nextQuestionIndex].currentPhase = 'main';
        
        await interview.save();
        
        const nextQuestion = interview.questions[nextQuestionIndex];
        
        res.status(200).json({
            nextQuestion,
            interviewCompleted: false,
            progress: {
                current: nextQuestionIndex + 1,
                total: interview.questions.length
            }
        });
    } catch (error) {
        console.error('Error getting next question:', error);
        res.status(500).json({ error: error.message });
    }
};

// Finalize current question
const finalizeCurrentQuestion = async (req, res) => {
    try {
        const { interviewId, questionNo } = req.body;
        
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ error: 'Interview not found' });
        }

        const questionIndex = interview.questions.findIndex(q => q.qNo === questionNo);
        if (questionIndex !== -1) {
            interview.questions[questionIndex].isComplete = true;
            interview.questions[questionIndex].currentPhase = 'completed';
            await interview.save();
        }
        
        res.status(200).json({ 
            success: true,
            questionStatus: 'completed'
        });
    } catch (error) {
        console.error('Error finalizing question:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ===== EXPORTS =====
module.exports = { 
    startInterview, 
    saveUserCode, 
    saveSpokenAnswer, 
    submitAnswer, 
    saveCrossQuestionAnswer,
    generateContextualResponseController,
    saveConversationMessage,
    getNextMainQuestion,
    finalizeCurrentQuestion
};