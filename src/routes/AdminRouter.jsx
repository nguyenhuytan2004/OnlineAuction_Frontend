import React from "react";
import AdminLayout from "../layouts/AdminLayout";
import CategoryManagement from "../pages/admin/CategoryManagement";

export const AdminRouter = [
  {
    element: <AdminLayout />,
    children: [
      {
        path: "/admin/categories",
        element: <CategoryManagement />,
      },
    ],
  },
];
