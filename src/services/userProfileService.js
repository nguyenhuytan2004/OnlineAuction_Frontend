import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

export const userProfileService = {
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
                API_ENDPOINTS.USER_PROFILE_RATINGS,
            );
            return response;
        } catch (error) {
            console.error("Get ratings error:", error);
            throw error;
        }
    },

    // Đánh giá người bán
    createRating: async (ratingData) => {
        try {
            const response = await apiClient.post(
                API_ENDPOINTS.USER_PROFILE_RATINGS,
                {
                    productId: ratingData.productId,
                    ratingValue: ratingData.ratingValue,
                    comment: ratingData.comment,
                },
            );
            return response;
        } catch (error) {
            console.error("Create rating error:", error);
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

    // Đổi mật khẩu (API chưa có - mock)
    changePassword: async (passwordData) => {
        try {
            // TODO: Replace with actual API when available
            const response = await apiClient.put(
                `${API_ENDPOINTS.USER_PROFILE}/change-password`,
                {
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword,
                },
            );
            return response;
        } catch (error) {
            console.error("Change password error:", error);
            throw error;
        }
    },
};

export default userProfileService;
