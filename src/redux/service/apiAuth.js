import axios from 'axios';

const apiAuth = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
    }
})

export default apiAuth;
