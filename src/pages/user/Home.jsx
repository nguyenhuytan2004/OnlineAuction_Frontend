import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../constants/routes";
import ProductCard from "../../components/ProductCard_LessInfo";

import productService from "../../services/productService";
import { useAuth } from "../../hooks/useAuth";

// Section Component with Premium Design
const ProductSection = ({ title, products }) => {
  return (
    <section className="p-8 animate-fade-in">
      <div className="px-16 py-14 rounded-[2rem] container mx-auto bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/30 shadow-2xl relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-transparent to-orange-500/20 animate-pulse"></div>
        </div>

        {/* Decorative Corner Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-br-full"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-orange-500/10 to-transparent rounded-tl-full"></div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 uppercase tracking-wider">
                {title}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-2"></div>
            </div>
          </div>
          <Link
            to={ROUTES.PRODUCT}
            className="group flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-amber-600 hover:to-orange-600 text-slate-200 hover:text-white font-bold text-sm px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-amber-500/50 border border-slate-600 hover:border-amber-500"
          >
            <span className="tracking-wider">Xem tất cả</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-5 gap-7 relative z-10">
          {products.map((product, index) => (
            <div
              key={product.productId}
              className="animate-slide-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <ProductCard product={product} />
            </div>
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
      setError(null);
      try {
        const [endingSoon, mostAuctioned, highestPriced] = await Promise.all([
          productService.getTop5EndingSoon(),
          productService.getTop5MostAuctioned(),
          productService.getTop5HighestPriced(),
        ]);

        setEndingSoonProducts(Array.isArray(endingSoon) ? endingSoon : []);
        setMostAuctionedProducts(
          Array.isArray(mostAuctioned) ? mostAuctioned : [],
        );
        setHighestPriceProducts(
          Array.isArray(highestPriced) ? highestPriced : [],
        );
        set
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Banner Section with Premium Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-28 border-b border-slate-800/50">
        {/* Animated Background Layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)] animate-pulse"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float-delayed"></div>
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-8 text-center relative z-10">
          {/* Main Heading with Gradient */}
          <h1 className="text-7xl font-black mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 animate-gradient">
              Sàn Đấu Giá
            </span>
            <br />
            <span className="text-slate-100">Trực Tuyến</span>
          </h1>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500"></div>
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500"></div>
          </div>

          {/* Subtitle */}
          <p className="text-slate-300 text-xl max-w-2xl mx-auto mb-2 leading-relaxed font-light tracking-wide">
            Nơi bạn tìm thấy những món đồ độc đáo với giá tốt nhất.
          </p>
          <p className="text-amber-400 text-xl mb-10 max-w-2xl mx-auto font-semibold tracking-wide">
            Tham gia đấu giá ngay hôm nay!
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-5">
            {!isAuthenticated ? (
              <Link
                to={ROUTES.REGISTER}
                className="group relative bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black py-4 px-10 rounded-full hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 transform hover:scale-105 uppercase tracking-wider text-sm overflow-hidden"
              >
                <span className="relative z-10">Đăng Ký Ngay</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ) : (
              <Link
                to={ROUTES.SELLER_REGISTER}
                className="group relative bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black py-4 px-10 rounded-full hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 transform hover:scale-105 uppercase tracking-wider text-sm overflow-hidden"
              >
                <span className="relative z-10">Đăng Ký Bán Hàng</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )}
            <Link
              to={ROUTES.PRODUCT}
              className="group relative bg-slate-800/50 backdrop-blur-lg border-2 border-amber-500/50 hover:border-amber-400 text-slate-100 hover:text-white font-black py-4 px-10 rounded-full hover:bg-slate-800/80 transition-all duration-300 transform hover:scale-105 uppercase tracking-wider text-sm overflow-hidden"
            >
              <span className="relative z-10">Khám Phá</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>

        {/* Bottom Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-16 fill-slate-950"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
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

      {/* Decorative Border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

      {!loading && !error && (
        <div className="mt-10">
          {/* Top 5 Sản phẩm gần kết thúc */}
          {endingSoonProducts.length > 0 && (
            <ProductSection
              title="Sắp Kết Thúc"
              products={endingSoonProducts}
              type="nearEnd"
            />
          )}

          {/* Top 5 Sản phẩm nhiều lượt ra giá */}
          {mostAuctionedProducts.length > 0 && (
            <ProductSection
              title="Sôi Động Nhất"
              products={mostAuctionedProducts}
              type="mostBids"
            />
          )}

          {/* Top 5 Sản phẩm giá cao nhất */}
          {highestPriceProducts.length > 0 && (
            <ProductSection
              title="Giá Trị Cao"
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
