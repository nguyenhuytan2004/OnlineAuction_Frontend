import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

const adminSellerUpgradeService = {
  // Lấy danh sách yêu cầu chờ duyệt
  getPendingRequests: async () => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.ADMIN_SELLER_UPGRADE_REQUESTS}/pending`,
      );
      return response;
    } catch (error) {
      console.error("Get pending seller upgrade requests error:", error);
      throw error;
    }
  },

  // Duyệt / từ chối yêu cầu
  reviewRequest: async (id, payload) => {
    try {
      const response = await apiClient.put(
        `${API_ENDPOINTS.ADMIN_SELLER_UPGRADE_REQUESTS}/${id}/review`,
        payload,
      );
      return response;
    } catch (error) {
      console.error("Review seller upgrade request error:", error);
      throw error;
    }
  },
};

export default adminSellerUpgradeService;
