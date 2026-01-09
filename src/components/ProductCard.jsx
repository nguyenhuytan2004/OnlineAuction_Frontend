import { Link } from "react-router-dom";
import formatters from "../utils/formatters";
import { ROUTES } from "../constants/routes";
import helpers from "../utils/helpers";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 overflow-hidden border border-slate-700/50 group h-full flex flex-col w-80 relative backdrop-blur-sm hover:-translate-y-2">
      {/* Gradient Overlay Border Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/0 via-orange-500/0 to-amber-500/0 group-hover:from-amber-500/20 group-hover:via-orange-500/10 group-hover:to-amber-500/20 transition-all duration-500 pointer-events-none"></div>

      <Link to={`${ROUTES.PRODUCT}/${product.productId}`}>
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-slate-950">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

          {product.mainImageUrl ? (
            <img
              src={product.mainImageUrl}
              alt={product.productName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Premium Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 px-8 rounded-full transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 hover:shadow-lg hover:shadow-amber-500/50 hover:scale-105 tracking-wide uppercase text-sm">
              Xem Chi Tiết
            </button>
          </div>

          {/* Corner Accent */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col relative z-10">
        {/* Product Name */}
        <h3
          className="font-bold text-slate-100 text-sm mb-3 line-clamp-2 min-h-[2.5rem] leading-relaxed group-hover:text-amber-100 transition-colors duration-300"
          title={product.productName}
        >
          {product.productName}
        </h3>

        {/* Price Section */}
        <div className="mb-3 space-y-2">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
              Giá hiện tại
            </p>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-black text-xl tracking-tight">
              {formatters.formatCurrency(product.currentPrice)}
            </p>
          </div>
        </div>

        {/* Buy Now Price */}
        <div className="mb-3 pb-3 border-b border-slate-700/50">
          <p className="text-xs text-slate-400 font-semibold">
            Giá mua ngay:{" "}
            {product.buyNowPrice ? (
              <span className="text-red-400 font-bold">
                {formatters.formatCurrency(product.buyNowPrice)}
              </span>
            ) : (
              <span className="text-slate-500 font-semibold">Không có</span>
            )}
          </p>
        </div>

        {/* Highest Bidder Info */}
        {product.highestBidder ? (
          <div className="mb-3 p-3 bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-xl border border-amber-700/30 text-xs backdrop-blur-sm">
            <p className="text-amber-300 font-bold mb-2 uppercase tracking-wide text-[10px]">
              Người đang đặt giá cao nhất
            </p>
            <p className="text-slate-200 font-semibold mb-2">
              {helpers.maskName(product.highestBidder.fullName)}
            </p>
            <div className="flex items-center gap-1 text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-3 w-3 ${
                    i <
                    helpers.getRatingStars(
                      product.highestBidder.ratingScore,
                      product.highestBidder.ratingCount,
                    )
                      ? "fill-yellow-400"
                      : "fill-slate-700"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-slate-400 font-semibold">
                ({product.highestBidder.ratingCount})
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/30 text-xs backdrop-blur-sm">
            <p className="text-slate-400 font-semibold text-center">
              Chưa có người đặt giá nào
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-700/50 text-xs mt-auto">
          {/* Created Date */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Ngày đăng:</span>
            <span className="text-slate-300 font-bold">
              {formatters.formatDate(product.createdAt)}
            </span>
          </div>

          {/* Time Left */}
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-slate-400 font-semibold">Còn lại:</span>
            <span
              className={`${helpers.getTimeColorClass(
                product.endTime,
              )} font-bold`}
            >
              {formatters.getRemainingTime(product.endTime)}
            </span>
          </div>

          {/* Bid Count */}
          <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="text-slate-400 font-semibold">Lượt ra giá:</span>
            <span className="font-black text-amber-400">
              {product.bidCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
