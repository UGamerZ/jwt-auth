import axios from 'axios';
import type {AuthResponse} from "../types/response/auth.ts";

export const API_URL = 'http://localhost:8000/auth'

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

$api.interceptors.request.use((config) => {
    if(!config.headers) throw new Error('Invalid config');
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const orRequest = error.config;
    if(error.response.status === 401 && !orRequest.isRepeat) {
        try{
            error.config.isRepeat = true;
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
            localStorage.setItem('token', response.data.access);
            return $api.request(orRequest);
        } catch {
            console.log('Unauthorized');
        }
    }
    throw error;
})

export default $api;