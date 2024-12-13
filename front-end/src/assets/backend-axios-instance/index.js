import axios from "axios";

export const backendAxiosInstance = axios.create({
    baseURL: "http://172.16.4.38:8080/",
});

backendAxiosInstance.interceptors.request.use(async (request) => {
    console.log("REQUEST ",request);
    return request;
});
