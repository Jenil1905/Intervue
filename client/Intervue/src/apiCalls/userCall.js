import axios from "axios";
import { API_BASE_URL } from "./config.js";

//Interceptors (helps in sending cookies and credentials with every request)
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // always send cookies and credentials
})

// Get User Profile
export const getUserProfile = async () => {
    try {
        return await api.get('/api/user/current');
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

// Update user name
export const updateUsername = async (name)=>{
try {
        return await api.patch('/api/user/update-name', {name});
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

//Update phone number
export const updateUserPhone = async (phone_number)=>{
    try {
        return await api.patch('/api/user/update-phone', {phone_number});
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

//upload profile pic
export const updateProfilePicture = async (formData) => {
 try {
    return api.post('/api/user/profile-picture', formData);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }};