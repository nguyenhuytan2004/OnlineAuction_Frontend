import React from "react";
import { Star, User, Package, Calendar } from "lucide-react";
import RatingStars from "../RatingStars";
import formatters from "../../utils/formatters";

/**
 * Component hiển thị card rating nhận được
 */
const RatingCard = ({ rating }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {rating.reviewer.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">
                            {rating.reviewer.fullName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                {rating.reviewer.ratingScore}%
                            </span>
                            <span>•</span>
                            <span>{rating.reviewer.ratingCount} đánh giá</span>
                        </div>
                    </div>
                </div>

                {/* Rating Value */}
                <div className="text-right">
                    <RatingStars
                        rating={rating.ratingValue}
                        size="large"
                        showNumber={false}
                    />
                    <span className="text-2xl font-black text-amber-600">
                        {rating.ratingValue}/5
                    </span>
                </div>
            </div>

            {/* Product Info */}
            <div className="mb-4 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Package className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold">Sản phẩm:</span>
                    <span className="font-bold text-slate-800">
                        {rating.product.productName}
                    </span>
                </div>
            </div>

            {/* Comment */}
            {rating.comment && (
                <div className="mb-4">
                    <p className="text-slate-700 leading-relaxed italic">
                        "{rating.comment}"
                    </p>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatters.formatDateTime(rating.createdAt)}</span>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    Đã hoàn thành
                </span>
            </div>
        </div>
    );
};

export default RatingCard;
