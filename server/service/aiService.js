const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.gemini_api_key);

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const MODEL_NAME = "gemini-2.5-flash";

async function generateAIResponse(topic, count = 5) {
    console.log('🤖 Generating AI questions with gemini-2.5-flash');

    const prompt = `You are an expert technical interviewer. Generate ${count} challenging interview questions on: "${topic}".

Return ONLY a JSON array like this:
[
  { "qNo": 1, "question": "Your first question here..." },
  { "qNo": 2, "question": "Your second question here..." },
  { "qNo": 3, "question": "Your third question here..." },
  { "qNo": 4, "question": "Your fourth question here..." },
  { "qNo": 5, "question": "Your fifth question here..." }
]

NO OTHER TEXT. JUST THE JSON ARRAY.`;

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            console.log(`🤖 Attempt ${attempts + 1}: Using ${MODEL_NAME}`);
            
            const model = genAI.getGenerativeModel({
                model: MODEL_NAME,
                generationConfig: { 
                    temperature: 0.7, 
                    maxOutputTokens: 4096,
                },
                safetySettings,
            });

            const result = await model.generateContent(prompt);
            const rawText = await result.response.text();
            
            console.log('🤖 Raw response length:', rawText.length);
            
            let cleanText = rawText.trim();
            cleanText = cleanText.replace(/``````/g, '');
            
            const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
            if (!jsonMatch) throw new Error("No JSON array found");
            
            const jsonString = jsonMatch[0];
            const parsed = JSON.parse(jsonString);

            if (!Array.isArray(parsed) || parsed.length === 0) {
                throw new Error("Invalid array");
            }
            
            const validatedQuestions = parsed.map((item, index) => ({
                qNo: item.qNo || index + 1, 
                question: item.question || `Question ${index + 1} about ${topic}`
            }));
            
            console.log(`✅ Generated ${validatedQuestions.length} questions`);
            return validatedQuestions;

        } catch (err) {
            attempts++;
            console.error(`❌ Attempt ${attempts} failed:`, err.message);
            
            if (attempts >= maxAttempts) {
                console.log('⚠️ Using hardcoded questions');
                return getHardcodedQuestions(topic);
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

async function generateCrossQuestion(originalQuestion, userCode, spokenAnswer) {
    console.log('🤖 Generating cross-question with gemini-2.5-flash');

    const prompt = `Based on this interview response, generate ONE follow-up question.

ORIGINAL: "${originalQuestion}"
USER CODE: ${userCode || "None"}
USER ANSWER: "${spokenAnswer || "None"}"

Return ONLY this JSON:
{ "crossQuestion": "Your follow-up question here..." }

NO OTHER TEXT.`;

    try {
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            generationConfig: { temperature: 0.8, maxOutputTokens: 512 },
            safetySettings,
        });

        const result = await model.generateContent(prompt);
        const rawText = await result.response.text();
        
        const cleanText = rawText.trim().replace(/``````/g, '');
        const jsonMatch = cleanText.match(/{[\s\S]*}/);
        
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.crossQuestion) {
                console.log('✅ Generated cross-question');
                return parsed.crossQuestion;
            }
        }
        
        throw new Error("Invalid response");
        
    } catch (error) {
        console.error('❌ Cross-question failed:', error.message);
        return "Can you think of any edge cases or optimizations?";
    }
}

