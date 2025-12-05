import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

export const authService = {
    register: async (userData) => {
        try {
            const endpoint = `${API_ENDPOINTS.AUTH}/register`;
            const response = await apiClient.post(endpoint, {
                fullName: userData.fullName,
                email: userData.email,
                password: userData.password,
            });

            // Lưu token
            if (response.accessToken) {
                localStorage.setItem("accessToken", response.accessToken);
                localStorage.setItem("refreshToken", response.refreshToken);
                if (response.user) {
                    localStorage.setItem("user", JSON.stringify(response.user));
                }
            }

            return response;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    },

    login: async (email, password) => {
        try {
            const endpoint = `${API_ENDPOINTS.AUTH}/login`;
            const response = await apiClient.post(endpoint, {
                email,
                password,
            });

            // Lưu token
            if (response.accessToken) {
                localStorage.setItem("accessToken", response.accessToken);
                localStorage.setItem("refreshToken", response.refreshToken);
                if (response.user) {
                    localStorage.setItem("user", JSON.stringify(response.user));
                }
            }

            return response;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem("accessToken");
    },

    refreshToken: async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const endpoint = `${API_ENDPOINTS.AUTH}/refresh`;
        const response = await apiClient.post(endpoint, { refreshToken });

        if (response.accessToken) {
            localStorage.setItem("accessToken", response.accessToken);
            if (response.refreshToken) {
                localStorage.setItem("refreshToken", response.refreshToken);
            }
        }

        return response;
    },
};

export default authService;
