import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

const orderService = {
  setShippingAddress: async (orderId, shippingAddress) => {
    try {
      await apiClient.put(
        `${API_ENDPOINTS.ORDERS}/${orderId}/shipping-address`,
        {
            shippingAddress
        }
      );
    } catch (error) {
      console.error("Set shipping address error:", error);
      throw error;
    }
  },
};

export default orderService;
