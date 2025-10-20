import axios from "axios";
import { API_BASE_URL } from "./config";

// Interceptors (helps in sending cookies and credentials with every request)
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// ===== EXISTING FUNCTIONS =====

export const startInterview = (topic) => {
    return api.post(`/api/interview/start/${topic}`);
};

export const getInterviewHistory = () => {
    return api.get(`/api/interview/get-history`);
};

export const saveUserCode = (interviewId, questionNo, userCode) => {
    return api.patch('/api/interview/save-code', { interviewId, questionNo, userCode });
};

export const saveSpokenAnswer = (interviewId, questionNo, spokenAnswer) => {
    return api.patch('/api/interview/save-spoken-answer', { interviewId, questionNo, spokenAnswer });
};

export const submitAnswer = (interviewId, currentQuestionNo) => {
    return api.post('/api/interview/submit-answer', { interviewId, currentQuestionNo });
};

export const saveCrossQuestionAnswer = (interviewId, questionNo, crossQuestionAnswer) => {
    return api.patch('/api/interview/save-cross-question-answer', { interviewId, questionNo, crossQuestionAnswer });
};

// ===== NEW CONTEXTUAL AI FUNCTIONS =====

export const generateContextualResponse = async (transcript, question, questionPhase, interviewId, conversationHistory, questionNumber, topic) => {
  try {
    const response = await api.post('/api/interview/generate-contextual-response', {
      transcript,
      question,
      questionPhase,
      interviewId,
      conversationHistory,
      questionNumber,
      topic
    });

    return response.data;
  } catch (error) {
    console.error('Error generating contextual response:', error);
    return {
      action: 'MOVE_NEXT',
      response: 'Thank you for your answer. Let\'s move to the next question.',
      shouldMoveToNext: true,
      reasoning: 'API error fallback'
    };
  }
};

export const saveConversationMessage = async (interviewId, questionNo, transcript, role, currentQuestion) => {
  try {
    const response = await api.post('/api/interview/save-conversation', {
      interviewId,
      questionNo,
      transcript,
      role,
      currentQuestion
    });

    return response.data;
  } catch (error) {
    console.error('Error saving conversation:', error);
    return { success: false };
  }
};

export const getNextMainQuestion = async (interviewId, currentQuestionNo, topic) => {
  try {
    const response = await api.post('/api/interview/get-next-question', {
      interviewId,
      currentQuestionNo,
      topic
    });

    return response.data;
  } catch (error) {
    console.error('Error getting next question:', error);
    throw error;
  }
};

export const finalizeCurrentQuestion = async (interviewId, questionNo) => {
  try {
    const response = await api.post('/api/interview/finalize-question', {
      interviewId,
      questionNo
    });

    return response.data;
  } catch (error) {
    console.error('Error finalizing question:', error);
    return { success: false };
  }
};

// ===== SIMPLE INTENT DETECTION (Frontend Fallback) =====

export const detectSimpleIntent = (transcript) => {
  const lowerTranscript = transcript.toLowerCase().trim();
  
  const repeatPatterns = [
    'repeat the question',
    'can you repeat',
    'say that again',
    'repeat that',
    'what was the question',
    'could you repeat',
    'repeat please',
    'say again'
  ];
  
  const clarificationPatterns = [
    'what do you mean',
    'can you explain',
    'i don\'t understand',
    'clarify',
    'what is',
    'how do',
    'can you clarify'
  ];
  
  for (const pattern of repeatPatterns) {
    if (lowerTranscript.includes(pattern)) {
      return {
        intent: 'REPEAT_REQUEST',
        action: 'REPEAT_QUESTION',
        shouldMoveToNext: false,
        response: null // Will be filled by the component
      };
    }
  }
  
  for (const pattern of clarificationPatterns) {
    if (lowerTranscript.includes(pattern)) {
      return {
        intent: 'CLARIFICATION_REQUEST',
        action: 'PROVIDE_CLARIFICATION',
        shouldMoveToNext: false,
        response: null // Will be filled by the component
      };
    }
  }
  
  return {
    intent: 'ANSWER',
    action: 'PROCESS_ANSWER',
    shouldMoveToNext: true
  };
};
