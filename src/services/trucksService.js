import { apiService } from "./apiService";

const uri = "trucks";

export const trucksService = {
  getAll: async () => apiService.get(uri),
  getSuitableTrucks: async (weight, volume, quantity) => {
    const queryParams =
      (weight ? `weight=${weight}&` : "") +
      (volume ? `volume=${volume}&` : "") +
      (quantity ? `quantity=${quantity}` : "");

    return apiService.get(`${uri}?${queryParams}`);
  },
  getTruck: async (truckId) => apiService.get(`${uri}/${truckId}`),
  createTruck: async (truckDetails) => apiService.post(uri, truckDetails),
};
