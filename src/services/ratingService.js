import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

const ratingService = {
    checkIfRated: async (productId, reviewerId, revieweeId) => {
        try {
            const queryParams = new URLSearchParams({
                productId,
                reviewerId,
                revieweeId,
            }).toString();
            const response = await apiClient.get(
                `${API_ENDPOINTS.RATINGS}/check-if-rated?${queryParams}`,
            );
            return response;
        } catch (error) {
            console.error("Check if rated error:", error);
            throw error;
        }
    },
};

export default ratingService;
