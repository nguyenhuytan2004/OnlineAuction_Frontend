import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const MainLayout = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(
                `${ROUTES.PRODUCT}?search=${encodeURIComponent(searchQuery)}`,
            );
        }
        setSearchQuery("");
    };

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
                        <form
                            onSubmit={handleSearch}
                            className="flex-1 max-w-md flex-grow"
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm, danh mục"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-6 pr-10 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 transition"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </form>

                        {/* Navigation Links */}
                        <div className="flex items-center gap-6 flex-grow">
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
