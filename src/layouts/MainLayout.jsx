import React from "react";

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 flex flex-col">
            {/* Header */}
            <header className="bg-gray-950/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 ">
                <nav className="max-w-7xl mx-auto px-8 h-20 flex items-center">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex-shrink-0">
                            <a
                                href="/"
                                className="text-2xl font-bold text-orange-400 hover:text-orange-300 transition"
                            >
                                <img
                                    src="src/assets/images/logo-transparent.png"
                                    alt="Logo Đấu Giá"
                                    className="h-20 w-auto object-contain"
                                />
                            </a>
                        </div>
                        <div className="ml-10 flex items-baseline space-x-4">
                            <a
                                href="/"
                                className="text-gray-300 hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition"
                            >
                                Trang Chủ
                            </a>
                            <a
                                href="/products"
                                className="text-gray-300 hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition"
                            >
                                Sản phẩm
                            </a>
                        </div>
                        <div className="ml-10 flex items-baseline space-x-4">
                            <a
                                href="/login"
                                className="bg-white/10 text-gray-300 hover:bg-white/30 px-3 py-2 rounded-md text-sm font-medium transition"
                            >
                                Đăng Nhập
                            </a>
                            <a
                                href="/register"
                                className="bg-orange-500 text-white hover:bg-orange-600 px-3 py-2 rounded-md text-sm font-medium transition"
                            >
                                Đăng Ký
                            </a>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-800 mt-12">
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
                                    <a
                                        href="/"
                                        className="hover:text-orange-400 transition"
                                    >
                                        Trang Chủ
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/auctions"
                                        className="hover:text-orange-400 transition"
                                    >
                                        Đấu Giá
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/contact"
                                        className="hover:text-orange-400 transition"
                                    >
                                        Liên Hệ
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4 text-orange-400">
                                Hỗ Trợ
                            </h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a
                                        href="/faq"
                                        className="hover:text-orange-400 transition"
                                    >
                                        FAQ
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/terms"
                                        className="hover:text-orange-400 transition"
                                    >
                                        Điều Khoản
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/privacy"
                                        className="hover:text-orange-400 transition"
                                    >
                                        Chính Sách Bảo Mật
                                    </a>
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
