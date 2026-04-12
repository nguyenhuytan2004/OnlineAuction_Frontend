import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PaymentStep from "../../components/orderCompletion/PaymentStep";
import { Toaster } from "react-hot-toast";
import {
  Zap,
  Star,
  CheckCircle,
  Shield,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import useUpgradeSeller from "../../hooks/useUpgradeSeller";

const UpgradeToSellerRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    state,
    selectedPlan,
    upgradeStatus,
    error,
    plans,
    currentPlan,
    initialize,
    handleSelectPlan,
    startPayment,
    handlePaymentSuccess,
    handlePaymentError,
    reset,
    retryRequest,
  } = useUpgradeSeller();

  // Khởi tạo: fetch trạng thái upgrade hiện tại
  useEffect(() => {
    initialize();
  }, [initialize]);

  // ============ RENDER LOGIC ============

  // 1. LOADING STATE
  if (state === "LOADING") {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Đang kiểm tra trạng thái nâng cấp...
      </div>
    );
  }

  // 2. SUCCESS STATE
  if (state === "SUCCESS") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="max-w-xl w-full bg-slate-900 p-12 rounded-3xl border border-slate-700 text-center">
          <h2 className="text-3xl font-black text-emerald-400 mb-4">
            Thanh toán thành công 🎉
          </h2>
          <p className="text-slate-300 mb-8">
            Yêu cầu nâng cấp Seller đã được ghi nhận.
            <br />
            Tài khoản sẽ được duyệt trong 24 giờ.
          </p>

          <button
            onClick={() => {
              navigate("/");
              reset();
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all"
          >
            Quay lại Trang Chủ
          </button>
        </div>
      </div>
    );
  }

  // 3. PAYMENT STATE - Show PaymentStep component
  if (state === "PAYMENT") {
    const paymentDeadline = new Date();
    paymentDeadline.setDate(paymentDeadline.getDate() + currentPlan.duration);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <Toaster position="bottom-right" />
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => reset()}
              className="text-slate-400 hover:text-slate-200 font-semibold flex items-center gap-2 transition-colors"
            >
              ← Quay lại
            </button>
          </div>

          <PaymentStep
            userId={user.userId}
            productId={null}
            productName={`Nâng cấp Seller – ${currentPlan.name}`}
            price={currentPlan.price}
            paymentType="UPGRADE"
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>
      </div>
    );
  }

  // 4. PENDING STATE - Waiting for approval
  if (upgradeStatus === "PENDING") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-slate-900 p-10 rounded-2xl border border-amber-500 text-center">
          <h2 className="text-2xl font-bold text-amber-400 mb-4">
            Yêu cầu đang được duyệt
          </h2>
          <p className="text-slate-300 mb-6">
            Yêu cầu nâng cấp Seller của bạn đang được xử lý.
            <br />
            Vui lòng chờ trong vòng 24 giờ.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-amber-500 text-black px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors"
          >
            Quay lại Trang Chủ
          </button>
        </div>
      </div>
    );
  }

  // 5. REJECTED STATE - Request was rejected
  if (upgradeStatus === "REJECTED") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-slate-900 p-10 rounded-2xl border border-red-500 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Yêu cầu bị từ chối
          </h2>
          <p className="text-slate-300 mb-6">
            Yêu cầu nâng cấp Seller trước đó không được chấp thuận. Bạn có thể
            gửi lại yêu cầu mới.
          </p>
          <button
            onClick={retryRequest}
            className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            Gửi lại yêu cầu
          </button>
        </div>
      </div>
    );
  }

  // 6. ALREADY SELLER
  if (user?.role === "SELLER") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-slate-900 p-10 rounded-2xl border border-emerald-500 text-center">
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">
            Bạn đã là Seller
          </h2>
          <p className="text-slate-300 mb-6">
            Tài khoản của bạn đã được nâng cấp thành Seller, hãy đăng nhập lại
            nhé.
          </p>
          <Link to={`${ROUTES.PROFILE}/product-management`}>
            <button className="bg-emerald-500 text-black px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors">
              Quản lý sản phẩm
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // 7. DEFAULT (IDLE) - Plan selection screen
  const paymentDeadline = new Date();
  paymentDeadline.setDate(paymentDeadline.getDate() + currentPlan.duration);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <Toaster position="bottom-right" />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl shadow-2xl shadow-orange-500/30 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <Zap className="w-10 h-10" />
                <h1 className="text-4xl font-black tracking-tight">
                  Nâng Cấp Thành Seller
                </h1>
              </div>
              <p className="text-orange-50 font-semibold">
                Mở rộng kinh doanh và bán hàng trên nền tảng của chúng tôi
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plan Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-400" />
                Chọn Gói Nâng Cấp
              </h2>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {Object.entries(plans).map(([key, plan]) => (
                  <button
                    key={key}
                    onClick={() =>
                      selectedPlan !== key && handleSelectPlan(key)
                    }
                    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      selectedPlan === key
                        ? "border-orange-500 bg-slate-700/50 shadow-lg shadow-orange-500/20"
                        : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                    }`}
                  >
                    {selectedPlan === key && (
                      <div className="absolute top-8 right-8 w-3 h-3 bg-orange-500 rounded-full"></div>
                    )}
                    <h3 className="text-lg font-bold text-slate-100 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-2xl font-black text-orange-400 mb-1">
                      {plan.price.toLocaleString()} đ
                    </p>
                    <p className="text-xs text-slate-400 mb-4">
                      Hiệu lực {plan.duration} ngày
                    </p>
                    <ul className="space-y-2">
                      {plan.features.slice(0, 3).map((feature, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-slate-300 flex items-start gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              {/* Plan Details */}
              <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  Bao Gồm Trong Gói
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {currentPlan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <div className="flex gap-3 items-center">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <p className="text-xs text-amber-100/80">
                    Sau khi thanh toán, tài khoản của bạn sẽ được nâng cấp lên
                    Seller trong 24 giờ.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50">
              <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-orange-400" />
                Lợi Ích Khi Trở Thành Seller
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Thu Nhập Thêm",
                    desc: "Bán sản phẩm của riêng bạn và kiếm lợi nhuận",
                  },
                  {
                    title: "Huy Hiệu Seller",
                    desc: "Hiển thị trên profile để xây dựng uy tín",
                  },
                  {
                    title: "Quản Lý Sàn",
                    desc: "Đăng và quản lý nhiều sàn đấu giá cùng lúc",
                  },
                  {
                    title: "Analytics",
                    desc: "Theo dõi bán hàng và lượt xem chi tiết",
                  },
                ].map((benefit, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-700/30 p-4 rounded-lg border border-slate-700"
                  >
                    <p className="font-semibold text-slate-100 mb-1">
                      {benefit.title}
                    </p>
                    <p className="text-sm text-slate-400">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 sticky top-8">
              <h3 className="text-lg font-bold text-slate-100 mb-6">
                Tóm Tắt Đơn Hàng
              </h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Gói:</span>
                  <span className="font-semibold text-slate-100">
                    {currentPlan.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Thời hạn:</span>
                  <span className="font-semibold text-slate-100">
                    {currentPlan.duration} ngày
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Giá:</span>
                  <span className="text-xl font-black text-orange-400">
                    {currentPlan.price.toLocaleString()} đ
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-3 mb-6">
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 mb-1">
                      Hạn thanh toán:
                    </p>
                    <p className="text-sm font-semibold text-slate-100">
                      {paymentDeadline.toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <button
                disabled={selectedPlan === "premium"}
                onClick={() => startPayment(selectedPlan)}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
              >
                {selectedPlan === "premium" ? (
                  "Sắp phát hành"
                ) : (
                  <>
                    Tiếp Tục Thanh Toán
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-xs text-slate-400 text-center mt-4">
                Ấn nút trên để tạo yêu cầu nâng cấp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpgradeToSellerRequest;
