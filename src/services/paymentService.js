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
        },
      );
      return res;
    } catch (error) {
      console.error("Create VNPay payment error:", error);
      throw error;
    }
  },

  createMomoPayment: async ({ amount, orderInfo }) => {
    const res = await apiClient.post("/payments/momo/create", {
      amount,
      orderInfo,
    });
    return res;
  },

  createPayOSPayment: async ({
    orderName,
    description,
    amount,
    userId,
    type,
    productId,
    returnUrl,
    cancelUrl,
  }) => {
    const res = await apiClient.post("/payment/payos/create-payment-link", {
      orderName,
      description,
      amount,
      userId,
      type,
      productId,
      returnUrl,
      cancelUrl,
    });
    return res;
  },
};

export default paymentService;
