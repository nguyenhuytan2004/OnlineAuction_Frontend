import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";
import helpers from "../utils/helpers";

const categoryService = {
  // Dùng cho USER (ProductList)
  getAllCategories: async () => {
    const flat = await apiClient.get(API_ENDPOINTS.CATEGORIES);
    return helpers.buildCategoryTree(flat);
  },

  // Dùng cho ADMIN (CategoryManagement)
  getAllCategoriesFlat: async () => {
    return apiClient.get(API_ENDPOINTS.CATEGORIES);
  },

  createCategory: (data) => apiClient.post(API_ENDPOINTS.CATEGORIES, data),

  updateCategory: (id, data) =>
    apiClient.patch(`${API_ENDPOINTS.CATEGORIES}/${id}`, data),

  deleteCategory: (id) => apiClient.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`),
};

export default categoryService;
