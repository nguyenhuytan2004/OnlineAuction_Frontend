import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import { ROUTES } from "./constants/routes";

import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProductManagement from "./pages/profile/ProductManagement";
import Favorites from "./pages/profile/Favorites";
import Ratings from "./pages/profile/Ratings";
import AccountSettings from "./pages/profile/AccountSettings";
import ChangePassword from "./pages/profile/ChangePassword";

function App() {
    return (
        <Routes>
            {/* Auth Routes */}
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

            {/* Main Routes */}
            <Route
                path="*"
                element={
                    <MainLayout>
                        <Routes>
                            <Route path={ROUTES.HOME} element={<Home />} />
                            <Route
                                path={ROUTES.PRODUCT}
                                element={<ProductList />}
                            />
                            <Route
                                path={`${ROUTES.PRODUCT}/:productId`}
                                element={<ProductDetail />}
                            />
                            <Route
                                path={`${ROUTES.PROFILE}/info`}
                                element={<ProductManagement />}
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
                        </Routes>
                    </MainLayout>
                }
            />
        </Routes>
    );
}

export default App;
