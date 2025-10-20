import axios from 'axios';
import { API_BASE_URL } from './config.js';

//Interceptors (helps in sending cookies and credentials with every request)
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // always send cookies and credentials
})

export default api