import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import SearchBar from "../components/inputs/SearchBar";

const MainLayout = ({ children }) => {
    const location = useLocation();

    // Scroll to top when route changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 flex flex-col">
            {/* Header */}
            <header className="bg-gray-950/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
                <nav className="max-w-7xl mx-auto px-8 h-20 flex items-center">
                    <div className="flex flex-grow items-center justify-between w-full gap-6">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link
                                to={ROUTES.HOME}
                                className="text-2xl font-bold text-orange-400 hover:text-orange-300 transition"
                            >
                                <img
                                    src="/assets/images/logo-transparent.png"
                                    alt="Logo Đấu Giá"
                                    className="h-20 w-auto object-contain"
                                />
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-grow-[1]">
                            <SearchBar />
                        </div>

                        {/* Navigation Links */}
                        <div className="flex items-center gap-6 flex-grow-[2]">
                            <div className="flex items-baseline space-x-4">
                                <Link
                                    to={ROUTES.HOME}
                                    className="text-gray-300 hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition"
                                >
                                    Trang Chủ
                                </Link>
                                <Link
                                    to={ROUTES.PRODUCT}
                                    className="text-gray-300 hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition"
                                >
                                    Sản phẩm
                                </Link>
                            </div>
                            <div className="flex items-baseline space-x-4 ml-auto">
                                <Link
                                    to={ROUTES.LOGIN}
                                    className="bg-white/10 text-gray-300 hover:bg-white/30 px-3 py-2 rounded-md text-sm font-medium transition"
                                >
                                    Đăng Nhập
                                </Link>
                                <Link
                                    to={ROUTES.REGISTER}
                                    className="bg-orange-500 text-white hover:bg-orange-600 px-3 py-2 rounded-md text-sm font-medium transition"
                                >
                                    Đăng Ký
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-800 mt-2">
                <div className="max-w-7xl mx-auto px-8 py-8">
                    <div className="grid grid-cols-3 gap-8 mb-8">
                        <div>
                            <h3 className="text-lg font-bold mb-4 text-orange-400">
                                OnlineAuction
                            </h3>
                            <p className="text-gray-400">
                                Sàn đấu giá trực tuyến hàng đầu, nơi bạn tìm
                                thấy những món đồ độc đáo.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4 text-orange-400">
                                Liên Kết
                            </h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <Link
                                        to={ROUTES.HOME}
                                        className="hover:text-orange-400 transition"
                                    >
                                        Trang Chủ
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={ROUTES.AUCTIONS}
                                        className="hover:text-orange-400 transition"
                                    >
                                        Đấu Giá
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={ROUTES.CONTACT}
                                        className="hover:text-orange-400 transition"
                                    >
                                        Liên Hệ
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4 text-orange-400">
                                Hỗ Trợ
                            </h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <Link
                                        to={ROUTES.FAQ}
                                        className="hover:text-orange-400 transition"
                                    >
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={ROUTES.TERMS}
                                        className="hover:text-orange-400 transition"
                                    >
                                        Điều Khoản
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={ROUTES.PRIVACY}
                                        className="hover:text-orange-400 transition"
                                    >
                                        Chính Sách Bảo Mật
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8">
                        <p className="text-center text-gray-500">
                            &copy; 2025 OnlineAuction. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
