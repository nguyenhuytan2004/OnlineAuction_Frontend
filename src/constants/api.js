export const API_BASE_URL = "http://localhost:8080/api";

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    AUTH: "/auth",

    // Categories
    CATEGORIES: "/categories",

    // Products
    PRODUCTS: "/products",
    PRODUCTS_BY_CATEGORY: "/products/category",

    // Bids
    BIDS: "/bids",
    BLOCK_BIDDER: (productId) => `/products/${productId}/block-bidder`,
    CHECK_BLOCKING: (productId) =>
        `/products/${productId}/bid-blocking-inspection`,

    // Profile
    USER_PROFILE: "/user-profile",

    // Favourites
    FAVOURITES: "/watch-list",
};
