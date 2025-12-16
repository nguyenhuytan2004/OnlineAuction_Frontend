import { API_BASE_URL } from "../constants/api";
import { isTokenExpired } from "../utils/tokenUtils.js";

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

  async refreshAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Refresh token expired");
    }

    const data = await response.json();

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }

    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    return data.accessToken;
  }

  async request(endpoint, options = {}, retry = true) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && isTokenExpired(accessToken)) {
      try {
        await this.refreshAccessToken();
      } catch (err) {
        this.logout();
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
            await this.refreshAccessToken();
            return this.request(endpoint, options, false);
          } catch {
            this.logout();
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

  /*sync request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders(),
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                if (
                    response.status === 401 &&
                    !endpoint.includes("/auth/login")
                ) {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                }

                let errorMessage = null;
                try {
                    errorMessage = await response.text();
                } catch {
                    // Ignore JSON parse errors
                }

                throw errorMessage || `HTTP error! status: ${response.status}`;
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error("Error occurred:", error);
            throw error;
        }
    }*/

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
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
