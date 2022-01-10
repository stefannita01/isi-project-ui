import { observer } from "mobx-react-lite";
import { authStore } from "../stores/authStore";

const API_URL = "http://localhost:8090";

// http methods will be added as needed
export const apiService = observer({
  get: async function (url) {
    const response = await fetch(
      `${API_URL}/${url}`,
      this._getRequestParams("GET", null)
    );

    return this._throwOrReturnContents(response);
  },

  post: async function (url, body) {
    const response = await fetch(
      `${API_URL}/${url}`,
      this._getRequestParams("POST", body)
    );

    return this._throwOrReturnContents(response);
  },

  put: async function (url, body) {
    const response = await fetch(
      `${API_URL}/${url}`,
      this._getRequestParams("PUT", body)
    );

    return this._throwOrReturnContents(response);
  },

  _getRequestParams: function (method, body) {
    const params = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    };

    if (authStore.token) {
      params.headers.Authorization = `Bearer ${authStore.token}`;
    }

    return params;
  },

  _throwOrReturnContents: async (response) => {
    const contents = await response.json();

    if (!response.ok) {
      throw new Error(contents?.message || "An error occurred");
    }

    return contents;
  },
});
