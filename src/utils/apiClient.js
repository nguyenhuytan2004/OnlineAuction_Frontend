import { API_BASE_URL } from "../constants/api";
import { isTokenExpired } from "../utils/tokenUtils.js";

import authService from "../services/authService.js";

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  getHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint, options = {}, retry = true) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && isTokenExpired(accessToken)) {
      try {
        await authService.refreshAccessToken();
      } catch (err) {
        authService.logout();
        throw err;
      }
    }

    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: this.getHeaders(),
    };

    try {
      const response = await fetch(url, config);
      let contentType = response.headers.get("content-type");

      if (!response.ok) {
        if (response.status === 401 && retry) {
          try {
            await authService.refreshAccessToken();
            return this.request(endpoint, options, false);
          } catch {
            authService.logout();
          }
        }

        let errorMessage;
        errorMessage = contentType?.includes("application/json")
          ? await response.json()
          : await response.text();

        throw errorMessage || `HTTP error! ${response.status}`;
      }

      return contentType?.includes("application/json")
        ? await response.json()
        : await response.text();
    } catch (error) {
      console.error("Error occurred:", error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
}

export default new ApiClient();
