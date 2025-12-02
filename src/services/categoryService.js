import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";
import helpers from "../utils/helpers";

const categoryService = {
    // Get all categories
    getAllCategories: async () => {
        const flatCategories = await apiClient.get(API_ENDPOINTS.CATEGORIES);
        const categoryTree = helpers.buildCategoryTree(flatCategories);

        return categoryTree;
    },
};

export default categoryService;
