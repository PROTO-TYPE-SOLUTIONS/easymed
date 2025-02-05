import axios from "axios";

export const backendAxiosInstance = axios.create({
    // baseURL: "http://api:8080/",
    baseURL: "http://backend:8000"
});

backendAxiosInstance.interceptors.request.use(async (request) => {
    console.log("REQUEST ", request);
    return request;
});
