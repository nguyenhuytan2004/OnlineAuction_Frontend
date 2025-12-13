import React from "react";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCategoryManagement from "../pages/admin/AdminCategoryManagement";
import AdminProductManagement from "../pages/admin/AdminProductManagement";
import AdminUserManagement from "../pages/admin/AdminUserManagement";
import AdminUpgradeAccountReview from "../pages/admin/AdminUpgradeAccountReview";

export const AdminRouter = [
  {
    element: <AdminLayout />,
    children: [
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/categories",
        element: <AdminCategoryManagement />,
      },
      {
        path: "/admin/products",
        element: <AdminProductManagement />,
      },
      {
        path: "/admin/users",
        element: <AdminUserManagement />,
      },
      {
        path: "/admin/upgrade-reviews",
        element: <AdminUpgradeAccountReview />,
      },
    ],
  },
];
