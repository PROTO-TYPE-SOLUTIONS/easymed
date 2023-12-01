import axios from "axios";

export const backendAxiosInstance = axios.create({
    baseURL: "http://backend:8000",
    // baseURL: "http://127.0.0.1:8000",
});

backendAxiosInstance.interceptors.request.use(async (request) => {
    console.log("REQUEST ",request);
    return request;
});