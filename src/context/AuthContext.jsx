import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    // Optional: Verify token with backend
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await AuthService.login(email, password);
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                return { success: true };
            }
            return { success: false, message: data.msg || 'Login failed' };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.msg || 'Unable to connect to server'
            };
        }
    };

    const register = async (userData) => {
        try {
            const data = await AuthService.register(userData);
            return { success: true, message: data.msg };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.msg || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
