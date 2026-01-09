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
      const isRated = await apiClient.get(
        `${API_ENDPOINTS.RATINGS}/check-if-rated?${queryParams}`,
      );
      return isRated;
    } catch (error) {
      console.error("Check if rated error:", error);
      throw error;
    }
  },

  getRating: async (productId, reviewerId, revieweeId) => {
    try {
      const queryParams = new URLSearchParams({
        productId,
        reviewerId,
        revieweeId,
      }).toString();
      const existingRating = await apiClient.get(
        `${API_ENDPOINTS.RATINGS}?${queryParams}`,
      );
      return existingRating;
    } catch (error) {
      console.error("Get rating error:", error);
      throw error;
    }
  },

  getRatingsByReviewee: async (revieweeId) => {
    try {
      const ratings = await apiClient.get(
        `${API_ENDPOINTS.RATINGS}/reviewee/${revieweeId}`,
      );

      return ratings;
    } catch (error) {
      console.error("Get ratings by reviewee error:", error);
      throw error;
    }
  },

  updateRating: async (updateRatingData) => {
    try {
      const updatedRating = await apiClient.patch(
        API_ENDPOINTS.RATINGS,
        updateRatingData,
      );
      return updatedRating;
    } catch (error) {
      console.error("Update rating error:", error);
      throw error;
    }
  },
};

export default ratingService;
