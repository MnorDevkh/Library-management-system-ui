import axios from "axios";
const api = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL || "http://localhost3:8080/api",
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