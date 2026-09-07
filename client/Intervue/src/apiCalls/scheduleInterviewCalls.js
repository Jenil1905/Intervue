import axiosClient from "./axiosClient.js";

// post the interviews
export const scheduleInterview = async (topic, scheduledTime) => {
    try {
        const response = await axiosClient.post('/api/schedule-interviews/schedule', { topic, scheduledTime });
        return response;
    } catch (error) {
        console.error("Error scheduling interview:", error);
        throw error;
    }
};

// get those interviews
export const getScheduledInterviews = async () => {
    try {
        const response = await axiosClient.get('/api/schedule-interviews/scheduled');
        return response;
    } catch (error) {
        console.error("Error fetching scheduled interviews:", error);
        throw error;
    }
};
