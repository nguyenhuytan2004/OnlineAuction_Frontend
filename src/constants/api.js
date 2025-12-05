export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api";

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
};
