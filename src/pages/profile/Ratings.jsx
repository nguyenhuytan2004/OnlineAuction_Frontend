import React, { useState, useEffect } from "react";
import {
    Star,
    User,
    Package,
    Calendar,
    MessageSquare,
    ThumbsUp,
    ThumbsDown,
} from "lucide-react";
import userProfileService from "../../services/userProfileService";
import formatters from "../../utils/formatters";
import helpers from "../../utils/helpers";

/**
 * Component hiển thị đánh giá nhận được từ người khác
 */
const Ratings = () => {
    const [loading, setLoading] = useState(false);
    const [ratings, setRatings] = useState([]);
    const [stats, setStats] = useState({
        positiveCount: 0,
        negativeCount: 0,
        totalRatings: 0,
        percentage: 0,
    });

    useEffect(() => {
        const loadRatings = async () => {
            setLoading(true);
            try {
                const data = await userProfileService.getRatings();
                setRatings(data);
                calculateStats(data);
            } catch (error) {
                console.error("Error loading ratings:", error);
            } finally {
                setLoading(false);
            }
        };

        loadRatings();
    }, []);

    const calculateStats = (ratingsData) => {
        if (!ratingsData || ratingsData.length === 0) {
            setStats({
                positiveCount: 0,
                negativeCount: 0,
                totalRatings: 0,
                percentage: 0,
            });
            return;
        }

        let positiveCount = 0;
        let negativeCount = 0;

        ratingsData.forEach((rating) => {
            if (rating.ratingValue === 1) {
                positiveCount++;
            } else if (rating.ratingValue === -1) {
                negativeCount++;
            }
        });

        const totalRatings = ratingsData.length;
        const percentage =
            totalRatings === 0
                ? 0
                : Math.round((positiveCount / totalRatings) * 100);

        setStats({
            positiveCount,
            negativeCount,
            totalRatings,
            percentage,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-green-500/20 p-8 mb-8 border border-slate-700/50 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <Star className="w-12 h-12 text-green-400 fill-green-400/30" />
                        <div>
                            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-2 tracking-tight">
                                Đánh Giá Của Tôi
                            </h1>
                            <p className="text-slate-300 font-semibold tracking-wide">
                                Xem các đánh giá bạn nhận được từ người bán
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8 px-24">
                    {/* Rating Percentage Card */}
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-xl p-8 border border-slate-700/50 backdrop-blur-sm hover:shadow-green-500/20 transition-all duration-500">
                        <div className="text-center space-y-4">
                            <p className="text-lg text-slate-400 uppercase tracking-wider font-bold mb-2">
                                Tỉ Lệ Đánh Giá Tích Cực
                            </p>
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                                    {stats.percentage}%
                                </span>
                            </div>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                {Array.from(
                                    {
                                        length: helpers.getRatingStars(
                                            stats.percentage,
                                            100,
                                        ),
                                    },
                                    (_, i) => (
                                        <Star
                                            key={i}
                                            className="w-5 h-5 fill-amber-400 text-amber-400"
                                        />
                                    ),
                                )}
                                {Array.from(
                                    {
                                        length:
                                            5 -
                                            helpers.getRatingStars(
                                                stats.percentage,
                                                100,
                                            ),
                                    },
                                    (_, i) => (
                                        <Star
                                            key={`empty-${i}`}
                                            className="w-5 h-5 text-slate-600"
                                        />
                                    ),
                                )}
                            </div>
                            <p className="text-slate-400 font-semibold">
                                {stats.totalRatings} đánh giá
                            </p>
                        </div>
                    </div>

                    {/* Rating Breakdown Card */}
                    <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-xl p-8 border border-slate-700/50 backdrop-blur-sm flex flex-col items-center space-y-8 hover:shadow-green-500/20 transition-all duration-500">
                        <p className="text-lg text-slate-400 uppercase tracking-wider font-bold mb-4">
                            Phân Bố Đánh Giá
                        </p>
                        <div className="flex justify-evenly w-full">
                            {/* Positive Ratings */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2 min-w-[7rem]">
                                    <ThumbsUp className="w-5 h-5 text-green-400" />
                                    <span className="text-slate-300 font-bold">
                                        Tích cực
                                    </span>
                                </div>
                                <p>{stats.positiveCount} lượt</p>
                            </div>
                            {/* Negative Ratings */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2 min-w-[7rem]">
                                    <ThumbsDown className="w-5 h-5 text-red-400" />
                                    <span className="text-slate-300 font-bold">
                                        Tiêu cực
                                    </span>
                                </div>
                                <p>{stats.negativeCount} lượt</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ratings List */}
                <div>
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-green-500/50"></div>
                        </div>
                    ) : ratings.length === 0 ? (
                        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-700/50 rounded-2xl p-12 text-center backdrop-blur-sm shadow-xl">
                            <Star className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-300 font-semibold text-lg mb-2">
                                Chưa có đánh giá
                            </p>
                            <p className="text-slate-400">
                                Bạn chưa nhận được đánh giá nào từ người bán
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {ratings.map((rating) => (
                                <div
                                    key={rating.ratingId}
                                    className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 overflow-hidden border border-slate-700/50 group backdrop-blur-sm"
                                >
                                    <div className="p-6">
                                        {/* Header - Product & Rating */}
                                        <div className="flex items-start justify-between mb-4 pb-4 border-b border-slate-700/50">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className="w-14 h-14 flex-shrink-0 relative">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <img
                                                        src={
                                                            rating.product
                                                                .mainImageUrl ||
                                                            null
                                                        }
                                                        alt={
                                                            rating.product
                                                                .productName
                                                        }
                                                        className="w-full h-full object-cover rounded-lg border border-slate-700 group-hover:border-lime-500/50 transition-all duration-300 relative z-10"
                                                        onError={(e) => {
                                                            e.target.src =
                                                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='h-12 w-12 text-gray-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' /%3E%3C/svg%3E";
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-slate-100 text-lg mb-1 group-hover:text-green-100 transition-colors">
                                                        {
                                                            rating.product
                                                                .productName
                                                        }
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>
                                                            {formatters.formatDateTime(
                                                                rating.ratedAt,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {rating.ratingValue === 1 ? (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full border border-green-500/30">
                                                        <ThumbsUp className="w-5 h-5 text-green-400" />
                                                        <span className="text-green-300 font-bold text-sm">
                                                            Tích cực
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-full border border-red-500/30">
                                                        <ThumbsDown className="w-5 h-5 text-red-400" />
                                                        <span className="text-red-300 font-bold text-sm">
                                                            Tiêu cực
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Reviewer Info */}
                                        <div className="flex items-center gap-3 mb-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-200">
                                                    {rating.reviewer.fullName}
                                                </p>
                                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                                    <span>
                                                        {rating.reviewer
                                                            .role === "SELLER"
                                                            ? "Người bán"
                                                            : "Người mua"}
                                                    </span>
                                                    {rating.reviewer
                                                        .ratingScore &&
                                                        rating.reviewer
                                                            .ratingCount >
                                                            0 && (
                                                            <>
                                                                <span>•</span>
                                                                {Array.from(
                                                                    {
                                                                        length: helpers.getRatingStars(
                                                                            rating
                                                                                .reviewer
                                                                                .ratingScore,
                                                                            rating
                                                                                .reviewer
                                                                                .ratingCount,
                                                                        ),
                                                                    },
                                                                    (_, i) => (
                                                                        <Star
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="w-3 h-3 text-amber-400 fill-amber-400"
                                                                        />
                                                                    ),
                                                                )}
                                                                <span className="text-slate-500">
                                                                    (
                                                                    {
                                                                        rating
                                                                            .reviewer
                                                                            .ratingCount
                                                                    }{" "}
                                                                    đánh giá)
                                                                </span>
                                                            </>
                                                        )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Comment */}
                                        {rating.comment && (
                                            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-700/50">
                                                <div className="flex items-start gap-2 mb-2">
                                                    <MessageSquare className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                                    <p className="font-bold text-slate-300 text-sm uppercase tracking-wider">
                                                        Nhận xét
                                                    </p>
                                                </div>
                                                <p className="text-slate-300 leading-relaxed pl-7">
                                                    {rating.comment}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Ratings;
