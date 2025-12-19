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
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },

  refreshAccessToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Refresh token expired");
    }

    const data = await response.json();

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }

    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    return data.accessToken;
  },
};

export default authService;
