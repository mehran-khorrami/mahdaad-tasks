import axios from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';

const THRESHOLD = Number(process.env.VITE_THRESHOLD) || 3;
const TIMEOUT = Number(process.env.VITE_TIMEOUT) || 60000;
const RETRY_DELAY = Number(process.env.VITE_RETRY_DELAY) || 1000;

let failureCount = 0;
let circuitOpen = false;
let retryTimeout: ReturnType<typeof setTimeout> | null = null;

const api = axios.create({
    baseURL: process.env.VITE_API_BASE_URL || 'https://api.example.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

api.interceptors.request.use((config) => {
    if (circuitOpen) {
        return Promise.reject(new Error('Service temporarily unavailable (circuit breaker open)'));
    }
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    response => {
        failureCount = 0;
        return response;
    },
    async (error: AxiosError) => {
        failureCount++;

        if (error.response?.status && error.response.status < 500) {
            return Promise.reject(error);
        }

        if (failureCount >= THRESHOLD) {
            circuitOpen = true;
            console.warn(`Circuit breaker triggered: service unavailable.`);
            
            retryTimeout && clearTimeout(retryTimeout);
            retryTimeout = setTimeout(() => {
                circuitOpen = false;
                failureCount = 0;
                console.info('Circuit breaker reset: service available');
            }, TIMEOUT);

            return Promise.reject(new Error('Circuit breaker open'));
        }

        if (failureCount < THRESHOLD && !circuitOpen) {
            await sleep(RETRY_DELAY);
            return api(error.config as AxiosRequestConfig);
        }

        return Promise.reject(error);
    }
);

export default api;