import { apiService } from "./apiService";

const uri = "requests";

export const requestsService = {
  getAll: async () => apiService.get(uri),
  getRequest: async (id) => apiService.get(`${uri}/${id}`),
  createRequest: async (requestDetails) => apiService.post(uri, requestDetails),
};
