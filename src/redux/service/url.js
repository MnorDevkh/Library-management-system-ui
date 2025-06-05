import axios from "axios";

export const baseURLString = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost1:8080/api";

const baseURL = axios.create({
    baseURL: baseURLString, // Use the string here for Axios
});

export default baseURL;
