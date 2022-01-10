import { apiService } from "./apiService";

const uri = "products";

export const productsService = {
  getAll: async () => apiService.get(uri),
  getProduct: async (productId) => apiService.get(`${uri}/${productId}`),
  createProduct: async (productDetails) => apiService.post(uri, productDetails),
};
