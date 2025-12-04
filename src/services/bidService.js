import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

const bidService = {
    getBid: async (bidId) => {
        const endpoint = `${API_ENDPOINTS.BIDS}/${bidId}`;
        const bid = await apiClient.get(endpoint);

        return bid;
    },
};

export default bidService;
