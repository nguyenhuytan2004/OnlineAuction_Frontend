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
};

export default productService;
