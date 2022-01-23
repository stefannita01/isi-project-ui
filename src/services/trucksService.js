import { apiService } from "./apiService";

const uri = "trucks";

export const trucksService = {
  getAll: async () => apiService.get(uri),
  getSuitableTrucks: async (requestId) =>
    apiService.get(`${uri}?requestId=${requestId}`),
  getTruck: async (truckId) => apiService.get(`${uri}/${truckId}`),
  createTruck: async (truckDetails) => apiService.post(uri, truckDetails),
};
