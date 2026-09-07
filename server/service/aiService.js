const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.gemini_api_key);

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const MODELS = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];

function getModelName(attempt = 0) {
    return MODELS[attempt % MODELS.length] || "gemini-1.5-flash";
}

async function generateAIResponse(topic, count = 5, difficulty = 'intermediate') {
    console.log(`🤖 Generating AI questions (${difficulty.toUpperCase()} level)`);

    let difficultyInstruction = "";
    if (difficulty === 'junior') {
        difficultyInstruction = "TARGET LEVEL: JUNIOR / ENTRY-LEVEL. Focus on fundamental concepts, basic syntax, core data structures, straightforward algorithmic logic, and beginner-friendly practical scenarios. Keep questions accessible yet test basic proficiency.";
    } else if (difficulty === 'senior') {
        difficultyInstruction = "TARGET LEVEL: SENIOR / STAFF EXPERT. Focus on advanced architectural trade-offs, complex edge cases, low-level optimization, concurrency/thread safety, memory bottlenecks, high-scale scenarios, and expert technical design.";
    } else {
        difficultyInstruction = "TARGET LEVEL: MID-LEVEL / INTERMEDIATE. Focus on standard computer science core concepts, optimal data structure selection, medium algorithmic complexity, and practical system trade-offs.";
    }

    const prompt = `You are an expert technical interviewer. Generate ${count} technical interview questions on: "${topic}".

${difficultyInstruction}

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
        const modelName = getModelName(attempts);
        try {
            console.log(`🤖 Attempt ${attempts + 1}: Using ${modelName}`);
            
            const model = genAI.getGenerativeModel({
                model: modelName,
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
            console.error(`❌ Attempt ${attempts} failed with ${modelName}:`, err.message);
            
            if (attempts >= maxAttempts) {
                console.log('⚠️ Using hardcoded questions');
                return getHardcodedQuestions(topic);
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

async function generateCrossQuestion(originalQuestion, userCode, spokenAnswer) {
    console.log('🤖 Generating cross-question');

    const prompt = `Based on this interview response, generate ONE follow-up question.

ORIGINAL: "${originalQuestion}"
USER CODE: ${userCode || "None"}
USER ANSWER: "${spokenAnswer || "None"}"

Return ONLY this JSON:
{ "crossQuestion": "Your follow-up question here..." }

NO OTHER TEXT.`;

    for (let attempts = 0; attempts < MODELS.length; attempts++) {
        const modelName = getModelName(attempts);
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
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
                    console.log(`✅ Generated cross-question with ${modelName}`);
                    return parsed.crossQuestion;
                }
            }
            
            throw new Error("Invalid response");
            
        } catch (error) {
            console.error(`❌ Cross-question failed with ${modelName}:`, error.message);
        }
    }
    return "Can you think of any edge cases or optimizations?";
}

// ✅ ENHANCED AI CONTEXTUAL RESPONSE WITH CODE + TRANSCRIPT ANALYSIS
async function generateContextualResponse(transcript, question, questionPhase, conversationHistory, topic, userCode = "", language = "java") {
    console.log('🤖 AI analyzing transcript + code:', { transcript, userCode, language });

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        const modelName = getModelName(attempts);
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: { 
                    temperature: 0.6, 
                    maxOutputTokens: 350 
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
- IMPORTANT: If candidate asks for clarification, elaboration, explanation, or repeating the question ("elaborate", "explain", "clarify", "repeat", "what do you mean", "could you elaborate"), choose PROVIDE_CLARIFICATION or REPEAT_QUESTION. DO NOT MOVE TO NEXT QUESTION! Set shouldMoveToNext to false.
- If candidate clearly wants to move forward ("next question", "move on", "proceed"), choose MOVE_NEXT. Set shouldMoveToNext to true.
- If candidate provided reasonable code + explanation, choose FOLLOW_UP or MOVE_NEXT.
- If code has issues but shows effort, provide constructive CLARIFY feedback (shouldMoveToNext: false).
- If both speech and code are minimal/empty, ask for CLARIFY (shouldMoveToNext: false).
- If already in follow-up phase and they answered, choose MOVE_NEXT.
- AVOID endless clarification loops!

Respond with ONLY this JSON format:
{
  "action": "MOVE_NEXT",
  "response": "I can see you've implemented [specific code analysis]. Let's move to the next question.",
  "shouldMoveToNext": true,
  "reasoning": "Code shows understanding, ready to proceed"
}

Actions: REPEAT_QUESTION, PROVIDE_CLARIFICATION, CLARIFY, FOLLOW_UP, MOVE_NEXT
Set shouldMoveToNext to true ONLY for MOVE_NEXT. Set shouldMoveToNext to false for REPEAT_QUESTION, PROVIDE_CLARIFICATION, CLARIFY, and FOLLOW_UP.

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

// ✅ ENHANCED FALLBACK WITH CODE ANALYSIS & CLARIFICATION DETECTION
function getSmartFallbackWithCodeAnalysis(transcript, question, questionPhase, userCode = "", language = "java") {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    console.log('🔧 Using smart fallback with code analysis for:', { transcript, userCode: !!userCode });
    
    // Check for clear clarification or repetition requests FIRST
    const repeatWords = ['repeat', 'again', 'pardon', 'say that again', 'say again'];
    const clarificationWords = ['elaborate', 'explain', 'clarify', 'what do you mean', 'could you', 'can you explain', 'don\'t understand', 'more detail'];

    if (repeatWords.some(w => lowerTranscript.includes(w))) {
        return {
            action: 'REPEAT_QUESTION',
            response: `Sure! Let me repeat the question: ${question?.question || 'Please write and explain your solution.'}`,
            shouldMoveToNext: false,
            reasoning: 'Candidate requested question repetition'
        };
    }

    if (clarificationWords.some(w => lowerTranscript.includes(w))) {
        return {
            action: 'PROVIDE_CLARIFICATION',
            response: `To clarify: we are asking for your explanation and code for: "${question?.question || 'this topic'}". Take your time to explain your thought process or write your solution in the code editor.`,
            shouldMoveToNext: false,
            reasoning: 'Candidate requested clarification or elaboration'
        };
    }
    
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
    
    // If they wrote code, acknowledge it positively
    if (hasCode) {
        return {
            action: 'MOVE_NEXT',
            response: 'I can see you\'ve written a code implementation. Let\'s move to the next question.',
            shouldMoveToNext: true,
            reasoning: 'User provided code solution'
        };
    }
    
    if (lowerTranscript.includes('don\'t know') || lowerTranscript.includes('no idea') || (transcript.length < 10 && !hasCode)) {
        return {
            action: 'CLARIFY',
            response: 'No problem! Can you try to write some code or explain your general approach, or would you prefer to move to the next question?',
            shouldMoveToNext: false,
            reasoning: 'User needs help or gave short response'
        };
    }

    if (transcript.length > 25) {
        return {
            action: 'MOVE_NEXT',
            response: 'Thank you for your response. Let\'s move to the next question.',
            shouldMoveToNext: true,
            reasoning: 'Sufficient verbal response provided'
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
    const topicFormatted = (topic || '').toLowerCase().replace(/_/g, '-').trim();

    const questionSets = {
        'operating-systems': [
            { qNo: 1, question: "Explain the difference between a process and a thread. How is context switching managed by the OS kernel?" },
            { qNo: 2, question: "What is Deadlock in Operating Systems? Describe the four necessary conditions for deadlock to occur." },
            { qNo: 3, question: "Explain Virtual Memory and Paging. What is a Page Fault and how does the OS handle it?" },
            { qNo: 4, question: "What are Mutexes and Semaphores? Contrast binary semaphores with counting semaphores." },
            { qNo: 5, question: "Compare CPU scheduling algorithms like Round Robin, FCFS, Shortest Job First, and Priority Scheduling." }
        ],
        'computer-networks': [
            { qNo: 1, question: "Explain the 7 layers of the OSI model and contrast them with the TCP/IP protocol suite." },
            { qNo: 2, question: "What are the main differences between TCP and UDP? Give real-world application examples for each." },
            { qNo: 3, question: "Describe the TCP 3-way handshake process for establishing a reliable connection." },
            { qNo: 4, question: "How does DNS resolution work step-by-step when a user types a URL in their browser?" },
            { qNo: 5, question: "What is the difference between HTTP, HTTPS, and how TLS/SSL encryption works?" }
        ],
        'c++': [
            { qNo: 1, question: "Explain pointers and references in C++. What are memory leaks and how do smart pointers prevent them?" },
            { qNo: 2, question: "What is Object-Oriented Programming in C++? Explain virtual functions, dynamic binding, and vtables." },
            { qNo: 3, question: "What are C++ STL containers? Compare std::vector, std::list, std::map, and std::unordered_map." },
            { qNo: 4, question: "Explain the RAII (Resource Acquisition Is Initialization) idiom in C++ with a practical code example." },
            { qNo: 5, question: "What is operator overloading and copy vs move semantics (Rvalue references) in modern C++?" }
        ],
        'data-structures-and-algorithms': [
            { qNo: 1, question: "When would you choose a linked list over an array? Discuss time and space complexity trade-offs." },
            { qNo: 2, question: "Explain hash collisions and two collision resolution strategies with their trade-offs." },
            { qNo: 3, question: "What's the difference between stack and queue? Provide real-world application examples." },
            { qNo: 4, question: "Explain binary search trees and their time complexity for insertion, deletion, and searching." },
            { qNo: 5, question: "Compare DFS and BFS algorithms on graphs. When would you use each?" }
        ],
        'javascript': [
            { qNo: 1, question: "Explain the difference between var, let, and const in JavaScript including hoisting and scope." },
            { qNo: 2, question: "What is closure in JavaScript? Provide a practical code example." },
            { qNo: 3, question: "How does the JavaScript Event Loop, Call Stack, and Task Queue work for async operations?" },
            { qNo: 4, question: "Explain Promises and Async/Await in JavaScript and how they handle errors." },
            { qNo: 5, question: "What's the difference between == and === in JavaScript, and what is implicit type coercion?" }
        ],
        'react': [
            { qNo: 1, question: "What's the difference between state and props in React? How is unidirectional data flow maintained?" },
            { qNo: 2, question: "Explain React Hooks (useState, useEffect, useMemo, useCallback) and the rules of hooks." },
            { qNo: 3, question: "How does the Virtual DOM and Reconciliation algorithm (Diffing) work in React?" },
            { qNo: 4, question: "What are controlled vs uncontrolled components in React forms?" },
            { qNo: 5, question: "What is the purpose of the 'key' prop in React lists and why shouldn't index be used as a key?" }
        ],
        'python': [
            { qNo: 1, question: "What are the key differences between lists, tuples, sets, and dictionaries in Python?" },
            { qNo: 2, question: "Explain how Python's memory management and Garbage Collection (reference counting + cyclic GC) work." },
            { qNo: 3, question: "What are decorators and generators in Python? Provide an example of yield vs return." },
            { qNo: 4, question: "What is the GIL (Global Interpreter Lock) in Python and how does it affect multithreading?" },
            { qNo: 5, question: "What is the difference between deep copy and shallow copy in Python?" }
        ],
        'java': [
            { qNo: 1, question: "Explain the difference between abstract classes and interfaces in Java (including default methods in Java 8+)." },
            { qNo: 2, question: "What is the difference between ArrayList, LinkedList, HashMap, and ConcurrentHashMap in Java?" },
            { qNo: 3, question: "How does the Java Virtual Machine (JVM) garbage collector work (Heap, Metaspace, GC algorithms)?" },
            { qNo: 4, question: "What are the core OOP principles (Encapsulation, Inheritance, Polymorphism, Abstraction) in Java?" },
            { qNo: 5, question: "Explain multithreading in Java, volatile keyword, synchronized blocks, and Thread Pools." }
        ],
        'dbms': [
            { qNo: 1, question: "What are the different types of SQL joins (INNER, LEFT, RIGHT, FULL OUTER)? Explain with examples." },
            { qNo: 2, question: "What is normalization in databases? Explain 1NF, 2NF, 3NF, and BCNF with examples." },
            { qNo: 3, question: "What is the difference between clustered and non-clustered indexes in Relational Databases?" },
            { qNo: 4, question: "Explain ACID properties in database transactions and transaction isolation levels." },
            { qNo: 5, question: "What is the difference between SQL (RDBMS) and NoSQL (Document/Key-Value) databases?" }
        ]
    };

    // Topic alias matching
    if (topicFormatted.includes('operating') || topicFormatted.includes('os')) return questionSets['operating-systems'];
    if (topicFormatted.includes('network') || topicFormatted.includes('computer-network')) return questionSets['computer-networks'];
    if (topicFormatted.includes('c++') || topicFormatted.includes('cpp')) return questionSets['c++'];
    if (topicFormatted.includes('data') || topicFormatted.includes('dsa') || topicFormatted.includes('algorithm')) return questionSets['data-structures-and-algorithms'];
    if (topicFormatted.includes('javascript') || topicFormatted.includes('js')) return questionSets['javascript'];
    if (topicFormatted.includes('react')) return questionSets['react'];
    if (topicFormatted.includes('python')) return questionSets['python'];
    if (topicFormatted.includes('java') && !topicFormatted.includes('script')) return questionSets['java'];
    if (topicFormatted.includes('dbms') || topicFormatted.includes('sql') || topicFormatted.includes('database')) return questionSets['dbms'];

    // Dynamic fallback for any unlisted topic
    const topicTitle = topic.replace(/-/g, ' ').toUpperCase();
    return [
        { qNo: 1, question: `What are the core concepts and fundamental architecture of ${topicTitle}?` },
        { qNo: 2, question: `What are common performance bottlenecks and design trade-offs in ${topicTitle}?` },
        { qNo: 3, question: `Explain best practices, error handling, and debugging strategies in ${topicTitle}.` },
        { qNo: 4, question: `How would you design a scalable production component using ${topicTitle}?` },
        { qNo: 5, question: `Compare ${topicTitle} with alternative tools or frameworks in the industry.` }
    ];
}

module.exports = { generateAIResponse, generateCrossQuestion, generateContextualResponse };
