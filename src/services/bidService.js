import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

const bidService = {
  getBid: async (bidId) => {
    const endpoint = `${API_ENDPOINTS.BIDS}/${bidId}`;
    const bid = await apiClient.get(endpoint);

    return bid;
  },

  placeBid: async (productId, bidderId, maxAutoPrice) => {
    const endpoint = `${API_ENDPOINTS.BIDS}`;
    const bid = await apiClient.post(endpoint, {
      productId,
      bidderId,
      maxAutoPrice,
    });

    return bid;
  },
};

export default bidService;
