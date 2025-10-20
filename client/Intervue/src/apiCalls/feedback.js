import axios from 'axios';
import { API_BASE_URL } from './config';

// ✅ GENERATE INTERVIEW FEEDBACK
export const generateInterviewFeedback = async (interviewId, completionData) => {
    try {
        console.log('📊 Generating feedback for interview:', interviewId);
        
        const response = await axios.post(
            `${API_BASE_URL}/feedback/generate/${interviewId}`,
            completionData,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        
        return response.data;
    } catch (error) {
        console.error('Error generating feedback:', error);
        throw new Error(error.response?.data?.message || 'Failed to generate feedback');
    }
};

// ✅ GET EXISTING FEEDBACK
export const getInterviewFeedback = async (interviewId) => {
    try {
        console.log('🔍 Fetching feedback for interview:', interviewId);
        
        const response = await axios.get(`${API_BASE_URL}/feedback/${interviewId}`);
        
        return response.data;
    } catch (error) {
        console.error('Error fetching feedback:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch feedback');
    }
};
