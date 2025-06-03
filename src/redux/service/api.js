import axios from 'axios';
import baseURL from './url';
const baseURLString = baseURL.defaults.baseURL; 
const api = axios.create({
    baseURL: baseURLString,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
})

api.interceptors.request.use((s) => {
    const token = localStorage.getItem("token");
    s.headers.Authorization = "Bearer "+ token;
    return s;
});

export default api;