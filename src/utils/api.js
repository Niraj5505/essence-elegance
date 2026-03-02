import axios from 'axios';

const api = axios.create({
    baseURL: '/api'
});

export const ProductService = {
    getAll: async () => {
        const response = await api.get('/products');
        return response.data;
    },
    getOne: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    }
};

export const AuthService = {
    login: async (email, password) => {
        const response = await api.post('/login', { email, password });
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('/register', userData);
        return response.data;
    },
    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const response = await api.get('/auth-check', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default api;
