import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

const userService = {
  getUsers: async (options = {}) => {
    try {
      const queryParams = new URLSearchParams(options).toString();
      const users = await apiClient.get(
        `${API_ENDPOINTS.USERS}?${queryParams}`,
      );

      return users;
    } catch (error) {
      console.error("Get users error:", error);
      throw error;
    }
  },

  updateUser: async (userId, updateData) => {
    try {
      const updatedUser = await apiClient.patch(
        `${API_ENDPOINTS.USERS}/${userId}`,
        updateData,
      );

      return updatedUser;
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const newUser = await apiClient.post(API_ENDPOINTS.USERS, userData);

      return newUser;
    } catch (error) {
      console.error("Create user error:", error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      await apiClient.delete(`${API_ENDPOINTS.USERS}/${userId}`);
    } catch (error) {
      console.error("Delete user error:", error);
      throw error;
    }
  },
};

export default userService;
