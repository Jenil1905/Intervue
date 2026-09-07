import axiosClient from './axiosClient.js';

// Signup
export const signup = (userData) => {
    return axiosClient.post('/api/auth/signup', userData);
}

// Login
export const login = (credentials) => {
    return axiosClient.post('/api/auth/login', credentials);
}

// Logout
export const logout = () => {
    localStorage.removeItem('token');
    return axiosClient.post('/api/auth/logout');
}