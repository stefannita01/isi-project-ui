import { apiService } from "./apiService";

export const authService = {
  login: async (data) => apiService.post("login", data),
  register: async (data) => apiService.post("register", data),
};
