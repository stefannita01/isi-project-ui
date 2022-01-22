import { apiService } from "./apiService";

const uri = "contracts";

export const contractsService = {
  createContract: async (truckId, requestId) =>
    apiService.post(uri, { truckId, requestId }),
};
