import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

export const authService = {
    // Login
    login: async (email, password) => {
        const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
            email,
            password,
        });
        if (response.token) {
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
        }
        return response;
    },

    // Register
    register: async (userData) => {
        const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
        if (response.token) {
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
        }
        return response;
    },

    // Logout
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    // Get current user
    getCurrentUser: () => {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem("token");
    },
};
