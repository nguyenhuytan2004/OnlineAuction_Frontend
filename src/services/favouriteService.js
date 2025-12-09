import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

const favouriteService = {
    isInFavourites: async (productId) => {
        try {
            const isFavourite = await apiClient.get(
                `${API_ENDPOINTS.FAVOURITES}/${productId}`,
            );
            return isFavourite;
        } catch (error) {
            console.error("Check favourites error:", error);
            throw error;
        }
    },

    addToFavourites: async (productId) => {
        try {
            const response = await apiClient.post(
                `${API_ENDPOINTS.FAVOURITES}/${productId}`,
            );
            return response;
        } catch (error) {
            console.error("Add to favourites error:", error);
            throw error;
        }
    },

    removeFromFavourites: async (productId) => {
        try {
            const response = await apiClient.delete(
                `${API_ENDPOINTS.FAVOURITES}/${productId}`,
            );
            return response;
        } catch (error) {
            console.error("Remove from favourites error:", error);
            throw error;
        }
    },
};

export default favouriteService;
