import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

const productService = {
    getAllProducts: async (options = {}) => {
        const queryParams = new URLSearchParams(options);
        const endpoint = `${API_ENDPOINTS.PRODUCTS}?${queryParams.toString()}`;
        const products = await apiClient.get(endpoint);

        return products;
    },

    getProductsByCategoryId: async (categoryId, options = {}) => {
        const queryParams = new URLSearchParams(options);
        const endpoint = `${
            API_ENDPOINTS.PRODUCTS_BY_CATEGORY
        }/${categoryId}?${queryParams.toString()}`;
        const products = await apiClient.get(endpoint);

        return products;
    },

    getProductById: async (productId) => {
        const endpoint = `${API_ENDPOINTS.PRODUCTS}/${productId}`;
        const product = await apiClient.get(endpoint);

        return product;
    },

    getBidsHistory: async (productId) => {
        const endpoint = `${API_ENDPOINTS.PRODUCTS}/${productId}/bids`;
        const bids = await apiClient.get(endpoint);

        return bids;
    },

    getProductQnA: async (productId) => {
        const endpoint = `${API_ENDPOINTS.PRODUCTS}/${productId}/questions`;
        const qna = await apiClient.get(endpoint);

        return qna;
    },

    getRelatedProducts: async (productId) => {
        const endpoint = `${API_ENDPOINTS.PRODUCTS}/${productId}/top-5-related`;
        const products = await apiClient.get(endpoint);

        return products;
    },

    getTop5EndingSoon: async () => {
        const endpoint = `${API_ENDPOINTS.PRODUCTS}/top-5-ending-soon`;
        const products = await apiClient.get(endpoint);

        return products;
    },

    getTop5MostAuctioned: async () => {
        const endpoint = `${API_ENDPOINTS.PRODUCTS}/top-5-most-auctioned`;
        const products = await apiClient.get(endpoint);

        return products;
    },

    getTop5HighestPriced: async () => {
        const endpoint = `${API_ENDPOINTS.PRODUCTS}/top-5-highest-priced`;
        const products = await apiClient.get(endpoint);

        return products;
    },

    searchProducts: async (keyword, options = {}) => {
        const queryParams = new URLSearchParams({
            keyword,
            ...options,
        });
        const endpoint = `${
            API_ENDPOINTS.PRODUCTS
        }/full-text-search?${queryParams.toString()}`;
        const products = await apiClient.get(endpoint);

        return products;
    },

    searchProductsWithCategoryId: async (categoryId, keyword, options = {}) => {
        const queryParams = new URLSearchParams({
            keyword,
            ...options,
        });
        const endpoint = `${
            API_ENDPOINTS.PRODUCTS_BY_CATEGORY
        }/${categoryId}/full-text-search?${queryParams.toString()}`;
        const products = await apiClient.get(endpoint);

        return products;
    },

    checkBiddingEligibility: async (productId) => {
        const endpoint = `${API_ENDPOINTS.PRODUCTS}/${productId}/bidding-eligibility`;
        const isEligible = await apiClient.get(endpoint);

        return isEligible;
    },

    buyNowProduct: async (productId) => {
        const endpoint = `${API_ENDPOINTS.PRODUCTS}/${productId}/buy-now`;
        const result = await apiClient.patch(endpoint);

        return result;
    },
};

export default productService;
