import React, { useState } from "react";
import { UserCheckIcon, Star } from "lucide-react";

const ConfirmationStep = ({ onNext }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!confirmed) newErrors.confirmed = "Vui lòng xác nhận đã nhận hàng";
    if (rating === 0) newErrors.rating = "Vui lòng chọn mức đánh giá";
    if (!review.trim()) newErrors.review = "Vui lòng viết nhận xét";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      onNext();
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="p-8 bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-2xl border border-slate-700/50 backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <UserCheckIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-['Montserrat']">
              Xác nhận nhận hàng & Đánh giá
            </h3>
            <p className="text-sm text-gray-400 font-['Montserrat']">
              Hoàn tất quy trình mua hàng bằng cách xác nhận và đánh giá
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Received Confirmation */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4 font-['Montserrat']">
            Xác nhận nhận hàng
          </h4>
          <div
            className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
              confirmed
                ? "bg-emerald-900/30 border-emerald-500"
                : "bg-slate-800/30 border-slate-700/50 hover:border-slate-600"
            }`}
            onClick={() => {
              setConfirmed(!confirmed);
              if (errors.confirmed)
                setErrors((prev) => ({ ...prev, confirmed: "" }));
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 mt-1 ${
                  confirmed
                    ? "bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-400"
                    : "border-slate-600 hover:border-emerald-500"
                }`}
              >
                {confirmed && (
                  <i className="fa-solid fa-check text-white text-sm"></i>
                )}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold font-['Montserrat']">
                  Tôi đã nhận được hàng đúng theo mô tả
                </p>
                <p className="text-sm text-gray-400 mt-1 font-['Montserrat']">
                  Xác nhận rằng sản phẩm đã nhận được đúng thời hạn, đúng số
                  lượng và đúng như mô tả.
                </p>
              </div>
            </div>
          </div>
          {errors.confirmed && (
            <p className="text-red-400 text-sm mt-2 font-['Montserrat']">
              {errors.confirmed}
            </p>
          )}
        </div>

        {/* Rating Section */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4 font-['Montserrat']">
            Đánh giá chất lượng giao dịch
          </h4>

          {/* Star Rating */}
          <div className="p-6 bg-gradient-to-br from-slate-900/60 to-slate-800/40 rounded-xl border border-slate-700/50">
            <label className="block text-gray-300 font-semibold mb-4 font-['Montserrat']">
              Mức độ hài lòng <span className="text-red-400">*</span>
            </label>

            <div className="flex items-center gap-2 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setRating(i + 1);
                    if (errors.rating)
                      setErrors((prev) => ({ ...prev, rating: "" }));
                  }}
                  className="transition-transform duration-200 hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      i < rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-600 hover:text-amber-300"
                    }`}
                  />
                </button>
              ))}
              <span className="text-amber-400 font-semibold font-['Montserrat'] ml-2">
                {rating > 0 && `${rating}/5 sao`}
              </span>
            </div>

            {errors.rating && (
              <p className="text-red-400 text-sm font-['Montserrat']">
                {errors.rating}
              </p>
            )}

            {/* Rating Labels */}
            <div className="grid grid-cols-5 gap-2 text-xs text-center text-gray-500 font-['Montserrat'] mt-4">
              <div>Rất tệ</div>
              <div>Tệ</div>
              <div>Bình thường</div>
              <div>Tốt</div>
              <div>Tuyệt vời</div>
            </div>
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-gray-300 font-semibold mb-2 font-['Montserrat']">
            Nhận xét chi tiết <span className="text-red-400">*</span>
          </label>
          <textarea
            value={review}
            onChange={(e) => {
              setReview(e.target.value);
              if (errors.review) setErrors((prev) => ({ ...prev, review: "" }));
            }}
            placeholder="Hãy chia sẻ trải nghiệm của bạn về chất lượng sản phẩm, tốc độ giao hàng, dịch vụ khách hàng, v.v. (tối thiểu 10 ký tự)"
            rows="5"
            className={`w-full px-5 py-3 bg-gradient-to-r from-slate-800/80 to-slate-900/60 text-white border rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all font-['Montserrat'] placeholder:text-gray-500 resize-none ${
              errors.review ? "border-red-500/50" : "border-slate-600/50"
            }`}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-500 text-sm font-['Montserrat']">
              {review.length}/500 ký tự
            </p>
            {errors.review && (
              <p className="text-red-400 text-sm font-['Montserrat']">
                {errors.review}
              </p>
            )}
          </div>
        </div>

        {/* Seller Info - Preview */}
        <div className="p-6 bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-xl border border-amber-500/30">
          <p className="text-amber-300 font-semibold mb-3 font-['Montserrat']">
            Người bán sẽ nhìn thấy đánh giá của bạn
          </p>
          <p className="text-gray-300 text-sm font-['Montserrat']">
            Đánh giá của bạn rất quan trọng đối với người bán và những khách
            hàng khác. Vui lòng đánh giá trung thực dựa trên trải nghiệm của
            bạn.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-['Montserrat']"
          >
            Quay lại
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-emerald-500/50 font-['Montserrat'] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Hoàn tất"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmationStep;
