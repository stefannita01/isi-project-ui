const API_URL = "http://localhost:8090";

// http methods will be added as needed
export const apiService = {
  get: async function (url) {
    const response = await fetch(`${API_URL}/${url}`);

    return this._throwOrReturnContents(response);
  },

  post: async function (url, body) {
    const response = await fetch(`${API_URL}/${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });

    return this._throwOrReturnContents(response);
  },

  put: async function (url, body) {
    const response = await fetch(`${API_URL}/${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });

    return this._throwOrReturnContents(response);
  },

  _throwOrReturnContents: async (response) => {
    const contents = await response.json();

    if (!response.ok) {
      throw new Error(contents?.message || "An error occurred");
    }

    return contents;
  },
};
