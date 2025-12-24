import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

const adminDashboardService = {
  getDashboard: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN_DASHBOARD);
      return response;
    } catch (error) {
      console.error("Get admin dashboard error:", error);
      throw error;
    }
  },
};

export default adminDashboardService;
