import { apiService } from "./apiService";

const uri = "trucks";

export const trucksService = {
  getAll: async () => {
    const response = await apiService.get(uri);
    return response.map((item) => item.truck);
  },
  getSuitableTrucks: async (requestId) =>
    apiService.get(`${uri}?requestId=${requestId}`),
  getTruck: async (truckId) => apiService.get(`${uri}/${truckId}`),
  createTruck: async (truckDetails) => apiService.post(uri, truckDetails),
  updateTruck: async (truckDetails) => apiService.put(uri, truckDetails),
};
