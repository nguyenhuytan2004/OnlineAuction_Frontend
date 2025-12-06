import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import formatters from "../utils/formatters";
import helpers from "../utils/helpers";

import productService from "../services/productService";
import { useAuth } from "../hooks/useAuth";

// Product Card Component
const ProductCard = ({ product }) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 overflow-hidden border border-gray-700 group">
            <Link to={`${ROUTES.PRODUCT}/${product.productId}`}>
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={product.mainImageUrl || null}
                        alt={product.productName || "Product Image"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Overlay Button */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-orange-600">
                            Xem Chi Tiết
                        </button>
                    </div>
                </div>
            </Link>

            {/* Content Section */}
            <div className="p-4">
                <h3
                    className="font-semibold text-gray-100 text-base mb-1 line-clamp-2 min-h-[3rem]"
                    title={product.productName}
                >
                    {product.productName}
                </h3>

                <div className="flex items-end justify-between mb-3">
                    <div>
                        <p className="text-xs text-gray-400">Giá hiện tại</p>
                        <p className="text-orange-500 font-bold text-lg">
                            {formatters.formatCurrency(product.currentPrice)}
                        </p>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-700 text-sm">
                    <div
                        className={`flex items-center gap-1 ${helpers.getTimeColorClass(
                            product.endTime,
                        )}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>
                            {formatters.getRemainingTime(product.endTime)}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-400 font-medium">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                        <span>{product.bidCount} lượt</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Section Component
const ProductSection = ({ title, icon, products, type }) => {
    return (
        <section className={"p-5"}>
            <div
                className={
                    "px-16 py-12 rounded-3xl container mx-auto bg-gradient-to-b from-gray-800 to-gray-850"
                }
            >
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{icon}</span>
                        <h2 className="text-2xl font-bold text-orange-400 uppercase tracking-wide border-l-4 border-orange-500 pl-3">
                            {title}
                        </h2>
                    </div>
                    <Link
                        to={ROUTES.PRODUCT}
                        className="text-orange-400 hover:text-orange-300 font-medium text-sm flex items-center gap-1 hover:underline transition"
                    >
                        Xem tất cả
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Link>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-5 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.productId}
                            product={product}
                            type={type}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- MAIN PAGE COMPONENT ---
const Home = () => {
    const [endingSoonProducts, setEndingSoonProducts] = useState([]);
    const [mostAuctionedProducts, setMostAuctionedProducts] = useState([]);
    const [highestPriceProducts, setHighestPriceProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const [endingSoon, mostAuctioned, highestPriced] =
                    await Promise.all([
                        productService.getTop5EndingSoon(),
                        productService.getTop5MostAuctioned(),
                        productService.getTop5HighestPriced(),
                    ]);

                setEndingSoonProducts(
                    Array.isArray(endingSoon) ? endingSoon : [],
                );
                setMostAuctionedProducts(
                    Array.isArray(mostAuctioned) ? mostAuctioned : [],
                );
                setHighestPriceProducts(
                    Array.isArray(highestPriced) ? highestPriced : [],
                );
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Không thể tải sản phẩm");
                setEndingSoonProducts([]);
                setMostAuctionedProducts([]);
                setHighestPriceProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Banner Section */}
            <div className="bg-gradient-to-r from-gray-900 via-orange-900 to-gray-900 text-white py-20">
                <div className="container mx-auto px-8 text-center">
                    <h1 className="text-6xl font-bold mb-4">
                        Sàn Đấu Giá Trực Tuyến
                    </h1>
                    <p className="text-orange-200 text-xl max-w-2xl mx-auto">
                        Nơi bạn tìm thấy những món đồ độc đáo với giá tốt nhất.
                    </p>
                    <p className="text-orange-200 text-xl mb-8 max-w-2xl mx-auto">
                        {" "}
                        Tham gia đấu giá ngay hôm nay!{" "}
                    </p>
                    <div className="flex justify-center gap-4">
                        {!isAuthenticated ? (
                            <Link
                                to={ROUTES.REGISTER}
                                className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 transition shadow-lg shadow-orange-500/50"
                            >
                                Đăng Ký Ngay
                            </Link>
                        ) : (
                            <Link
                                to={ROUTES.SELLER_REGISTER}
                                className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 transition shadow-lg shadow-orange-500/50"
                            >
                                Đăng Ký Bán Hàng
                            </Link>
                        )}
                        <Link
                            to={ROUTES.PRODUCT}
                            className="bg-white/10 backdrop-blur-sm border border-orange-400 text-white font-semibold py-3 px-8 rounded-full hover:bg-white/20 transition"
                        >
                            Khám Phá
                        </Link>
                    </div>
                </div>
            </div>

            {/* Loading or Error State */}
            {loading && (
                <div className="text-center py-20">
                    <div className="text-gray-400">Đang tải sản phẩm...</div>
                </div>
            )}

            {error && (
                <div className="text-center py-20">
                    <div className="text-red-400">{error}</div>
                </div>
            )}

            {!loading && !error && (
                <div className="mt-10">
                    {/* Top 5 Sản phẩm gần kết thúc */}
                    {endingSoonProducts.length > 0 && (
                        <ProductSection
                            title="Sắp Kết Thúc"
                            // icon={
                            //     <i className="fa-solid fa-hourglass-half text-orange-400"></i>
                            // }
                            products={endingSoonProducts}
                            type="nearEnd"
                        />
                    )}

                    {/* Top 5 Sản phẩm nhiều lượt ra giá */}
                    {mostAuctionedProducts.length > 0 && (
                        <ProductSection
                            title="Sôi Động Nhất"
                            // icon={
                            //     <i className="fa-solid fa-fire text-orange-400"></i>
                            // }
                            products={mostAuctionedProducts}
                            type="mostBids"
                        />
                    )}

                    {/* Top 5 Sản phẩm giá cao nhất */}
                    {highestPriceProducts.length > 0 && (
                        <ProductSection
                            title="Giá Trị Cao"
                            // icon={
                            //     <i className="fa-solid fa-coins text-orange-400"></i>
                            // }
                            products={highestPriceProducts}
                            type="highPrice"
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
