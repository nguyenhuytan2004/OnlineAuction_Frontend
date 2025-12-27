import React, { useState } from "react";
import { UserCheckIcon } from "lucide-react";
import orderService from "../../services/orderService";
import { ROUTES } from "../../constants/routes";
import { Link } from "react-router-dom";
import { useForm, Watch } from "react-hook-form";
import Tooltip from "../common/Tooltip";

const ConfirmationStep = ({ onNext, order }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit: checkOnSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      receiveConfirm: false,
    },
  });

  const handleSubmit = async (data) => {
    console.log("Form data:", data);
    try {
      setIsLoading(true);
      await orderService.buyerConfirmReceived(order.orderId);
      onNext();
    } catch (error) {
      console.error("Lỗi khi xác nhận nhận hàng:", error);
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
      <form onSubmit={checkOnSubmit(handleSubmit)} className="space-y-8">
        {/* Received Confirmation */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4 font-['Montserrat']">
            Xác nhận nhận hàng
          </h4>

          <div
            className={`py-6 px-8 rounded-xl border-2 transition-all duration-300 ${
              watch("receiveConfirm")
                ? "bg-emerald-900/20 border-emerald-500/50"
                : "bg-slate-800/30 border-slate-700/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                id="receiveConfirm"
                {...register("receiveConfirm", {
                  required:
                    "Vui lòng xác nhận đã nhận được tiền thanh toán từ khách hàng",
                })}
                className="w-6 h-6 mt-1 flex-shrink-0 cursor-pointer transition-all duration-200 accent-emerald-500"
              />
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
          {errors.receiveConfirm && (
            <p className="text-red-400 text-sm mt-2 font-['Montserrat']">
              {errors.receiveConfirm.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            to={`${ROUTES.PRODUCT}/${order.product.productId}`}
            className="basis-1/2 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-['Montserrat'] text-center"
          >
            Hủy
          </Link>
          {order?.status === "PAID" ? (
            <div className="relative group basis-1/2">
              <button
                disabled
                className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-emerald-500/50 font-['Montserrat'] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full"
              >
                Chưa được xác nhận
              </button>
              <Tooltip text="Người bán chưa xác nhận đã nhận tiền thanh toán của bạn" />
            </div>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="basis-1/2 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-emerald-500/50 font-['Montserrat'] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
          )}
        </div>
      </form>
    </div>
  );
};

export default ConfirmationStep;
