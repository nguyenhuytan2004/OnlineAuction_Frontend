import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import { ROUTES } from "./constants/routes";

import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function App() {
    return (
        <Router>
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
                            </Routes>
                        </MainLayout>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
