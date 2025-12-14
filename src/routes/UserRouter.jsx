import React from "react";
import { ROUTES } from "../constants/routes";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/user/Home";
import ProductList from "../pages/user/ProductList";
import ProductDetail from "../pages/user/ProductDetail";
import Activity from "../pages/user/profile/Activity";
import ProductManagement from "../pages/user/profile/ProductManagement";
import Favorites from "../pages/user/profile/Favorites";
import Ratings from "../pages/user/profile/Ratings";
import AccountSettings from "../pages/user/profile/AccountSettings";
import ChangePassword from "../pages/user/profile/ChangePassword";
import UpgradeToSellerRequest from "../pages/user/UpgradeToSellerRequest";

import NotFound from "../pages/NotFound";

/**
 * User routes - Trang chủ, danh sách sản phẩm, hồ sơ người dùng
 */
export const UserRouter = [
  {
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: ROUTES.PRODUCT,
        element: <ProductList />,
      },
      {
        path: `${ROUTES.PRODUCT}/:productId`,
        element: <ProductDetail />,
      },
      {
        path: `${ROUTES.PROFILE}/product-management`,
        element: <ProductManagement />,
      },
      {
        path: `${ROUTES.PROFILE}/activity`,
        element: <Activity />,
      },
      {
        path: `${ROUTES.PROFILE}/favorite`,
        element: <Favorites />,
      },
      {
        path: `${ROUTES.PROFILE}/rating`,
        element: <Ratings />,
      },
      {
        path: `${ROUTES.PROFILE}/account`,
        element: <AccountSettings />,
      },
      {
        path: `${ROUTES.PROFILE}/change-password`,
        element: <ChangePassword />,
      },
      {
        path: "/user/upgrade-to-seller",
        element: <UpgradeToSellerRequest />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
