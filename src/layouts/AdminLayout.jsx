import { Outlet, useLocation } from "react-router-dom";

import { useEffect } from "react";

const AdminLayout = () => {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return <Outlet />;
};

export default AdminLayout;
