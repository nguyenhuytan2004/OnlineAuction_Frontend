import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

const userProfileService = {
  // Lấy danh sách sản phẩm đang tham gia đấu giá
  getParticipatingProducts: async () => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.USER_PROFILE}/participating-products`,
      );
      return response;
    } catch (error) {
      console.error("Get participating products error:", error);
      throw error;
    }
  },

  // Lấy danh sách sản phẩm đã thắng đấu giá
  getWonProducts: async () => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.USER_PROFILE}/won-products`,
      );
      return response;
    } catch (error) {
      console.error("Get won products error:", error);
      throw error;
    }
  },

  // Lấy danh sách sản phẩm trong watch list
  getWatchList: async () => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.USER_PROFILE}/watch-list`,
      );
      return response;
    } catch (error) {
      console.error("Get watch list error:", error);
      throw error;
    }
  },

  // Lấy danh sách rating nhận được
  getRatings: async () => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.USER_PROFILE}/ratings`,
      );
      return response;
    } catch (error) {
      console.error("Get ratings error:", error);
      throw error;
    }
  },

  // Cập nhật thông tin cá nhân (API chưa có - mock)
  updateProfile: async (profileData) => {
    try {
      // TODO: Replace with actual API when available
      const response = await apiClient.put(
        `${API_ENDPOINTS.USER_PROFILE}/update`,
        {
          fullName: profileData.fullName,
          email: profileData.email,
        },
      );
      return response;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },

  // Đổi mật khẩu
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.patch(`${API_ENDPOINTS.USER_PROFILE}`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      return response;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  },

  // Lấy danh sách sản phẩm đang đăng & còn hạn (cho người bán)
  getActiveProducts: async () => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.USER_PROFILE}/active-products`,
      );
      return response;
    } catch (error) {
      console.error("Get active products error:", error);
      throw error;
    }
  },

  // Lấy danh sách sản phẩm đã có người thắng đấu giá (cho người bán)
  getSoldProducts: async () => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.USER_PROFILE}/sold-products`,
      );
      return response;
    } catch (error) {
      console.error("Get sold products error:", error);
      throw error;
    }
  },

  // Đánh giá người mua (buyer)
  rateBuyer: async (ratingData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.RATINGS_BUYER, {
        productId: ratingData.productId,
        ratingValue: ratingData.ratingValue,
        comment: ratingData.comment,
      });
      return response;
    } catch (error) {
      console.error("Rate buyer error:", error);
      throw error;
    }
  },

  // Huỷ giao dịch
  cancelAuctionResult: async (productId) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUCTION_RESULTS_CANCEL(productId),
      );
      return response;
    } catch (error) {
      console.error("Cancel auction result error:", error);
      throw error;
    }
  },
};

export default userProfileService;
