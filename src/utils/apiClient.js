import { API_BASE_URL } from "../constants/api";

class ApiClient {
    constructor(baseURL = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    getHeaders() {
        // const token = localStorage.getItem("token");
        const token =
            "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX0JJRERFUiJdLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoiOCIsImlhdCI6MTc2NDY0NjU4OSwiZXhwIjoxNzY0NjgyNTg5fQ.DDU_iARoJspiS6geVv6WsHx2bRB-RKnQ0dxaF89Ftb0";
        return {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders(),
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }

                let errorData = null;
                try {
                    errorData = await response.json();
                } catch {
                    // Ignore JSON parse errors
                }

                throw new Error(
                    errorData?.message ||
                        `HTTP ${response.status}: ${response.statusText}`,
                );
            }
            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
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
