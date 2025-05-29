import axios from 'axios';


const api = axios.create({
    baseURL: "https://157.230.33.25:8443/api",
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