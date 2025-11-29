import { useState } from "react";
import { authService } from "../services/authService";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login(email, password);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.register(userData);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
    };

    const currentUser = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();

    return {
        login,
        register,
        logout,
        currentUser,
        isAuthenticated,
        loading,
        error,
    };
};
