import axios from 'axios';


const apiAuth = axios.create({
    baseURL: "http://157.230.33.25:8080/api",
    headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
    }
})

export default apiAuth;