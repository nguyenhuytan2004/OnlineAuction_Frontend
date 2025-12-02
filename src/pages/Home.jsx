import React from "react";
import { Link } from "react-router-dom";
import formatters from "../utils/formatters";

// --- MOCK DATA (Dữ liệu giả lập để hiển thị giao diện) ---
const nearEndProducts = [
    {
        id: 1,
        name: "iPhone 15 Pro Max Titanium",
        price: 24500000,
        bids: 12,
        timeLeft: "00:05:30",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=300",
        isHot: true,
    },
    {
        id: 2,
        name: "MacBook Air M2 Midnight",
        price: 18200000,
        bids: 8,
        timeLeft: "00:12:15",
        image: "https://images.unsplash.com/photo-1659218467796-11809326885c?auto=format&fit=crop&q=80&w=300",
    },
    {
        id: 3,
        name: "Sony WH-1000XM5",
        price: 5600000,
        bids: 25,
        timeLeft: "00:45:00",
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=300",
    },
    {
        id: 4,
        name: "iPad Air 5 Blue",
        price: 11000000,
        bids: 5,
        timeLeft: "01:20:00",
        image: "https://images.unsplash.com/photo-1647225134708-36c57f202525?auto=format&fit=crop&q=80&w=300",
    },
    {
        id: 5,
        name: "Apple Watch Series 9",
        price: 8500000,
        bids: 15,
        timeLeft: "01:55:00",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=300",
    },
];

const mostBidsProducts = [
    {
        id: 6,
        name: "Mechanical Keychron Q1",
        price: 3200000,
        bids: 145,
        timeLeft: "2 days",
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=300",
        isNew: true,
    },
    {
        id: 7,
        name: "Logitech MX Master 3S",
        price: 1800000,
        bids: 89,
        timeLeft: "1 day",
        image: "https://images.unsplash.com/photo-1631024724203-51b54a2054db?auto=format&fit=crop&q=80&w=300",
    },
    {
        id: 8,
        name: "Kindle Paperwhite 5",
        price: 2100000,
        bids: 76,
        timeLeft: "5 hours",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300",
    },
    {
        id: 9,
        name: "Fujifilm X-T5 Body",
        price: 35000000,
        bids: 64,
        timeLeft: "3 days",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=300",
    },
    {
        id: 10,
        name: "Nintendo Switch OLED",
        price: 6500000,
        bids: 55,
        timeLeft: "12 hours",
        image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&q=80&w=300",
    },
];

const highPriceProducts = [
    {
        id: 11,
        name: "Rolex Submariner Date",
        price: 350000000,
        bids: 4,
        timeLeft: "5 days",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=300",
    },
    {
        id: 12,
        name: "Leica Q3 Camera",
        price: 150000000,
        bids: 2,
        timeLeft: "6 days",
        image: "https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&q=80&w=300",
    },
    {
        id: 13,
        name: "Hermès Birkin Bag",
        price: 450000000,
        bids: 12,
        timeLeft: "4 days",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=300",
    },
    {
        id: 14,
        name: "Diamond Ring 1.5ct",
        price: 120000000,
        bids: 8,
        timeLeft: "2 days",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=300",
    },
    {
        id: 15,
        name: "Vintage Gibson Les Paul",
        price: 95000000,
        bids: 18,
        timeLeft: "1 day",
        image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&q=80&w=300",
    },
];

// --- COMPONENTS CON (UI Components) ---

// 1. Product Card Component
const ProductCard = ({ product, type }) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 overflow-hidden border border-gray-700 group">
            <Link to={`/products/${product.id}`}>
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isNew && (
                            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm animate-pulse">
                                MỚI
                            </span>
                        )}
                        {type === "nearEnd" && (
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                                🔥 Gấp
                            </span>
                        )}
                    </div>

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
                    title={product.name}
                >
                    {product.name}
                </h3>

                <div className="flex items-end justify-between mb-3">
                    <div>
                        <p className="text-xs text-gray-400">Giá hiện tại</p>
                        <p className="text-orange-400 font-bold text-lg">
                            {formatters.formatCurrency(product.price)}
                        </p>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-700 text-sm">
                    <div
                        className={`flex items-center gap-1 ${
                            type === "nearEnd"
                                ? "text-red-400 font-semibold"
                                : "text-gray-400"
                        }`}
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
                        <span>{product.timeLeft}</span>
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
                        <span>{product.bids} lượt</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 2. Section Component
const ProductSection = ({
    title,
    icon,
    products,
    type,
    bgColor = "bg-gray-850",
}) => {
    return (
        <section className={`py-10 ${bgColor}`}>
            <div className="container mx-auto px-8">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{icon}</span>
                        <h2 className="text-2xl font-bold text-gray-100 uppercase tracking-wide border-l-4 border-orange-500 pl-3">
                            {title}
                        </h2>
                    </div>
                    <Link
                        to="/products"
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
                            key={product.id}
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
    return (
        <div className="min-h-screen bg-gray-800">
            {/* Banner / Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 via-orange-900 to-gray-900 text-white py-20">
                <div className="container mx-auto px-8 text-center">
                    <h1 className="text-6xl font-bold mb-4">
                        Sàn Đấu Giá Trực Tuyến
                    </h1>
                    <p className="text-orange-200 text-xl mb-8 max-w-2xl mx-auto">
                        Nơi bạn tìm thấy những món đồ độc đáo với giá tốt nhất.
                        Tham gia đấu giá ngay hôm nay!
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/register"
                            className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 transition shadow-lg shadow-orange-500/50"
                        >
                            Đăng Ký Ngay
                        </Link>
                        <Link
                            to="/products"
                            className="bg-white/10 backdrop-blur-sm border border-orange-400 text-white font-semibold py-3 px-8 rounded-full hover:bg-white/20 transition"
                        >
                            Khám Phá
                        </Link>
                    </div>
                </div>
            </div>

            {/* 1.2 Top 5 Sản phẩm gần kết thúc */}
            <ProductSection
                title="Sắp Kết Thúc"
                icon="⏳"
                products={nearEndProducts}
                type="nearEnd"
                bgColor="bg-gray-900"
            />

            {/* 1.2 Top 5 Sản phẩm nhiều lượt ra giá */}
            <ProductSection
                title="Sôi Động Nhất"
                icon="🔥"
                products={mostBidsProducts}
                type="mostBids"
                bgColor="bg-gray-900"
            />

            {/* 1.2 Top 5 Sản phẩm giá cao nhất */}
            <ProductSection
                title="Giá Trị Cao"
                icon="💎"
                products={highPriceProducts}
                type="highPrice"
                bgColor="bg-gray-900"
            />

            {/* Call to Action Bottom */}
            <div className="bg-gradient-to-r from-gray-900 via-orange-900 to-gray-900 py-16">
                <div className="container mx-auto px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Bạn có món đồ muốn bán?
                    </h2>
                    <p className="text-orange-100 mb-8 text-lg">
                        Trở thành người bán ngay hôm nay để tiếp cận hàng ngàn
                        người mua tiềm năng.
                    </p>
                    <Link
                        to="/register-seller"
                        className="inline-block bg-white text-orange-600 font-bold py-3 px-8 rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition"
                    >
                        Đăng Ký Bán Hàng
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
