import { apiService } from "./apiService";

const uri = "users";

export const usersService = {
  getAll: async () => apiService.get(uri),
  updateRole: async (user, newRole) =>
    apiService.put(uri, { ...user, userRole: newRole }),
};
