import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ThumbsUp, ThumbsDown, Send, X } from "lucide-react";

const BuyerRatingModal = ({
  isOpen,
  onClose,
  product,
  onSubmit,
  isSeller = true,
  initialRating,
}) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      ratingValue: initialRating?.ratingValue || null,
      comment: initialRating?.comment || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        ratingValue: initialRating?.ratingValue || null,
        comment: initialRating?.comment || "",
      });
      setSelectedRating(initialRating?.ratingValue || null);
    }
  }, [isOpen, initialRating, reset]);

  const handleClose = () => {
    reset();
    setSelectedRating(null);
    onClose();
  };

  const handleRatingSelect = (value) => {
    setSelectedRating(value);
    setValue("ratingValue", value);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl w-[480px] overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-700">
        {/* Header with Green Theme */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-black mb-2">
            {isSeller ? "Đánh giá người mua" : "Đánh giá người bán"}
          </h2>
          <p className="text-green-50">
            {isSeller
              ? "Đánh giá người chiến thắng sản phẩm này."
              : "Đánh giá người bán sản phẩm này."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 relative">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500/10 to-transparent rounded-tr-full"></div>

          {/* Product Info */}
          <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="flex items-start gap-4">
              <img
                src={product.mainImageUrl || null}
                alt={product.productName}
                className="w-12 h-12 object-cover rounded-lg border border-slate-600"
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-100 mb-1">
                  {product.productName}
                </h3>
                <p className="text-sm text-slate-400">
                  {isSeller
                    ? `Người mua: ${product.highestBidder?.fullName || "N/A"}`
                    : `Người bán: ${product.seller?.fullName || "N/A"}`}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Options */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-200 mb-3">
              Đánh giá của bạn <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-4 justify-center">
              {/* Positive Rating */}
              <button
                type="button"
                onClick={() => handleRatingSelect(1)}
                className={`flex flex-col items-center gap-3 px-8 py-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedRating === 1
                    ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/30 scale-105"
                    : "border-slate-600 hover:border-green-400 hover:bg-green-500/5"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    selectedRating === 1 ? "bg-green-500" : "bg-slate-700"
                  }`}
                >
                  <ThumbsUp
                    className={`w-6 h-6 ${
                      selectedRating === 1 ? "text-white" : "text-slate-400"
                    }`}
                  />
                </div>
                <div className="text-center">
                  <p
                    className={`font-black text-xs ${
                      selectedRating === 1 ? "text-green-400" : "text-slate-400"
                    }`}
                  >
                    Tích cực (+1)
                  </p>
                </div>
              </button>

              {/* Negative Rating */}
              <button
                type="button"
                onClick={() => handleRatingSelect(-1)}
                className={`flex flex-col items-center gap-3 px-8 py-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedRating === -1
                    ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/30 scale-105"
                    : "border-slate-600 hover:border-red-400 hover:bg-red-500/5"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    selectedRating === -1 ? "bg-red-500" : "bg-slate-700"
                  }`}
                >
                  <ThumbsDown
                    className={`w-6 h-6 ${
                      selectedRating === -1 ? "text-white" : "text-slate-400"
                    }`}
                  />
                </div>
                <div className="text-center">
                  <p
                    className={`font-black text-xs ${
                      selectedRating === -1 ? "text-red-400" : "text-slate-400"
                    }`}
                  >
                    Tiêu cực (-1)
                  </p>
                </div>
              </button>
            </div>
            <input
              type="hidden"
              {...register("ratingValue", {
                required: "Vui lòng chọn đánh giá",
              })}
            />
            {errors.ratingValue && (
              <p className="mt-3 text-sm text-red-400 font-semibold text-center">
                {errors.ratingValue.message}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label
              htmlFor="comment"
              className="block text-sm font-bold text-slate-200 mb-2"
            >
              Nhận xét{" "}
              {selectedRating === -1 && <span className="text-red-400">*</span>}
            </label>
            <textarea
              id="comment"
              {...register("comment", {
                required:
                  selectedRating === -1
                    ? "Vui lòng nhận xét cho đánh giá tiêu cực"
                    : false,
                maxLength: {
                  value: 255,
                  message: "Nhận xét không được quá 255 ký tự",
                },
              })}
              className="w-full h-20 px-4 py-3 bg-slate-800/50 border-2 border-slate-600 rounded-xl focus:border-slate-500 focus:ring-4 focus:ring-slate-500/20 transition-all resize-none text-slate-100 placeholder-slate-500 focus:outline-none"
              placeholder={
                selectedRating === -1
                  ? "Vui lòng mô tả lý do người mua không thanh toán..."
                  : "Chia sẻ trải nghiệm của bạn về người mua..."
              }
            />
            <div className="flex justify-between items-center mt-2">
              {errors.comment && (
                <p className="text-sm text-red-400 font-semibold">
                  {errors.comment.message}
                </p>
              )}
              <span className="text-sm text-slate-500 ml-auto">
                {watch("comment")?.length || 0}/255
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 relative z-10">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-6 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

export default BuyerRatingModal;