// ✅ ENHANCED AI CONTEXTUAL RESPONSE WITH CODE + TRANSCRIPT ANALYSIS
async function generateContextualResponse(transcript, question, questionPhase, conversationHistory, topic, userCode = "", language = "java") {
    console.log('🤖 AI analyzing transcript + code:', { transcript, userCode, language });

    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
        try {
            const model = genAI.getGenerativeModel({
                model: MODEL_NAME,
                generationConfig: { 
                    temperature: 0.6, 
                    maxOutputTokens: 1000 
                },
                safetySettings,
            });

            // ✅ ENHANCED PROMPT WITH CODE ANALYSIS
            const prompt = `You are conducting a technical interview. Analyze BOTH the candidate's spoken response AND their written code.

QUESTION: "${question.question}"
CANDIDATE SPOKE: "${transcript}"
CANDIDATE'S CODE (${language}):
\`\`\`${language}
${userCode}
\`\`\`

PHASE: ${questionPhase}
TOPIC: ${topic}

ANALYSIS INSTRUCTIONS:
1. Evaluate BOTH the spoken explanation AND the written code
2. Check if the code matches what they explained verbally
3. Look for coding errors, logic issues, or incomplete solutions
4. Consider code quality, efficiency, and best practices
5. If they wrote meaningful code, give more weight to the code than just speech

DECISION RULES:
- If candidate clearly wants to move forward ("next question", "move on", "proceed"), choose MOVE_NEXT
- If candidate provided reasonable code + explanation, choose FOLLOW_UP or MOVE_NEXT
- If code has issues but shows effort, provide constructive CLARIFY feedback
- If both speech and code are minimal/empty, ask for CLARIFY
- If already in follow-up phase and they answered, choose MOVE_NEXT
- AVOID endless clarification loops!

Respond with ONLY this JSON format:
{
  "action": "MOVE_NEXT",
  "response": "I can see you've implemented [specific code analysis]. Let's move to the next question.",
  "shouldMoveToNext": true,
  "reasoning": "Code shows understanding, ready to proceed"
}

Actions: REPEAT_QUESTION, PROVIDE_CLARIFICATION, CLARIFY, FOLLOW_UP, MOVE_NEXT
Set shouldMoveToNext to true ONLY for MOVE_NEXT.

BE DECISIVE and provide specific feedback about their code when possible!`;

            const result = await model.generateContent(prompt);
            const rawText = await result.response.text();
            
            console.log(`🤖 Attempt ${attempts + 1} response:`, rawText);
            
            if (!rawText || rawText.trim().length < 10) {
                throw new Error("Empty or too short response");
            }
            
            let cleanText = rawText.trim().replace(/``````/g, '');
            
            let jsonString = null;
            
            const jsonMatch1 = cleanText.match(/\{[\s\S]*?\}/);
            if (jsonMatch1) {
                jsonString = jsonMatch1[0];
            }
            
            if (!jsonString) {
                const firstBrace = cleanText.indexOf('{');
                const lastBrace = cleanText.lastIndexOf('}');
                if (firstBrace !== -1 && lastBrace !== -1) {
                    jsonString = cleanText.substring(firstBrace, lastBrace + 1);
                }
            }
            
            if (!jsonString) {
                throw new Error("No JSON found in response");
            }
            
            const parsed = JSON.parse(jsonString);
            
            if (!parsed.action || !parsed.response) {
                throw new Error("Missing required fields");
            }
            
            parsed.shouldMoveToNext = parsed.action === 'MOVE_NEXT';
            
            console.log('✅ AI Decision:', parsed.action);
            console.log('✅ AI analyzed code + transcript');
            return parsed;

        } catch (error) {
            attempts++;
            console.error(`❌ Attempt ${attempts} failed:`, error.message);
            
            if (attempts >= maxAttempts) {
                return getSmartFallbackWithCodeAnalysis(transcript, question, questionPhase, userCode, language);
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
}

// ✅ ENHANCED FALLBACK WITH CODE ANALYSIS
function getSmartFallbackWithCodeAnalysis(transcript, question, questionPhase, userCode = "", language = "java") {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    console.log('🔧 Using smart fallback with code analysis for:', { transcript, userCode: !!userCode });
    
    // Check if user wrote meaningful code
    const hasCode = userCode && userCode.trim().length > 50 && !userCode.includes("// Write your") && !userCode.includes("# Write your");
    
    const navigationWords = ['next', 'move', 'proceed', 'continue', 'skip', 'forward'];
    const hasNavigationIntent = navigationWords.some(word => lowerTranscript.includes(word));
    
    if (hasNavigationIntent) {
        console.log('🚀 Clear navigation intent detected - moving forward');
        return {
            action: 'MOVE_NEXT',
            response: 'Understood. Let\'s move to the next question.',
            shouldMoveToNext: true,
            reasoning: 'User clearly wants to proceed'
        };
    }
    
    if (questionPhase === 'followup' && (transcript.length > 15 || hasCode)) {
        console.log('🔄 Already in follow-up phase - preventing loop');
        return {
            action: 'MOVE_NEXT',
            response: 'Thank you for the additional details. Let\'s continue to the next question.',
            shouldMoveToNext: true,
            reasoning: 'Preventing follow-up loop'
        };
    }
    
    // If they wrote code, be more positive
    if (hasCode) {
        return {
            action: 'MOVE_NEXT',
            response: 'I can see you\'ve written some code. Let\'s move to the next question.',
            shouldMoveToNext: true,
            reasoning: 'User provided code solution'
        };
    }
    
    if (transcript.length > 25 && !lowerTranscript.includes('don\'t know') && !lowerTranscript.includes('no idea')) {
        return {
            action: 'MOVE_NEXT',
            response: 'Thank you for your explanation. Let\'s move to the next question.',
            shouldMoveToNext: true,
            reasoning: 'Sufficient verbal response provided'
        };
    }
    
    if (lowerTranscript.includes('repeat') || lowerTranscript.includes('again')) {
        return {
            action: 'REPEAT_QUESTION',
            response: `Let me repeat the question: ${question.question}`,
            shouldMoveToNext: false,
            reasoning: 'User requested repeat'
        };
    }
    
    if (lowerTranscript.includes('don\'t know') || lowerTranscript.includes('no idea') || (transcript.length < 10 && !hasCode)) {
        return {
            action: 'CLARIFY',
            response: 'No problem! Can you try to write some code or explain your approach, or would you like to move to the next question?',
            shouldMoveToNext: false,
            reasoning: 'User needs help but offering code writing or moving on'
        };
    }
    
    return {
        action: 'MOVE_NEXT',
        response: 'Thank you. Let\'s continue to the next question.',
        shouldMoveToNext: true,
        reasoning: 'Default progression to prevent loops'
    };
}

function getHardcodedQuestions(topic) {
    const questionSets = {
        'data-structures-and-algorithms': [
            { qNo: 1, question: "When would you choose a linked list over an array? Discuss time and space complexity trade-offs." },
            { qNo: 2, question: "Explain hash collisions and two collision resolution strategies with their trade-offs." },
            { qNo: 3, question: "What's the difference between stack and queue? Provide real-world examples." },
            { qNo: 4, question: "Explain binary search trees and their time complexity for operations." },
            { qNo: 5, question: "Compare DFS and BFS algorithms. When would you use each?" }
        ],
        'javascript': [
            { qNo: 1, question: "Explain the difference between var, let, and const in JavaScript." },
            { qNo: 2, question: "What is closure in JavaScript? Provide a practical example." },
            { qNo: 3, question: "How does event bubbling work in the DOM?" },
            { qNo: 4, question: "Explain Promises and how they solve callback hell." },
            { qNo: 5, question: "What's the difference between == and === in JavaScript?" }
        ],
        'react': [
            { qNo: 1, question: "What's the difference between state and props in React?" },
            { qNo: 2, question: "Explain React component lifecycle methods." },
            { qNo: 3, question: "What are React Hooks and why are they useful?" },
            { qNo: 4, question: "How does the virtual DOM work in React?" },
            { qNo: 5, question: "What's the purpose of keys in React lists?" }
        ],
        'python': [
            { qNo: 1, question: "What are the differences between lists and tuples in Python?" },
            { qNo: 2, question: "Explain how Python's garbage collection works." },
            { qNo: 3, question: "What are decorators in Python and how do you use them?" },
            { qNo: 4, question: "How do you handle exceptions in Python?" },
            { qNo: 5, question: "What is the difference between deep copy and shallow copy?" }
        ],
        'java': [
            { qNo: 1, question: "Explain the difference between abstract classes and interfaces in Java." },
            { qNo: 2, question: "What is the difference between ArrayList and LinkedList?" },
            { qNo: 3, question: "How does garbage collection work in Java?" },
            { qNo: 4, question: "What are the principles of Object-Oriented Programming?" },
            { qNo: 5, question: "Explain the concept of multithreading in Java." }
        ],
        'dbms': [
            { qNo: 1, question: "What are the different types of SQL joins? Explain with examples." },
            { qNo: 2, question: "What is normalization in databases? Explain 1NF, 2NF, and 3NF." },
            { qNo: 3, question: "What is the difference between clustered and non-clustered indexes?" },
            { qNo: 4, question: "Explain ACID properties in database transactions." },
            { qNo: 5, question: "What is the difference between SQL and NoSQL databases?" }
        ]
    };

    const lowerTopic = topic.toLowerCase();
    
    for (const [key, questions] of Object.entries(questionSets)) {
        if (lowerTopic.includes(key) || lowerTopic.includes(key.replace('-', ' '))) {
            return questions;
        }
    }

    return questionSets['data-structures-and-algorithms'];
}

module.exports = { generateAIResponse, generateCrossQuestion, generateContextualResponse };
