const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.gemini_api_key);

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const MODEL_NAME = "gemini-2.5-flash";

// ✅ GENERATE COMPREHENSIVE INTERVIEW FEEDBACK
async function generateInterviewFeedback(interviewData) {
    console.log('🔍 Generating comprehensive interview feedback with Gemini');

    const { 
        interviewId, 
        topic, 
        questions, 
        conversations, 
        userCodes, 
        completionStatus, 
        totalTimeSpent,
        violationType 
    } = interviewData;

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            console.log(`🤖 Attempt ${attempts + 1}: Generating feedback with ${MODEL_NAME}`);
            
            const model = genAI.getGenerativeModel({
                model: MODEL_NAME,
                generationConfig: { 
                    temperature: 0.7, 
                    maxOutputTokens: 4000,
                },
                safetySettings,
            });

            // ✅ COMPREHENSIVE FEEDBACK PROMPT
            const prompt = `You are an expert technical interviewer providing detailed feedback. Analyze this interview comprehensively.

INTERVIEW DETAILS:
Topic: ${topic}
Completion Status: ${completionStatus}
${violationType ? `Violation Type: ${violationType}` : ''}
Total Time Spent: ${totalTimeSpent} minutes

QUESTIONS AND RESPONSES:
${questions.map((q, index) => {
    const conversation = conversations.find(c => c.questionNo === q.qNo) || {};
    const userCode = userCodes.find(c => c.questionNo === q.qNo)?.code || "No code provided";
    
    return `
QUESTION ${q.qNo} (Topic: ${topic}):
Question: "${q.question}"
Candidate's Spoken Response: "${conversation.candidateResponse || 'No response provided'}"
Candidate's Code:
\`\`\`
${userCode}
\`\`\`
AI Follow-up Questions Asked: ${conversation.followUpQuestions || 'None'}
Candidate's Follow-up Responses: "${conversation.followUpResponses || 'None'}"
`;
}).join('\n')}

EVALUATION CRITERIA:
Each question carries 20 marks (Total: 100 marks). Evaluate based on:
1. Technical Accuracy (8 marks)
2. Code Quality & Implementation (6 marks) 
3. Communication & Explanation (4 marks)
4. Problem-solving Approach (2 marks)

FEEDBACK REQUIREMENTS:
- If interview was terminated/incomplete, clearly state this with reason
- For each completed question, provide marks breakdown and specific feedback
- Highlight strengths and areas for improvement
- Give actionable suggestions for each question
- Provide overall assessment and recommendations

Return ONLY this JSON structure:
{
  "overallScore": 85,
  "totalQuestions": 5,
  "completedQuestions": 4,
  "interviewStatus": "completed|terminated|incomplete",
  "terminationReason": "tab_switching|fullscreen_exit|time_expired|user_ended|null",
  "overallFeedback": "Comprehensive overall assessment...",
  "strengths": ["Strong technical knowledge", "Good communication"],
  "improvements": ["Better code optimization", "More detailed explanations"],
  "questionFeedback": [
    {
      "questionNo": 1,
      "question": "Original question text",
      "marksAwarded": 16,
      "maxMarks": 20,
      "breakdown": {
        "technicalAccuracy": {"score": 7, "maxScore": 8, "feedback": "Good understanding but missed edge cases"},
        "codeQuality": {"score": 5, "maxScore": 6, "feedback": "Clean code but could be more efficient"},
        "communication": {"score": 3, "maxScore": 4, "feedback": "Clear explanation but lacked detail"},
        "problemSolving": {"score": 1, "maxScore": 2, "feedback": "Basic approach, could explore alternatives"}
      },
      "detailedFeedback": "Specific feedback for this question...",
      "suggestions": ["Suggestion 1", "Suggestion 2"]
    }
  ],
  "recommendations": "Overall career and learning recommendations..."
}

NO OTHER TEXT. JUST THE JSON.`;

            const result = await model.generateContent(prompt);
            const rawText = await result.response.text();
            
            console.log('🤖 Raw feedback response length:', rawText.length);
            
            // Extract JSON
            let cleanText = rawText.trim();
            cleanText = cleanText.replace(/``````/g, '');
            
            const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("No JSON found in response");
            
            const jsonString = jsonMatch[0];
            const parsed = JSON.parse(jsonString);

            // Validate structure
            if (!parsed.overallScore || !parsed.questionFeedback || !Array.isArray(parsed.questionFeedback)) {
                throw new Error("Invalid feedback structure");
            }
            
            console.log(`✅ Generated feedback with overall score: ${parsed.overallScore}`);
            return parsed;

        } catch (err) {
            attempts++;
            console.error(`❌ Feedback generation attempt ${attempts} failed:`, err.message);
            
            if (attempts >= maxAttempts) {
                console.log('⚠️ Using fallback feedback');
                return generateFallbackFeedback(interviewData);
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

// ✅ FALLBACK FEEDBACK FOR API FAILURES
function generateFallbackFeedback(interviewData) {
    const { questions, completionStatus, violationType } = interviewData;
    
    return {
        overallScore: completionStatus === 'completed' ? 70 : 30,
        totalQuestions: questions.length,
        completedQuestions: completionStatus === 'completed' ? questions.length : Math.floor(questions.length / 2),
        interviewStatus: completionStatus,
        terminationReason: violationType || null,
        overallFeedback: completionStatus === 'completed' 
            ? "Thank you for completing the interview. This is a basic assessment as our detailed analysis system is temporarily unavailable."
            : "Interview was not completed. Please attempt the full interview for comprehensive feedback.",
        strengths: ["Participated in the interview", "Showed technical interest"],
        improvements: ["Complete the full interview", "Provide more detailed responses"],
        questionFeedback: questions.map((q, index) => ({
            questionNo: q.qNo,
            question: q.question,
            marksAwarded: completionStatus === 'completed' ? 14 : 6,
            maxMarks: 20,
            breakdown: {
                technicalAccuracy: {score: 6, maxScore: 8, feedback: "Basic assessment due to system limitation"},
                codeQuality: {score: 4, maxScore: 6, feedback: "Code review pending"},
                communication: {score: 3, maxScore: 4, feedback: "Communication needs improvement"},
                problemSolving: {score: 1, maxScore: 2, feedback: "Problem-solving approach unclear"}
            },
            detailedFeedback: "Detailed feedback temporarily unavailable. Please retake the interview for comprehensive analysis.",
            suggestions: ["Practice more problems", "Improve explanation skills"]
        })),
        recommendations: "Practice coding problems and improve communication skills for better interview performance."
    };
}

module.exports = { generateInterviewFeedback };
