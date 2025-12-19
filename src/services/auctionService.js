import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

const auctionService = {
  getAuctionResult: async (productId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.AUCTION_RESULTS}/product/${productId}`,
      );
      return response;
    } catch (error) {
      console.error("Get auction result error:", error);
      throw error;
    }
  },
};

export default auctionService;
