import { action, makeObservable, observable } from "mobx";
import { authService } from "../services/authService";

const ACCESS_TOKEN_STORAGE_KEY = "access_token";

class AuthStore {
  authenticated = false;

  constructor() {
    makeObservable(this, {
      authenticated: observable,
      login: action,
      register: action,
      _setAuthenticated: action,
    });

    this.authenticated = this._getAccessToken() === null ? false : true;
  }

  login = async (data) => {
    const response = await authService.login(data);
    const token = response.token;
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    this._setAuthenticated(true);
  };

  register = async (data) => authService.register(data);

  _setAuthenticated(value) {
    this.authenticated = value;
  }

  _getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export const authStore = new AuthStore();
