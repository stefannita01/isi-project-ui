import { action, makeObservable, observable } from "mobx";
import { authService } from "../services/authService";
import jwtDecode from "jwt-decode";

const ACCESS_TOKEN_STORAGE_KEY = "access_token";

class AuthStore {
  authenticated = false;
  user = null;
  token = null;

  constructor() {
    makeObservable(this, {
      authenticated: observable,
      token: observable,
      register: action,
      login: action,
      logout: action,
      _setAuthenticated: action,
      _extractAndSetUser: action,
      _setToken: action,
    });

    const localToken = this._getAccessToken();
    this.authenticated = localToken === null ? false : true;
    this.token = localToken;
  }

  register = async (data) => authService.register(data);

  login = async (data) => {
    const response = await authService.login(data);
    const token = response.token;
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    this._setToken(token);
    this._extractAndSetUser(token);
    this._setAuthenticated(true);
  };

  logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    this._setAuthenticated(false);
  };

  _setAuthenticated(value) {
    this.authenticated = value;
  }

  _setToken(value) {
    this.token = value;
  }

  _extractAndSetUser(token) {
    const decoded = jwtDecode(token);
    this.user = {
      email: decoded.sub,
      role: decoded.role,
    };
  }

  _getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export const authStore = new AuthStore();
