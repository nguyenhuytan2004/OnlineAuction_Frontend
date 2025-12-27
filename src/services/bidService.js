import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

const bidService = {
    getBid: async (bidId) => {
        const endpoint = `${API_ENDPOINTS.BIDS}/${bidId}`;
        const bid = await apiClient.get(endpoint);

        return bid;
    },

    blockBidder: async (productId, blockedId, reason) => {
        const endpoint = API_ENDPOINTS.BLOCK_BIDDER(productId);
        const response = await apiClient.post(endpoint, {
            blockedId,
            reason,
        });

        return response;
    },

    checkBlocking: async (productId) => {
        const endpoint = API_ENDPOINTS.CHECK_BLOCKING(productId);
        const response = await apiClient.get(endpoint);

        return response;
    },

    createSellerUpgradeRequest: async () => {
        const endpoint = API_ENDPOINTS.SELLER_UPGRADE_REQUEST;
        return await apiClient.post(endpoint, {});
    },

    getSellerUpgradeStatus() {
        return apiClient.get(
        API_ENDPOINTS.SELLER_UPGRADE_STATUS
        );
    }
};

export default bidService;
