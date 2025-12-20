import React, { useState } from "react";
import { Truck, FileText, DollarSign } from "lucide-react";

const ShippingInfoStep = ({ onNext }) => {
  const [formData, setFormData] = useState({
    trackingCode: "",
    shippingCompany: "",
    notes: "",
  });

  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const shippingCompanies = [
    "GHN (Giao Hàng Nhanh)",
    "Viettel Post",
    "J&T Express",
    "Shopee Express",
    "Grab Express",
    "Khác",
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.trackingCode.trim())
      newErrors.trackingCode = "Vui lòng nhập mã vận đơn";
    if (!formData.shippingCompany.trim())
      newErrors.shippingCompany = "Vui lòng chọn hãng vận chuyển";
    if (!paymentConfirmed)
      newErrors.payment = "Vui lòng xác nhận đã nhận tiền thanh toán";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
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
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-['Montserrat']">
              Giao hàng & Hóa đơn vận chuyển
            </h3>
            <p className="text-sm text-gray-400 font-['Montserrat']">
              Vui lòng nhập thông tin giao hàng và xác nhận thanh toán
            </p>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="p-5 bg-gradient-to-r from-emerald-900/30 via-emerald-800/20 to-emerald-900/30 border border-emerald-500/50 rounded-xl">
        <p className="text-emerald-200 text-sm font-['Montserrat'] flex items-start gap-3">
          <i className="fa-solid fa-check-circle mt-0.5 text-emerald-400"></i>
          <span>
            Bạn đã nhận được tiền thanh toán từ khách hàng. Vui lòng xác nhận và
            gửi hoá đơn vận chuyển để bắt đầu quá trình giao hàng.
          </span>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tracking Code */}
        <div>
          <label className="block text-gray-300 font-semibold mb-2 font-['Montserrat']">
            Mã vận đơn (Tracking Code) <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="trackingCode"
            value={formData.trackingCode}
            onChange={handleInputChange}
            placeholder="Nhập mã vận đơn (VD: 123456789ABC)"
            className={`w-full px-5 py-3 bg-gradient-to-r from-slate-800/80 to-slate-900/60 text-white border rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all font-['Montserrat'] placeholder:text-gray-500 ${
              errors.trackingCode ? "border-red-500/50" : "border-slate-600/50"
            }`}
          />
          {errors.trackingCode && (
            <p className="text-red-400 text-sm mt-2 font-['Montserrat']">
              {errors.trackingCode}
            </p>
          )}
        </div>

        {/* Shipping Company */}
        <div>
          <label className="block text-gray-300 font-semibold mb-2 font-['Montserrat']">
            Hãng vận chuyển <span className="text-red-400">*</span>
          </label>
          <select
            name="shippingCompany"
            value={formData.shippingCompany}
            onChange={handleInputChange}
            className={`w-full px-5 py-3 bg-gradient-to-r from-slate-800/80 to-slate-900/60 text-white border rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all font-['Montserrat'] ${
              errors.shippingCompany
                ? "border-red-500/50"
                : "border-slate-600/50"
            }`}
          >
            <option value="">-- Chọn hãng vận chuyển --</option>
            {shippingCompanies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
          {errors.shippingCompany && (
            <p className="text-red-400 text-sm mt-2 font-['Montserrat']">
              {errors.shippingCompany}
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-gray-300 font-semibold mb-2 font-['Montserrat']">
            Ghi chú cho khách hàng (tuỳ chọn)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="VD: Giao hàng vào buổi sáng, tránh địa điểm quá xa..."
            rows="4"
            className="w-full px-5 py-3 bg-gradient-to-r from-slate-800/80 to-slate-900/60 text-white border border-slate-600/50 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all font-['Montserrat'] placeholder:text-gray-500 resize-none"
          />
        </div>

        {/* Payment Confirmation */}
        <div
          className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
            paymentConfirmed
              ? "bg-emerald-900/30 border-emerald-500"
              : "bg-slate-800/30 border-slate-700/50 hover:border-slate-600"
          }`}
          onClick={() => setPaymentConfirmed(!paymentConfirmed)}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 mt-1 ${
                paymentConfirmed
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-400"
                  : "border-slate-600 hover:border-emerald-500"
              }`}
            >
              {paymentConfirmed && (
                <i className="fa-solid fa-check text-white text-sm"></i>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h4 className="text-white font-semibold font-['Montserrat']">
                  Xác nhận đã nhận tiền thanh toán
                </h4>
              </div>
              <p className="text-sm text-gray-400 font-['Montserrat']">
                Tôi xác nhận rằng đã nhận được toàn bộ tiền thanh toán từ khách
                hàng thông qua các phương thức thanh toán trước đó.
              </p>
            </div>
          </div>
        </div>

        {errors.payment && (
          <p className="text-red-400 text-sm font-['Montserrat']">
            {errors.payment}
          </p>
        )}

        {/* Info Box */}
        <div className="p-5 bg-gradient-to-r from-blue-900/30 via-blue-800/20 to-blue-900/30 border border-blue-500/50 rounded-xl">
          <p className="text-blue-200 text-sm font-['Montserrat'] flex items-start gap-3">
            <i className="fa-solid fa-info-circle mt-0.5 text-blue-400"></i>
            <span>
              Khách hàng sẽ nhận được hoá đơn vận chuyển và có thể theo dõi đơn
              hàng thông qua mã vận đơn. Đảm bảo thông tin chính xác để tránh
              lỗi giao hàng.
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-['Montserrat']"
          >
            Hủy
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
              "Xác nhận và gửi"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingInfoStep;
