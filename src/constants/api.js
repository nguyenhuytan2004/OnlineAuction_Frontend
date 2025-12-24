export const API_BASE_URL = "http://localhost:8080/api";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: "/auth",

  // Auction
  AUCTION_RESULTS: "/auction-results",

  // Categories
  CATEGORIES: "/categories",

  // Products
  PRODUCTS: "/products",
  PRODUCTS_BY_CATEGORY: "/products/category",
  BLOCK_BIDDER: (productId) => `/products/${productId}/block-bidder`,
  CHECK_BLOCKING: (productId) =>
    `/products/${productId}/bid-blocking-inspection`,

  // Bids
  BIDS: "/bids",

  // Profile
  USER_PROFILE: "/user-profile",

  // Ratings
  RATINGS: "/ratings",

  // Auction Results
  AUCTION_RESULTS_CANCEL: (productId) =>
    `/auction-results/product/${productId}/cancel`,

  // Favourites
  FAVOURITES: "/watch-list",

  PAYMENTS: "/payments",
  ORDERS: "/orders",

  ADMIN_SELLER_UPGRADE_REQUESTS:
    "/admin/seller-upgrade-requests",

  ADMIN_USERS: "/admin/users",
};
