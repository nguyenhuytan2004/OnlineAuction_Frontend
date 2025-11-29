import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

export const auctionService = {
    // Get all auctions
    getAllAuctions: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString
            ? `${API_ENDPOINTS.GET_AUCTIONS}?${queryString}`
            : API_ENDPOINTS.GET_AUCTIONS;
        return apiClient.get(endpoint);
    },

    // Get auction by ID
    getAuctionById: async (id) => {
        return apiClient.get(API_ENDPOINTS.GET_AUCTION_BY_ID(id));
    },

    // Create auction
    createAuction: async (data) => {
        return apiClient.post(API_ENDPOINTS.CREATE_AUCTION, data);
    },

    // Update auction
    updateAuction: async (id, data) => {
        return apiClient.put(API_ENDPOINTS.UPDATE_AUCTION(id), data);
    },

    // Delete auction
    deleteAuction: async (id) => {
        return apiClient.delete(API_ENDPOINTS.DELETE_AUCTION(id));
    },

    // Get bids for auction
    getBids: async (auctionId) => {
        return apiClient.get(API_ENDPOINTS.GET_BIDS(auctionId));
    },

    // Create bid
    createBid: async (auctionId, amount) => {
        return apiClient.post(API_ENDPOINTS.CREATE_BID(auctionId), { amount });
    },
};
