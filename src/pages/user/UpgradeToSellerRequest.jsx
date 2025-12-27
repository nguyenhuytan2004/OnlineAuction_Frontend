import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PaymentStep from "../../components/orderCompletion/PaymentStep";
import bidService from "../../services/bidService";
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

const UpgradeToSellerRequest = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [upgradeStatus, setUpgradeStatus] = useState("NONE");
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [ctx, setCtx] = useState(() =>
    JSON.parse(sessionStorage.getItem("paymentContext") || "null")
  );
  const [showSuccess, setShowSuccess] = useState(false);


  useEffect(() => {
    const paid = sessionStorage.getItem("sellerUpgradePaid");

    if (paid === "true") {
      setLoadingStatus(false);
      return;
    }

    fetchUpgradeStatus();
  }, []);

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


  /* ======================
     GUARD: NO CONTEXT (SAU REDIRECT)
  ======================= */
  useEffect(() => {
    if (!ctx && location.search.includes("resultCode")) {
      navigate("/user/profile", { replace: true });
    }
  }, [ctx, navigate, location.search]);

  /* ======================
     HANDLE MOMO RESULT
  ======================= */
  useEffect(() => {
    if (loadingStatus) return;
    if (upgradeStatus !== "NONE") return;

    const paid = sessionStorage.getItem("sellerUpgradePaid");
    if (paid !== "true") return;

    if (sessionStorage.getItem("upgradeCreated") === "true") return;

    bidService.createSellerUpgradeRequest()
      .then(() => {
        sessionStorage.setItem("upgradeCreated", "true");
        sessionStorage.removeItem("sellerUpgradePaid");
        fetchUpgradeStatus();
      })
      .catch(err => {
        console.error("Create upgrade request failed", err);
      });

  }, [loadingStatus, upgradeStatus]);



  /* ======================
     CLEAN SESSION WHEN DONE
  ======================= */
  useEffect(() => {
    if (showSuccess) {
      sessionStorage.removeItem("paymentContext");
      sessionStorage.removeItem("upgradeCreated");
    }
  }, [showSuccess]);

  const fetchUpgradeStatus = async () => {
    try {
      const res = await bidService.getSellerUpgradeStatus();
      setUpgradeStatus(res.status); // PENDING | APPROVED | REJECTED
    } catch (err) {
      if (err?.status === 404) {
        setUpgradeStatus("NONE");
      } else {
        console.error("Check upgrade status failed", err);
      }
    } finally {
      setLoadingStatus(false);
    }
  };


  /* ======================
     SUCCESS SCREEN
  ======================= */
  if (showSuccess) {
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
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold py-3 rounded-xl"
          >
            Quay lại Profile
          </button>
        </div>
      </div>
    );
  }

  /* ======================
     START PAYMENT
  ======================= */
  const handleSubmitRequest = () => {
    const payload = {
      upgrade: true,
      plan: selectedPlan,
      price: currentPlan.price,
    };

    sessionStorage.setItem("paymentContext", JSON.stringify(payload));
    setCtx(payload);
  };

  if (loadingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Đang kiểm tra trạng thái nâng cấp...
      </div>
    );
  }

  if (upgradeStatus === "PENDING") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-slate-900 p-10 rounded-2xl border border-amber-500 text-center">
          <h2 className="text-2xl font-bold text-amber-400 mb-4">
            Yêu cầu đang được duyệt ⏳
          </h2>
          <p className="text-slate-300 mb-6">
            Yêu cầu nâng cấp Seller của bạn đang được xử lý.<br />
            Vui lòng chờ trong vòng 24 giờ.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-amber-500 text-black px-6 py-3 rounded-xl font-semibold"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (upgradeStatus === "APPROVED") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-slate-900 p-10 rounded-2xl border border-emerald-500 text-center">
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">
            Bạn đã là Seller 🎉
          </h2>
          <p className="text-slate-300 mb-6">
            Tài khoản của bạn đã được nâng cấp thành Seller, hãy đăng nhập lại nhé.
          </p>
          <button
            onClick={() => navigate("/seller/dashboard")}
            className="bg-emerald-500 text-black px-6 py-3 rounded-xl font-semibold"
          >
            Vào trang Seller
          </button>
        </div>
      </div>
    );
  }

  if (upgradeStatus === "REJECTED") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-slate-900 p-10 rounded-2xl border border-red-500 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Yêu cầu bị từ chối 
          </h2>
          <p className="text-slate-300 mb-6">
            Yêu cầu nâng cấp Seller trước đó không được chấp thuận.
            Bạn có thể gửi lại yêu cầu mới.
          </p>
          <button
            onClick={() => setUpgradeStatus("NONE")}
            className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Gửi lại yêu cầu
          </button>
        </div>
      </div>
    );
  }

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

        {ctx?.upgrade && !showSuccess ? (
           /* Payment Screen */
          <div className="max-w-2xl mx-auto">
            <PaymentStep
              productId={null}
              productName={`Nâng cấp Seller – ${currentPlan.name}`}
              price={currentPlan.price}
              userRole="buyer"
              upgradeMode
            />
          </div>

          
        ) : (
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
                        <span className="text-slate-300 text-sm">
                          {feature}
                        </span>
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

                <button
                  disabled={selectedPlan === "premium"}
                  onClick={handleSubmitRequest}
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
        )}
      </div>
    </div>
  );
};
export default UpgradeToSellerRequest;
