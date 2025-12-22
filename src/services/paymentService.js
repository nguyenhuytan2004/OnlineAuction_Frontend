import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

const paymentService = {
  createVnpayPayment: async ({ orderId, amount }) => {
    try {
      const res = await apiClient.post(
        `${API_ENDPOINTS.PAYMENTS}/vnpay/create`,
        {
          orderId,
          amount,
        }
      );
      return res;
    } catch (error) {
      console.error("Create VNPay payment error:", error);
      throw error;
    }
  },
};

export default paymentService;
