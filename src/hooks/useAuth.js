import { useState, useEffect, useCallback } from "react";
import { useTokenStatus } from "./useTokenStatus";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

/**
 * Custom hook để theo dõi user authentication status
 * @returns {Object} - { isAuthenticated, user, tokenStatus, logout }
 */
export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });
  const [role, setRole] = useState(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr).role : null;
  });

  const navigate = useNavigate();

  const tokenStatus = useTokenStatus();

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setRole(null);
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  // Listen for token expiration
  useEffect(() => {
    if (tokenStatus.isExpired && user) {
      // Use setTimeout để tránh update state trong lúc render
      const timer = setTimeout(() => {
        logout();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [tokenStatus.isExpired, user, logout]);

  return {
    isAuthenticated: !!user && !tokenStatus.isExpired,
    user,
    role,
    logout,
  };
};
