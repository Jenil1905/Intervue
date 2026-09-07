import axiosClient from './axiosClient.js';

// ✅ GENERATE INTERVIEW FEEDBACK
export const generateInterviewFeedback = async (interviewId, completionData) => {
    try {
        console.log('📊 Generating feedback for interview:', interviewId);
        
        const response = await axiosClient.post(
            `/api/feedback/generate/${interviewId}`,
            completionData
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
        
        const response = await axiosClient.get(`/api/feedback/${interviewId}`);
        
        return response.data;
    } catch (error) {
        console.error('Error fetching feedback:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch feedback');
    }
};
