import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Truck } from "lucide-react";
import CustomDropdown from "../common/CustomDropdown";
import orderService from "../../services/orderService";
import Tooltip from "../common/Tooltip";

const ShippingInfoStep = ({ onNext, order }) => {
  const {
    register,
    handleSubmit: checkOnSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      trackingCode: "",
      shippingCompany: "",
      notes: "",
      paymentConfirm: false,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState(null);

  const shippingCompanies = [
    "GHN (Giao Hàng Nhanh)",
    "Viettel Post",
    "J&T Express",
    "Shopee Express",
    "Grab Express",
  ];

  const handleSubmit = async (data) => {
    console.log(data);
    try {
      setIsLoading(true);
      await orderService.sellerConfirmPayment(order.orderId);
      onNext();
    } catch (error) {
      console.error("Lỗi khi xác nhận thanh toán:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Bạn có chắc chắn muốn hủy đơn hàng này không?\nHành động này không thể hoàn tác.",
    );

    if (!confirmCancel) return;

    try {
      setIsLoading(true);

      await orderService.cancelOrderByProduct(order.product.productId);

      alert("Đơn hàng đã được hủy thành công");

      // Cleanup session
      sessionStorage.removeItem("paymentContext");
      sessionStorage.removeItem("orderCreated");

      // Điều hướng (tùy bạn)
      window.location.href = "/user/activity";
    } catch (error) {
      console.error("Lỗi hủy đơn hàng:", error);
    } finally {
      setIsLoading(false);
    }
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

      {/* Form */}
      <form onSubmit={checkOnSubmit(handleSubmit)} className="space-y-6">
        {/* Tracking Code */}
        <div>
          <label className="block text-gray-300 font-semibold mb-2 font-['Montserrat']">
            Mã vận đơn (Tracking Code) <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            {...register("trackingCode", {
              required: "Vui lòng nhập mã vận đơn",
            })}
            placeholder="Nhập mã vận đơn (VD: 123456789ABC)"
            className={`w-full px-5 py-3 bg-gradient-to-r from-slate-800/80 to-slate-900/60 text-white border rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all font-['Montserrat'] placeholder:text-gray-500 ${
              errors.trackingCode ? "border-red-500/50" : "border-slate-600/50"
            }`}
          />
          {errors.trackingCode && (
            <p className="text-red-400 text-sm mt-2 font-['Montserrat']">
              {errors.trackingCode.message}
            </p>
          )}
        </div>

        {/* Shipping Company */}
        <div>
          <label className="block text-gray-300 font-semibold mb-2 font-['Montserrat']">
            Hãng vận chuyển <span className="text-red-400">*</span>
          </label>
          <CustomDropdown
            options={shippingCompanies}
            selectedIndex={selectedCompanyIndex}
            onSelect={(index) => {
              setSelectedCompanyIndex(index);
              setValue("shippingCompany", shippingCompanies[index]);
            }}
            placeholder="Chọn hãng vận chuyển"
            accentColor="emerald"
            error={false}
          />
          {/* Hidden input for form validation */}
          <input
            type="hidden"
            {...register("shippingCompany", {
              required: "Vui lòng chọn hãng vận chuyển",
            })}
            value={
              selectedCompanyIndex !== null
                ? shippingCompanies[selectedCompanyIndex]
                : ""
            }
          />
          {errors.shippingCompany && (
            <p className="text-red-400 text-sm mt-2 font-['Montserrat']">
              {errors.shippingCompany.message}
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-gray-300 font-semibold mb-2 font-['Montserrat']">
            Ghi chú cho khách hàng (tuỳ chọn)
          </label>
          <textarea
            {...register("notes")}
            placeholder="VD: Giao hàng vào buổi sáng, tránh địa điểm quá xa..."
            rows="4"
            className="w-full px-5 py-3 bg-gradient-to-r from-slate-800/80 to-slate-900/60 text-white border border-slate-600/50 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all font-['Montserrat'] placeholder:text-gray-500 resize-none"
          />
        </div>

        {/* Payment Confirmation */}
        {order?.status === "PAID" && (
          <div
            className={`py-6 px-8 rounded-xl border-2 transition-all duration-300 ${
              watch("paymentConfirm")
                ? "bg-emerald-900/20 border-emerald-500/50"
                : "bg-slate-800/30 border-slate-700/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                id="paymentConfirm"
                {...register("paymentConfirm", {
                  required:
                    "Vui lòng xác nhận đã nhận được tiền thanh toán từ khách hàng",
                })}
                className="w-6 h-6 mt-1 flex-shrink-0 cursor-pointer transition-all duration-200 accent-emerald-500"
              />
              <div className="flex-1">
                <label
                  htmlFor="paymentConfirm"
                  className="flex items-center gap-3 mb-2 cursor-pointer"
                >
                  <h4 className="text-white font-semibold font-['Montserrat']">
                    Xác nhận đã nhận tiền thanh toán
                  </h4>
                </label>

                <p className="text-sm text-gray-400 font-['Montserrat']">
                  Tôi xác nhận rằng đã nhận được toàn bộ tiền thanh toán từ
                  khách hàng.
                </p>
              </div>
            </div>
          </div>
        )}
        {errors.paymentConfirm && (
          <p className="text-red-400 text-sm font-['Montserrat'] animate-in fade-in">
            {errors.paymentConfirm.message}
          </p>
        )}

        {/* Info Box */}
        <div className="p-5 bg-gradient-to-r from-blue-900/30 via-blue-800/20 to-blue-900/30 border border-blue-500/50 rounded-xl">
          <p className="text-blue-200 text-sm font-['Montserrat'] flex items-start gap-3">
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
            className="basis-1/3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-['Montserrat']"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleCancelOrder}
            disabled={isLoading}
            className="basis-1/3 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-['Montserrat']"
          >
            Hủy đơn hàng
          </button>
          {order?.status !== "PAID" || !order?.shippingAddress ? (
            <div className="basis-1/3 group relative">
              <button
                disabled
                className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-emerald-500/50 font-['Montserrat'] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full"
              >
                Xác nhận gửi hàng
              </button>
              {!order?.shippingAddress && (
                <Tooltip text="Khách hàng chưa cung cấp địa chỉ giao hàng" />
              )}
              {order?.status !== "PAID" && (
                <Tooltip text="Chờ khách hàng thanh toán trước khi gửi hàng" />
              )}
            </div>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="basis-1/3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-emerald-500/50 font-['Montserrat'] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                "Xác nhận gửi hàng"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ShippingInfoStep;
