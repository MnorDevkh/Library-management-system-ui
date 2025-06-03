import axios from 'axios';
import baseURL from "../redux/service/url";

const apiAuth = axios.create({
    baseURL: `https://${baseURL.defaults.baseURL}/api`,
    headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
    }
})

export default apiAuth;
