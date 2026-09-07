import axios from 'axios';
import { API_BASE_URL } from './config.js';

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Request interceptor to automatically attach Authorization header if token is stored
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated 401 state gracefully
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
