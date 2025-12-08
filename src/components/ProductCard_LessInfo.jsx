import { Link } from "react-router-dom";
import formatters from "../utils/formatters";
import { ROUTES } from "../constants/routes";
import helpers from "../utils/helpers";

const ProductCard = ({ product }) => {
    return (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 overflow-hidden border border-slate-700/50 group relative backdrop-blur-sm hover:-translate-y-2">
            {/* Gradient Overlay Border Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/0 via-orange-500/0 to-amber-500/0 group-hover:from-amber-500/20 group-hover:via-orange-500/10 group-hover:to-amber-500/20 transition-all duration-500 pointer-events-none"></div>

            <Link to={`${ROUTES.PRODUCT}/${product.productId}`}>
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                    {/* Shimmer Effect Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                    <img
                        src={product.mainImageUrl || null}
                        alt={product.productName || "Product Image"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Premium Overlay with Blur */}
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
            <div className="p-5 relative z-10">
                <h3
                    className="font-bold text-slate-100 text-base mb-3 line-clamp-2 min-h-[3rem] tracking-wide leading-relaxed group-hover:text-amber-100 transition-colors duration-300"
                    title={product.productName}
                >
                    {product.productName}
                </h3>

                <div className="flex items-end justify-between mb-4">
                    <div className="space-y-1">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                            Giá hiện tại
                        </p>
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-black text-xl tracking-tight">
                            {formatters.formatCurrency(product.currentPrice)}
                        </p>
                    </div>
                </div>

                {/* Footer Info with Enhanced Style */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 text-sm">
                    <div
                        className={`flex items-center gap-2 font-semibold ${helpers.getTimeColorClass(
                            product.endTime,
                        )}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
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
                        <span className="tracking-wide">
                            {formatters.getRemainingTime(product.endTime)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 font-semibold bg-slate-800/50 px-3 py-1.5 rounded-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
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
                        <span className="tracking-wide">
                            {product.bidCount} lượt
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
