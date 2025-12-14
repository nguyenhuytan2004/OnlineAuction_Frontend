import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  Download,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Star,
} from "lucide-react";

// QR Code Component (SVG-based placeholder with pattern)
const QRCodeDisplay = () => (
  <div className="relative w-full max-w-xs mx-auto bg-white rounded-2xl p-8 shadow-2xl shadow-orange-500/30 border-4 border-orange-500">
    {/* QR Code SVG Pattern */}
    <svg viewBox="0 0 200 200" className="w-full h-auto">
      {/* QR Pattern Simulation */}
      <rect x="10" y="10" width="30" height="30" fill="black" />
      <rect x="50" y="10" width="30" height="30" fill="black" />
      <rect x="130" y="10" width="30" height="30" fill="black" />

      <rect x="10" y="50" width="30" height="30" fill="black" />
      <rect x="130" y="50" width="30" height="30" fill="black" />

      <rect x="10" y="130" width="30" height="30" fill="black" />
      <rect x="50" y="130" width="30" height="30" fill="black" />
      <rect x="130" y="130" width="30" height="30" fill="black" />

      {/* Random data pattern */}
      <rect x="50" y="30" width="10" height="10" fill="black" />
      <rect x="70" y="30" width="10" height="10" fill="black" />
      <rect x="90" y="30" width="10" height="10" fill="black" />
      <rect x="110" y="30" width="10" height="10" fill="black" />

      <rect x="30" y="60" width="10" height="10" fill="black" />
      <rect x="50" y="60" width="10" height="10" fill="black" />
      <rect x="70" y="60" width="10" height="10" fill="black" />
      <rect x="90" y="60" width="10" height="10" fill="black" />
      <rect x="110" y="60" width="10" height="10" fill="black" />

      <rect x="30" y="80" width="10" height="10" fill="black" />
      <rect x="50" y="80" width="10" height="10" fill="black" />
      <rect x="70" y="80" width="10" height="10" fill="black" />

      <rect x="50" y="100" width="10" height="10" fill="black" />
      <rect x="70" y="100" width="10" height="10" fill="black" />
      <rect x="90" y="100" width="10" height="10" fill="black" />

      <rect x="30" y="110" width="10" height="10" fill="black" />
      <rect x="50" y="110" width="10" height="10" fill="black" />
      <rect x="70" y="110" width="10" height="10" fill="black" />
      <rect x="90" y="110" width="10" height="10" fill="black" />
    </svg>

    {/* Center logo/text */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-white rounded-lg p-2">
        <ShoppingBag className="w-6 h-6 text-orange-600" />
      </div>
    </div>

    {/* Payment Info */}
    <div className="mt-6 text-center">
      <p className="text-sm text-slate-600 font-semibold mb-1">Mã thanh toán</p>
      <p className="text-xs text-slate-500">UPGRADE-2024-SELLER-001</p>
    </div>
  </div>
);

/**
 * Upgrade to Seller Request Page
 * Bidder gửi yêu cầu nâng cấp lên Seller với thanh toán qua QR
 */
const UpgradeToSellerRequest = () => {
  const [hasRequested, setHasRequested] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, paid, processing
  const [selectedPlan, setSelectedPlan] = useState("basic");

  const plans = {
    basic: {
      name: "Gói Cơ Bản",
      price: 99000,
      duration: 7,
      features: [
        "Quyền đăng 10 sản phẩm mỗi tuần",
        "Hỗ trợ khách hàng 24/7",
        "Huy hiệu Seller",
        "Rating và review từ khách hàng",
      ],
    },
    premium: {
      name: "Gói Premium",
      price: 199000,
      duration: 30,
      features: [
        "Quyền đăng 50 sản phẩm mỗi tuần",
        "Hỗ trợ ưu tiên 24/7",
        "Huy hiệu Seller Premier",
        "Analytics bán hàng chi tiết",
        "Công cụ quản lý hàng loạt",
      ],
    },
  };

  const currentPlan = plans[selectedPlan];
  const paymentDeadline = new Date();
  paymentDeadline.setDate(paymentDeadline.getDate() + currentPlan.duration);

  const handleSubmitRequest = () => {
    setHasRequested(true);
  };

  const handleCopyPaymentCode = () => {
    navigator.clipboard.writeText("UPGRADE-2024-SELLER-001");
    toast.success("Đã sao chép mã giao dịch", {
      duration: 2000,
      style: {
        background: "rgba(16, 185, 129, 0.2)", // bg-emerald-500/20
        color: "#D1FAE5", // text-emerald-200
        border: "1px solid #10B981", // border-emerald-500
        padding: "12px 16px",
      },
    });
  };

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

        {!hasRequested ? (
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
                      onClick={() => setSelectedPlan(key)}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                        selectedPlan === key
                          ? "border-orange-500 bg-slate-700/50 shadow-lg shadow-orange-500/20"
                          : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                      }`}
                    >
                      {selectedPlan === key && (
                        <div className="absolute top-3 right-3 w-3 h-3 bg-orange-500 rounded-full"></div>
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
                        <span className="text-slate-300 text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-100 mb-1">
                        Lưu ý quan trọng
                      </p>
                      <p className="text-xs text-amber-100/80">
                        Sau khi thanh toán, tài khoản của bạn sẽ được nâng cấp
                        lên Seller trong 24 giờ. Bạn sẽ nhận được email xác nhận
                        và hướng dẫn chi tiết để bắt đầu bán hàng.
                      </p>
                    </div>
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

                <button
                  onClick={handleSubmitRequest}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 group"
                >
                  Tiếp Tục Thanh Toán
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-xs text-slate-400 text-center mt-4">
                  Ấn nút trên để tạo yêu cầu nâng cấp
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Screen */
          <div className="max-w-2xl mx-auto">
            {paymentStatus === "pending" && (
              <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Clock className="w-8 h-8 text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-2">
                      Chờ Xác Nhận Thanh Toán
                    </h2>
                    <p className="text-slate-400">
                      Vui lòng quét mã QR bên dưới để hoàn tất thanh toán
                    </p>
                  </div>

                  {/* QR Code Section */}
                  <div className="my-8">
                    <p className="text-sm text-slate-400 text-center mb-6 font-semibold">
                      Bước 1: Quét Mã QR
                    </p>
                    <QRCodeDisplay />
                  </div>

                  {/* Payment Info */}
                  <div className="bg-slate-700/30 rounded-xl p-6 mb-6 border border-slate-700">
                    <p className="text-sm text-slate-400 mb-4 font-semibold">
                      Bước 2: Xác Nhận Thông Tin Thanh Toán
                    </p>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                        <span className="text-slate-400">Gói Nâng Cấp:</span>
                        <span className="font-semibold text-slate-100">
                          {currentPlan.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                        <span className="text-slate-400">Số Tiền:</span>
                        <span className="text-xl font-black text-orange-400">
                          {currentPlan.price.toLocaleString()} đ
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                        <span className="text-slate-400">Mã Giao Dịch:</span>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-slate-200">
                            UPGRADE-2024-SELLER-001
                          </code>
                          <button
                            onClick={handleCopyPaymentCode}
                            className="p-1 hover:bg-slate-600 rounded transition-colors"
                            title="Copy mã giao dịch"
                          >
                            <Copy className="w-4 h-4 text-slate-400 hover:text-slate-200" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Hạn Thanh Toán:</span>
                        <span className="text-sm font-semibold text-amber-400">
                          {paymentDeadline.toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
                    <p className="text-sm text-orange-100 font-semibold mb-3">
                      Hướng dẫn thanh toán:
                    </p>
                    <ol className="text-xs text-orange-100/80 space-y-2">
                      <li>
                        1. Mở ứng dụng ngân hàng hoặc ứng dụng thanh toán của
                        bạn
                      </li>
                      <li>2. Chọn "Quét mã QR" hoặc "Thanh toán bằng QR"</li>
                      <li>3. Quét mã QR ở trên</li>
                      <li>
                        4. Xác nhận thông tin giao dịch và hoàn tất thanh toán
                      </li>
                      <li>
                        5. Hệ thống sẽ tự động xác nhận và nâng cấp tài khoản
                        của bạn
                      </li>
                    </ol>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setHasRequested(false)}
                      className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-xl transition-colors"
                    >
                      Quay Lại
                    </button>
                    <button
                      onClick={() => setPaymentStatus("paid")}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/30"
                    >
                      Đã Thanh Toán
                    </button>
                  </div>
                </div>

                {/* Support Card */}
                <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-3 font-semibold">
                    Gặp sự cố?
                  </p>
                  <p className="text-sm text-slate-300 mb-4">
                    Nếu bạn không quét mã QR được hoặc có câu hỏi, hãy liên hệ
                    với{" "}
                    <a
                      href="mailto:support@auction.com"
                      target="_blank"
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      support@auction.com
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Success Screen */}
            {paymentStatus === "paid" && (
              <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-12 border border-slate-700/50 text-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>

                <h2 className="text-3xl font-black text-slate-100 mb-3">
                  Thanh Toán Thành Công!
                </h2>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  Yêu cầu nâng cấp của bạn đã được ghi nhận. Tài khoản sẽ được
                  nâng cấp lên Seller trong 24 giờ.
                </p>

                {/* Status Timeline */}
                <div className="bg-slate-700/30 rounded-xl p-6 mb-8 border border-slate-700 text-left">
                  <p className="text-sm font-bold text-slate-100 mb-4">
                    Trạng Thái Xử Lý
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm text-slate-100">
                        Thanh toán xác nhận
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-slate-500 rounded-full animate-spin"></div>
                      <span className="text-sm text-slate-400">
                        Đang xử lý nâng cấp tài khoản...
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border border-slate-600 rounded-full"></div>
                      <span className="text-sm text-slate-500">
                        Gửi email xác nhận
                      </span>
                    </div>
                  </div>
                </div>

                {/* Confirmation Details */}
                <div className="bg-slate-700/30 rounded-xl p-6 mb-8 border border-slate-700 text-left">
                  <p className="text-sm font-bold text-slate-100 mb-4">
                    Chi Tiết Giao Dịch
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mã Giao Dịch:</span>
                      <span className="font-mono text-slate-200">
                        UPGRADE-2024-SELLER-001
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Số Tiền:</span>
                      <span className="text-emerald-400 font-bold">
                        {currentPlan.price.toLocaleString()} đ
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Thời Gian:</span>
                      <span className="text-slate-200">
                        {new Date().toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => (window.location.href = "/user/profile")}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30"
                >
                  Quay Lại Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradeToSellerRequest;
