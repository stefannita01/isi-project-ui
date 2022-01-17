import { apiService } from "./apiService";

const uri = "trucks";

export const trucksService = {
  getAll: async () => apiService.get(uri),
  getTruck: async (truckId) => apiService.get(`${uri}/${truckId}`),
  createTruck: async (truckDetails) => apiService.post(uri, truckDetails),
};
