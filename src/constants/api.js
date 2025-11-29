// API Base URL
export const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",

    // Users
    GET_PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",

    // Auctions
    GET_AUCTIONS: "/auctions",
    GET_AUCTION_BY_ID: (id) => `/auctions/${id}`,
    CREATE_AUCTION: "/auctions",
    UPDATE_AUCTION: (id) => `/auctions/${id}`,
    DELETE_AUCTION: (id) => `/auctions/${id}`,

    // Bids
    GET_BIDS: (auctionId) => `/auctions/${auctionId}/bids`,
    CREATE_BID: (auctionId) => `/auctions/${auctionId}/bids`,

    // Categories
    GET_CATEGORIES: "/categories",
};
