import axios from 'axios';
import { API_BASE_URL } from './config.js';

//Interceptors (helps in sending cookies and credentials with every request)
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // always send cookies and credentials
})

// Signup
export const signup = (userData) => {
    try {
        return api.post('/api/auth/signup', userData);
    } catch (error) {
        console.error("Error during signup:", error);
        throw error;
    }
}

// Login
export const login = (credentials) => {
    try {
        return api.post('/api/auth/login', credentials);
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
}

//Logout
export const logout = ()=>{
    try{
        return api.post('/api/auth/logout')
    } catch(error){
        console.log("Error during Logout", error)
        throw error;
    }
}