import axios from 'axios';
import baseURL from './url';

const baseURLString = baseURL.defaults.baseURL;
const apiAuth = axios.create({
    baseURL: baseURLString,
    headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
    }
})

export default apiAuth;
