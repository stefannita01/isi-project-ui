import { apiService } from "./apiService";

const uri = "contracts";

export const contractsService = {
  getAll: async () => apiService.get(uri),
  createContract: async (truckId, requestId, price) =>
    apiService.post(uri, { truckId, requestId, price }),
  updateContract: async (contract) => apiService.put(uri, { contract }),
};
