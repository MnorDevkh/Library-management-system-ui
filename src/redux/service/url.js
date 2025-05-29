import axios from "axios";

export const baseURLString = "https://157.230.33.25:8443/api"; // Export the base URL as a string

const baseURL = axios.create({
    baseURL: baseURLString, // Use the string here for Axios
});

export default baseURL;