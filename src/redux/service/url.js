import axios from "axios";

export const baseURLString = "http://localhost:8080/api"; // Export the base URL as a string

const baseURL = axios.create({
    baseURL: baseURLString, // Use the string here for Axios
});

export default baseURL;
