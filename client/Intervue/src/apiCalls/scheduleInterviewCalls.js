import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

//post the interviews
export const scheduleInterview = async (topic, scheduledTime) => {
    try {
        const response = await api.post('/api/schedule-interviews/schedule', { topic, scheduledTime });
        return response;
    } catch (error) {
        console.error("Error scheduling interview:", error);
        throw error;
    }
};

//get those interviews
export const getScheduledInterviews = async () => {
    try {
        // You need to provide the specific endpoint URL
        const response = await api.get('/api/schedule-interviews/scheduled');
        return response;
    } catch (error) {
        // Log the error for debugging and re-throw it so the component can handle it
        console.error("Error fetching scheduled interviews:", error);
        throw error;
    }
};
