import axios from 'axios';


const apiAuth = axios.create({
    baseURL: "https://157.230.33.25:8443/api",
    headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
    }
})

export default apiAuth;
