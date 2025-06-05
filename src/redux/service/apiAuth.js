import axios from 'axios';

const apiAuth = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8080/api",
    headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
    }
})

export default apiAuth;
