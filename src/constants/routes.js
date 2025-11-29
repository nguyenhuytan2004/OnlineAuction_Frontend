// Define all route paths as constants to avoid typos
export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    DASHBOARD: "/dashboard",
    AUCTIONS: "/auctions",
    AUCTION_DETAIL: (id) => `/auctions/${id}`,
    CREATE_AUCTION: "/auctions/create",
    PROFILE: "/profile",
    MY_BIDS: "/my-bids",
    MY_AUCTIONS: "/my-auctions",
    SETTINGS: "/settings",
    NOT_FOUND: "/404",
};
