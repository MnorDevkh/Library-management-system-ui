import axios from 'axios';


const apiAuth = axios.create({
    baseURL: "https://188.166.220.11:8443/api",
    headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
    }
})

export default apiAuth;
