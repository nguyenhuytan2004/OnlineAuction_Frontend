import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, Check } from "lucide-react";
import paymentService from "../../services/paymentService";
import { ROUTES } from "../../constants/routes";
import formatters from "../../utils/formatters";

const PaymentStep = ({
  userId,
  productId,
  productName,
  price,
  paymentType,
  onPaymentSuccess, // Callback khi thanh toán thành công
  onPaymentError, // Callback khi thanh toán thất bại
}) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

  /**
   * Kiểm tra nếu đây là callback từ PayOS
   * PayOS trả về: ?code=00 (thành công) hoặc khác
   */
  useEffect(() => {
    const code = searchParams.get("code");
    const cancel = searchParams.get("cancel");
    const status = searchParams.get("status");

    // Nếu có code, có nghĩa là đang về từ PayOS callback
    if (!code) return;
    if (code === "00" && cancel === "false" && status === "PAID") {
      onPaymentSuccess();
    } else {
      // Thanh toán thất bại
      const errorMessage = `Thanh toán thất bại (Mã lỗi: ${code})`;
      if (onPaymentError) {
        onPaymentError(errorMessage);
      }
    }
  }, [searchParams, onPaymentSuccess, onPaymentError]);

  const parsePriceToNumber = (price) => {
    if (typeof price === "number") return price;

    if (typeof price === "string") {
      return Number(price.replace(/[^\d]/g, ""));
    }

    return 0;
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      const amount = parsePriceToNumber(10000);

      const res =
        selectedPayment === "momo"
          ? await paymentService.createMomoPayment({
              amount,
              orderInfo: `Thanh toán ${productName}`,
            })
          : await paymentService.createPayOSPayment({
              orderName: `Thanh toán ${productName}`,
              description: ``,
              amount,
              userId,
              type: paymentType,
              productId,
              returnUrl: `${window.location.origin}/upgrade-to-seller`,
              cancelUrl: `${window.location.origin}/upgrade-to-seller`,
            });

      if (!res?.checkoutUrl) {
        throw new Error(
          "Không nhận được checkoutUrl từ phương thức thanh toán",
        );
      }

      // Redirect đến màn hình thanh toán của nhà cung cấp dịch vụ
      window.location.href = res.checkoutUrl;
    } catch (err) {
      console.error("Init payment failed", err);
      const errorMsg = err?.message || "Không thể khởi tạo thanh toán";
      if (onPaymentError) {
        onPaymentError(errorMsg);
      } else {
        alert(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: "momo",
      name: "MoMo",
      logo: "https://static.momocdn.net/app/img/payment/logo.png",
      color: "from-pink-600 to-pink-700",
      bgColor: "from-pink-900/30 to-pink-800/20",
      borderColor: "border-pink-500/50",
      description: "Thanh toán qua ví MoMo",
    },
    {
      id: "payos",
      name: "PayOS",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzyLwczXxezKsQjX4t5uvXGWDvlwwOwuX-1A&s",
      color: "from-blue-600 to-blue-700",
      bgColor: "from-blue-900/30 to-blue-800/20",
      borderColor: "border-blue-500/50",
      description: "Thanh toán qua ví PayOS",
    },
    {
      id: "vnpay",
      name: "VNPay-QR",
      logo: "https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg",
      color: "from-indigo-600 to-indigo-700",
      bgColor: "from-indigo-900/30 to-indigo-800/20",
      borderColor: "border-indigo-500/50",
      description: "Quét mã QR thanh toán",
    },
    {
      id: "paypal",
      name: "PayPal",
      logo: "https://www.paypalobjects.com/webstatic/icon/pp258.png",
      color: "from-cyan-600 to-cyan-700",
      bgColor: "from-cyan-900/30 to-cyan-800/20",
      borderColor: "border-cyan-500/50",
      description: "Thanh toán qua PayPal",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Order Summary */}
      <div className="p-8 bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-2xl border border-slate-700/50 backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-gray-300 mb-4 font-['Montserrat']">
          Thông tin đơn hàng
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 font-['Montserrat']">Sản phẩm:</span>
            <span className="text-white font-semibold font-['Montserrat']">
              {productName}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
            <span className="text-gray-400 font-['Montserrat']">
              Số tiền thanh toán:
            </span>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-['Montserrat']">
              {formatters.formatCurrency(price)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-6 font-['Montserrat']">
          Chọn phương thức thanh toán
        </h3>
        <div className="grid grid-cols-2 gap-8">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => {
                if (selectedPayment === method.id) {
                  setSelectedPayment(null);
                } else {
                  setSelectedPayment(method.id);
                }
              }}
              className={`p-6 rounded-xl border-2 transition-all duration-300 group relative overflow-hidden ${
                method.bgColor
              } ${method.borderColor} ${
                selectedPayment === method.id
                  ? "scale-105 shadow-2xl shadow-amber-500/30"
                  : "hover:scale-105"
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div
                  className={`w-16 h-16 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br ${method.color}`}
                >
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-base font-['Montserrat']">
                    {method.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 font-['Montserrat']">
                    {method.description}
                  </p>
                </div>
              </div>

              {/* Check mark */}
              {selectedPayment === method.id && (
                <div className="absolute top-7 right-7 z-20 animate-fade-in">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="p-5 bg-gradient-to-r from-amber-900/30 via-amber-800/20 to-amber-900/30 border border-amber-500/50 rounded-xl">
        <p className="text-amber-200 text-sm flex items-start gap-3 font-semibold">
          Bạn sẽ được chuyển hướng đến trang thanh toán của nhà cung cấp dịch
          vụ. Đảm bảo kết nối internet ổn định khi thực hiện thanh toán.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {paymentType === "UPGRADE" ? (
          <button
            onClick={() => {
              if (onPaymentError) {
                onPaymentError("Hủy thanh toán");
              }
            }}
            className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-['Montserrat'] text-center"
          >
            Quay Lại
          </button>
        ) : (
          <Link
            to={productId ? `${ROUTES.PRODUCT}/${productId}` : ROUTES.HOME}
            className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-['Montserrat'] text-center"
          >
            Hủy
          </Link>
        )}
        {selectedPayment !== "momo" && selectedPayment !== "payos" ? (
          <button
            disabled
            className={`flex-1 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-500 hover:to-orange-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-amber-500/50 font-['Montserrat'] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            Chưa hỗ trợ
          </button>
        ) : (
          <button
            onClick={handlePayment}
            disabled={!selectedPayment || isLoading}
            className={`flex-1 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-500 hover:to-orange-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-amber-500/50 font-['Montserrat'] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
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
              "Tiếp tục"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentStep;
