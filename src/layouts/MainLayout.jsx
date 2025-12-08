import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import SearchBar from "../components/inputs/SearchBar";
import AvatarDropdown from "../components/AvatarDropdown";
import { useAuth } from "../hooks/useAuth";

const MainLayout = ({ children }) => {
    const location = useLocation();

    // Scroll to top when route changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location.pathname]);

    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
            {/* Header with Premium Dark Mode */}
            <header className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50 shadow-xl shadow-slate-950/50">
                <nav className="max-w-7xl mx-auto px-8 h-20 flex items-center">
                    <div className="flex flex-grow items-center justify-between w-full gap-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link
                                to={ROUTES.HOME}
                                className="group relative text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition-all duration-300"
                            >
                                <img
                                    src="/assets/images/logo-transparent.png"
                                    alt="Logo Đấu Giá"
                                    className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]"
                                />
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-grow-[1]">
                            <SearchBar />
                        </div>

                        {/* Navigation Links */}
                        <div className="flex items-center gap-6 flex-grow-[2]">
                            <div className="flex items-baseline space-x-6">
                                <Link
                                    to={ROUTES.HOME}
                                    className="relative text-slate-300 hover:text-amber-400 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 group uppercase tracking-wider"
                                >
                                    <span className="relative z-10">
                                        Trang Chủ
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 to-orange-500/0 group-hover:to-orange-500/10 rounded-lg transition-all duration-300"></div>
                                </Link>
                                <Link
                                    to={ROUTES.PRODUCT}
                                    className="relative text-slate-300 hover:text-amber-400 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 group uppercase tracking-wider"
                                >
                                    <span className="relative z-10">
                                        Sản phẩm
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 to-orange-500/0 group-hover:to-orange-500/10 rounded-lg transition-all duration-300"></div>
                                </Link>
                            </div>
                            <div className="flex items-baseline space-x-6 ml-auto">
                                {isAuthenticated ? (
                                    <AvatarDropdown />
                                ) : (
                                    <div className="flex items-baseline space-x-4 ml-auto">
                                        <Link
                                            to={ROUTES.LOGIN}
                                            className="bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-amber-400 hover:border-amber-500/50 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 uppercase tracking-wide"
                                        >
                                            Đăng Nhập
                                        </Link>
                                        <Link
                                            to={ROUTES.REGISTER}
                                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-amber-500/50 uppercase tracking-wide"
                                        >
                                            Đăng Ký
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Premium Footer */}
            <footer className="bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800/50 mt-2 relative overflow-hidden">
                {/* Decorative Border */}
                <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-8 py-12 relative z-10">
                    <div className="grid grid-cols-3 gap-12 mb-10">
                        <div>
                            <h3 className="text-xl font-black mb-5 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 uppercase tracking-wider">
                                OnlineAuction
                            </h3>
                            <p className="text-slate-400 leading-relaxed font-light">
                                Sàn đấu giá trực tuyến hàng đầu, nơi bạn tìm
                                thấy những món đồ độc đáo.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-black mb-5 text-amber-400 uppercase tracking-wider">
                                Liên Kết
                            </h3>
                            <ul className="space-y-3 text-slate-400">
                                <li>
                                    <Link
                                        to={ROUTES.HOME}
                                        className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-2 group font-semibold"
                                    >
                                        <span className="w-0 h-px bg-amber-500 group-hover:w-4 transition-all duration-300"></span>
                                        Trang Chủ
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={ROUTES.AUCTIONS}
                                        className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-2 group font-semibold"
                                    >
                                        <span className="w-0 h-px bg-amber-500 group-hover:w-4 transition-all duration-300"></span>
                                        Đấu Giá
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={ROUTES.CONTACT}
                                        className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-2 group font-semibold"
                                    >
                                        <span className="w-0 h-px bg-amber-500 group-hover:w-4 transition-all duration-300"></span>
                                        Liên Hệ
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-black mb-5 text-amber-400 uppercase tracking-wider">
                                Hỗ Trợ
                            </h3>
                            <ul className="space-y-3 text-slate-400">
                                <li>
                                    <Link
                                        to={ROUTES.FAQ}
                                        className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-2 group font-semibold"
                                    >
                                        <span className="w-0 h-px bg-amber-500 group-hover:w-4 transition-all duration-300"></span>
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={ROUTES.TERMS}
                                        className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-2 group font-semibold"
                                    >
                                        <span className="w-0 h-px bg-amber-500 group-hover:w-4 transition-all duration-300"></span>
                                        Điều Khoản
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={ROUTES.PRIVACY}
                                        className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-2 group font-semibold"
                                    >
                                        <span className="w-0 h-px bg-amber-500 group-hover:w-4 transition-all duration-300"></span>
                                        Chính Sách Bảo Mật
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Divider with Gradient */}
                    <div className="border-t border-slate-800/50 pt-8 flex items-center justify-center">
                        <div className="flex items-center gap-3">
                            <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-500/50"></div>
                            <p className="text-center text-slate-500 font-semibold tracking-wide">
                                &copy; 2025 OnlineAuction. All rights reserved.
                            </p>
                            <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-500/50"></div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
