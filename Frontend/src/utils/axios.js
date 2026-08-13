import axios from 'axios';

export const axiosApi = axios.create({
    baseURL: "http://localhost:8002",
    withCredentials: true,
});