import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

const productService = {
  getProducts: async (options = {}) => {
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

  getBidHistory: async (productId) => {
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

  appendProductDescription: async (productId, additionalDescription) => {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.PRODUCTS}/${productId}/append-description`,
        {
          additionalDescription,
        },
      );
      return response;
    } catch (error) {
      console.error("Add product description error:", error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.PRODUCTS,
        productData,
      );
      return response;
    } catch (error) {
      console.error("Create product error:", error);
      throw error;
    }
  },

  updateProduct: async (productId, updatedData) => {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.PRODUCTS}/${productId}`,
        updatedData,
      );
      return response;
    } catch (error) {
      console.error("Update product error:", error);
      throw error;
    }
  },
};

export default productService;
