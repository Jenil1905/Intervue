import axiosClient from "./axiosClient.js";

// Get User Profile
export const getUserProfile = async () => {
    return await axiosClient.get('/api/user/current');
}

// Update user name
export const updateUsername = async (name) => {
    return await axiosClient.patch('/api/user/update-name', { name });
}

// Update phone number
export const updateUserPhone = async (phone_number) => {
    return await axiosClient.patch('/api/user/update-phone', { phone_number });
}

// Upload profile pic
export const updateProfilePicture = async (formData) => {
    return await axiosClient.post('/api/user/profile-picture', formData);
};