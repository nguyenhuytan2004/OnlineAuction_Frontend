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

  sellerConfirmPayment: async (orderId) => {
    try {
      await apiClient.post(
        `${API_ENDPOINTS.ORDERS}/${orderId}/confirm-payment`
      );
    } catch (error) {
      console.error("Seller confirm payment error:", error);
      throw error;
    }
  },

  buyerConfirmReceived: async (orderId) => {
    try {
      await apiClient.post(
        `${API_ENDPOINTS.ORDERS}/${orderId}/confirm-received`
      );
    } catch (error) {
      console.error("Buyer confirm received error:", error);
      throw error;
    }
  },

  payAndCreateOrder: async ({ productId, amount, paymentRef }) => {
    try {
      const res = await apiClient.post(
        `${API_ENDPOINTS.ORDERS}/pay`,
        {
          productId,
          amount,
          paymentRef,
        }
      );
      return res.data;
    } catch (error) {
      console.error("Pay and create order error:", error);
      throw error;
    }
  },

  cancelOrderByProduct: async (productId) => {
    try {
      await apiClient.patch(
        `/auction-results/product/${productId}/cancel`
      );
    } catch (error) {
      console.error("Cancel order error:", error);
      throw error;
    }
  },

  getStatus: async (orderId) => {
    try {
      const res = await apiClient.get(`${API_ENDPOINTS.ORDERS}/${orderId}/status`);
      return res.data; // { orderId, status, shippingAddressPresent, finalPrice }
    } catch (error) {
      console.error("Get order status error:", error);
      throw error;
    }
  }
};

export default orderService;
