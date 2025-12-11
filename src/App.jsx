import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./constants/routes";

import UserLayout from "./layouts/UserLayout";
import AuthLayout from "./layouts/AuthLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Home from "./pages/user/Home";
import ProductList from "./pages/user/ProductList";
import ProductDetail from "./pages/user/ProductDetail";
import Activity from "./pages/user/profile/Activity";
import ProductManagement from "./pages/user/profile/ProductManagement";
import Favorites from "./pages/user/profile/Favorites";
import Ratings from "./pages/user/profile/Ratings";
import AccountSettings from "./pages/user/profile/AccountSettings";
import ChangePassword from "./pages/user/profile/ChangePassword";

function App() {
    return (
        <Routes>
            {/* Auth routes */}
            <Route
                path={ROUTES.LOGIN}
                element={
                    <AuthLayout>
                        <Login />
                    </AuthLayout>
                }
            />
            <Route
                path={ROUTES.REGISTER}
                element={
                    <AuthLayout>
                        <Register />
                    </AuthLayout>
                }
            />

            {/* User routes */}
            <Route path={ROUTES.HOME} element={<UserLayout />}>
                <Route index element={<Home />} />

                <Route path={ROUTES.PRODUCT} element={<ProductList />} />
                <Route
                    path={`${ROUTES.PRODUCT}/:productId`}
                    element={<ProductDetail />}
                />
                <Route
                    path={`${ROUTES.PROFILE}/product-management`}
                    element={<ProductManagement />}
                />
                <Route
                    path={`${ROUTES.PROFILE}/activity`}
                    element={<Activity />}
                />
                <Route
                    path={`${ROUTES.PROFILE}/favorites`}
                    element={<Favorites />}
                />
                <Route
                    path={`${ROUTES.PROFILE}/ratings`}
                    element={<Ratings />}
                />
                <Route
                    path={`${ROUTES.PROFILE}/account`}
                    element={<AccountSettings />}
                />
                <Route
                    path={`${ROUTES.PROFILE}/password`}
                    element={<ChangePassword />}
                />

                <Route path="*" element={<div>404 Page Not Found</div>} />
            </Route>
        </Routes>
    );
}

export default App;
