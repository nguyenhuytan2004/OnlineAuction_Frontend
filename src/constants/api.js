export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// API Endpoints
export const API_ENDPOINTS = {
    // Categories
    CATEGORIES: "/categories",

    // Products
    PRODUCTS: "/products",
    PRODUCTS_BY_CATEGORY: "/products/category",

    // Bids
    BIDS: "/bids",
};

export const TOKEN_DEV =
    "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX0JJRERFUiJdLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoiNyIsImlhdCI6MTc2NDgyODg4MiwiZXhwIjoxNzY1MTg4ODgyfQ.5OZtNM6XDHSBgvBVHJudqXRLKQilyW6_VbxCrA1FJpk";
