import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Star, Send, X } from "lucide-react";

/**
 * Component modal đánh giá người bán
 */
const RatingModal = ({ isOpen, onClose, product, onSubmit }) => {
    const [hoveredRating, setHoveredRating] = useState(0);
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            ratingValue: 0,
            comment: "",
        },
    });

    const ratingValue = watch("ratingValue");

    const handleClose = () => {
        reset();
        setHoveredRating(0);
        onClose();
    };

    const onSubmitForm = async (data) => {
        try {
            await onSubmit({
                productId: product.productId,
                ratingValue: data.ratingValue,
                comment: data.comment,
            });
            handleClose();
        } catch (error) {
            console.error("Rating submission error:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-black mb-2">
                        Đánh giá người bán
                    </h2>
                    <p className="text-amber-50">
                        Chia sẻ trải nghiệm của bạn về sản phẩm này
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmitForm)} className="p-6">
                    {/* Product Info */}
                    <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-start gap-4">
                            <img
                                src={product.mainImageUrl}
                                alt={product.productName}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 mb-1">
                                    {product.productName}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Người bán: {product.seller?.fullName}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-3">
                            Đánh giá của bạn{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() =>
                                        setValue("ratingValue", star)
                                    }
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-125 focus:outline-none"
                                >
                                    <Star
                                        className={`w-12 h-12 transition-colors ${
                                            star <=
                                            (hoveredRating || ratingValue)
                                                ? "fill-amber-400 text-amber-400"
                                                : "fill-slate-200 text-slate-200"
                                        }`}
                                    />
                                </button>
                            ))}
                            {ratingValue > 0 && (
                                <span className="ml-4 text-2xl font-black text-amber-600">
                                    {ratingValue}/5
                                </span>
                            )}
                        </div>
                        <input
                            type="hidden"
                            {...register("ratingValue", {
                                required: "Vui lòng chọn số sao đánh giá",
                                min: {
                                    value: 1,
                                    message: "Vui lòng chọn ít nhất 1 sao",
                                },
                            })}
                        />
                        {errors.ratingValue && (
                            <p className="mt-2 text-sm text-red-600 font-semibold">
                                {errors.ratingValue.message}
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div className="mb-6">
                        <label
                            htmlFor="comment"
                            className="block text-sm font-bold text-slate-700 mb-2"
                        >
                            Nhận xét (Tùy chọn)
                        </label>
                        <textarea
                            id="comment"
                            {...register("comment", {
                                maxLength: {
                                    value: 1000,
                                    message:
                                        "Nhận xét không được quá 1000 ký tự",
                                },
                            })}
                            rows={4}
                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all resize-none"
                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm và người bán..."
                        />
                        <div className="flex justify-between items-center mt-2">
                            {errors.comment && (
                                <p className="text-sm text-red-600 font-semibold">
                                    {errors.comment.message}
                                </p>
                            )}
                            <span className="text-sm text-slate-500 ml-auto">
                                {watch("comment")?.length || 0}/1000
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-3 px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Đang gửi...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Gửi đánh giá
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RatingModal;
