import axios from 'axios';
import { getAuthHeader } from '../helpers/auth';

const API_BASE_URL = 'http://localhost:3000/api';

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        throw (error.response && error.response.data) || { message: 'Registration failed' };
    }
};

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
        return response.data;
    } catch (error) {
        throw (error.response && error.response.data) || { message: 'Login failed' };
    }
};