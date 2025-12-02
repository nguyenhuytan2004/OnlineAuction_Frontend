import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { ROUTES } from "./constants/routes";

import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";

function App() {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path={ROUTES.HOME} element={<Home />} />
                    <Route path={ROUTES.PRODUCT} element={<ProductList />} />
                    <Route
                        path={`${ROUTES.PRODUCT}/:productId`}
                        element={<ProductDetail />}
                    />
                </Routes>
            </MainLayout>
        </Router>
    );
}

export default App;
