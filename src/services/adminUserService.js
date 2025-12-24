import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

const adminUserService = {
  getAllUsers: async () => {
    try {
      return await apiClient.get(API_ENDPOINTS.ADMIN_USERS);
    } catch (error) {
      console.error("Get all users error:", error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      return await apiClient.get(`${API_ENDPOINTS.ADMIN_USERS}/${id}`);
    } catch (error) {
      console.error("Get user by id error:", error);
      throw error;
    }
  },

  createUser: async (payload) => {
    try {
      return await apiClient.post(API_ENDPOINTS.ADMIN_USERS, payload);
    } catch (error) {
      console.error("Create user error:", error);
      throw error;
    }
  },

  updateUser: async (id, payload) => {
    try {
      return await apiClient.put(`${API_ENDPOINTS.ADMIN_USERS}/${id}`, payload);
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      return await apiClient.delete(`${API_ENDPOINTS.ADMIN_USERS}/${id}`);
    } catch (error) {
      console.error("Delete user error:", error);
      throw error;
    }
  },
};

export default adminUserService;
