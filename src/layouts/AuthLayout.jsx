import React from "react";
import { Outlet, useLocation } from "react-router-dom";

import { useEffect } from "react";

import BackgroundDecoration from "../components/BackgroundDecoration";

const AuthLayout = () => {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 flex items-center justify-center">
      <BackgroundDecoration />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
