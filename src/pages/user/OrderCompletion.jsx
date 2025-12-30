/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle2, MoveLeft, XCircle } from "lucide-react";
import OrderStepper from "../../components/orderCompletion/OrderStepper";
import PaymentStep from "../../components/orderCompletion/PaymentStep";
import ShippingAddressStep from "../../components/orderCompletion/ShippingAddressStep";
import ShippingInfoStep from "../../components/orderCompletion/ShippingInfoStep";
import ConfirmationStep from "../../components/orderCompletion/ConfirmationStep";
import { useSearchParams } from "react-router-dom";
import orderService from "../../services/orderService";
import { ROUTES } from "../../constants/routes";

const OrderCompletion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const state = location.state;

  const ctx =
    state || JSON.parse(sessionStorage.getItem("paymentContext") || "null");

  const { productId, productName, price, userRole } = ctx || {};

  const [order, setOrder] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [, setCompletedSteps] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);
  const [appOrderId, setAppOrderId] = useState(
    Number(sessionStorage.getItem("appOrderId")),
  );

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const order = await orderService.getOrderByProductId(productId);
        setOrder(order);
        console.log("Dữ liệu đơn hàng:", order);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      }
    };

    fetchOrderData();
  }, [productId]);

  const mapStatusToStep = (userRole, statusRes) => {
    const { status, shippingAddressPresent } = statusRes || {};

    if (userRole === "seller") {
      if (status === "PAID" || status === "ON_DELIVERING") return 3;
      if (status === "COMPLETED") return "SUCCESS";
      if (status === "CANCELED") return "CANCELED";
      return 3;
    }

    // Buyer:
    if (status === "WAIT_PAYMENT") return 1;

    if (status === "PAID") {
      if (!shippingAddressPresent) return 2;
      return 4;
    }

    if (status === "ON_DELIVERING") {
      return 4;
    }

    if (status === "COMPLETED") return "SUCCESS";
    if (status === "CANCELED") return "CANCELED";

    return 1;
  };

  useEffect(() => {
    if (!ctx || ctx.type !== "ORDER") return;
    if (userRole !== "buyer") return;

    const resultCode = searchParams.get("resultCode");
    if (resultCode !== "0") return;

    if (!order) {
      setCurrentStep(2);
    }
  }, [searchParams, ctx, userRole, order]);

  useEffect(() => {
    if (!appOrderId) return;
    if (!userRole) return;

    const loadStatus = async () => {
      try {
        console.log("CALL getStatus", appOrderId);

        const statusRes = await orderService.getStatus(appOrderId);
        const step = mapStatusToStep(userRole, statusRes);

        if (step === "SUCCESS") {
          setShowSuccess(true);
          return;
        }

        if (step === "CANCELED") {
          alert("Đơn hàng đã bị hủy");
          navigate("/user/activity", { replace: true });
          return;
        }

        setCurrentStep(step);

        if (userRole === "buyer") {
          if (step === 1) setCompletedSteps([]);
          if (step === 2) setCompletedSteps([1]);
          if (step === 4) setCompletedSteps([1, 2]);
        } else {
          // seller
          setCompletedSteps([]);
        }
      } catch (err) {
        console.error("Load order status failed", err);
      }
    };

    loadStatus();
  }, [appOrderId, userRole, navigate]);

  /*useEffect(() => {
    if (location.pathname === "/payment-result") {
      if (!ctx?.productId) {
        navigate("/", { replace: true });
        return;
      }

      navigate(
        `/products/${ctx.productId}/order-completion${location.search}`,
        { replace: true, state: ctx },
      );
    }
  }, [location.pathname, location.search, ctx, navigate]);*/

  useEffect(() => {
    if (userRole !== "buyer") return;
    if (!ctx || ctx.type !== "ORDER") return;

    const resultCode = searchParams.get("resultCode");
    if (resultCode !== "0") return;

    setCompletedSteps((p) => (p.includes(1) ? p : [...p, 1]));
  }, [searchParams, userRole, ctx]);

  useEffect(() => {
    if (!ctx) navigate("/", { replace: true });
  }, [ctx, navigate]);

  useEffect(() => {
    if (userRole !== "buyer") return;

    const resultCode = searchParams.get("resultCode");
    if (resultCode !== "0") return;

    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    const storedCtx = JSON.parse(
      sessionStorage.getItem("paymentContext") || "null",
    );

    if (!storedCtx?.productId || !amount) {
      console.warn("Missing paymentContext or amount");
      return;
    }

    if (sessionStorage.getItem("orderCreated") === "true") {
      console.log("Order already created");
      return;
    }

    console.log("CALL CREATE ORDER API");

    orderService
      .payAndCreateOrder({
        productId: storedCtx.productId,
        amount: Number(amount),
        paymentRef: orderId,
      })
      .then(async (data) => {
        if (data?.orderId) {
          sessionStorage.setItem("appOrderId", String(data.orderId));
          setAppOrderId(data.orderId);

          const freshOrder = await orderService.getOrderByProductId(productId);
          setOrder(freshOrder);
        }

        sessionStorage.setItem("orderCreated", "true");
      })
      .catch((err) => {
        console.error("Create order failed", err);
        alert("Tạo đơn hàng thất bại");
      });
  }, [searchParams, userRole]);

  useEffect(() => {
    if (showSuccess) {
      sessionStorage.removeItem("paymentContext");
      sessionStorage.removeItem("orderCreated");
    }
  }, [showSuccess]);

  const handleNextStep = () => {
    setCompletedSteps((prev) =>
      prev.includes(currentStep) ? prev : [...prev, currentStep],
    );

    if (userRole === "buyer") {
      if (currentStep === 2) {
        setCurrentStep(4);
      } else if (currentStep === 4) {
        setShowSuccess(true);
      }
    }

    if (userRole === "seller") {
      if (currentStep === 3) {
        setCompletedSteps((prev) => (prev.includes(3) ? prev : [...prev, 3]));
        setShowSuccess(true);
      }
    }
  };

  useEffect(() => {
    if (order?.status === "CANCELED") {
      setShowCanceled(true);
      setCurrentStep(1);
    } else {
      if (userRole === "seller") {
        if (
          order?.status === "ON_DELIVERING" ||
          order?.status === "COMPLETED"
        ) {
          setShowSuccess(true);
        }
        setCurrentStep(3);
      } else if (userRole === "buyer") {
        switch (order?.status) {
          case "WAIT_PAYMENT":
            setCurrentStep(1);
            break;
          case "PAID":
            if (order?.shippingAddress) {
              setCurrentStep(4);
            } else {
              setCurrentStep(2);
            }
            break;
          case "ON_DELIVERING":
            setCurrentStep(4);
            break;
          case "COMPLETED":
            setShowSuccess(true);
            setCurrentStep(4);
            break;
        }
      }
    }
  }, [order?.shippingAddress, order?.status, userRole]);

  const renderStepContent = () => {
    if (userRole === "seller") {
      return currentStep === 3 ? (
        <ShippingInfoStep onNext={handleNextStep} order={order} />
      ) : null;
    }

    switch (currentStep) {
      case 1:
        return (
          <PaymentStep
            productId={productId}
            productName={productName}
            price={price}
            userRole={userRole}
            paymentType={"ORDER"}
          />
        );
      case 2:
        return <ShippingAddressStep onNext={handleNextStep} order={order} />;
      case 4:
        return <ConfirmationStep onNext={handleNextStep} order={order} />;
      default:
        return null;
    }
  };

  if (!currentStep) {
    return null;
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-12 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 rounded-3xl border border-slate-700/50 p-12 shadow-2xl relative overflow-hidden text-center">
            {/* Decorative corners */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-tr-full"></div>

            {/* Success Icon */}
            <div className="relative z-10 flex justify-center my-8">
              <CheckCircle2 className="w-20 h-20 text-emerald-500 animate-bounce" />
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500 mb-4 font-['Playfair_Display'] relative z-10">
              Thành công!
            </h1>

            <div className="text-lg text-gray-300 mb-8 font-['Montserrat'] relative z-10 py-4">
              {userRole === "buyer" ? (
                <div>
                  <p>Đơn hàng của bạn đã được hoàn tất</p>
                  <p>Cảm ơn bạn đã tham gia đấu giá!</p>
                </div>
              ) : (
                <div>
                  <p>Đơn hàng đã được xác nhận</p>
                  <p> Cảm ơn bạn tạo cuộc đấu giá!</p>
                </div>
              )}
            </div>

            <div className="mb-8 p-6 bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-xl border border-emerald-500/50 relative z-10">
              <h3 className="text-emerald-300 font-semibold mb-4 font-['Montserrat']">
                Chi tiết đơn hàng
              </h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-['Montserrat']">
                    Sản phẩm:
                  </span>
                  <span className="text-white font-semibold font-['Montserrat']">
                    {productName}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-emerald-500/30">
                  <span className="text-gray-400 font-['Montserrat']">
                    Tổng tiền:
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500 font-bold font-['Montserrat']">
                    {price}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 relative z-10 justify-center">
              <Link to="/">
                <button className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-['Montserrat']">
                  Về trang chủ
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showCanceled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-12 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 rounded-3xl border border-slate-700/50 p-12 shadow-2xl relative overflow-hidden text-center">
            {/* Decorative corners */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-red-500/20 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-red-500/20 to-transparent rounded-tr-full"></div>

            {/* Canceled Icon */}
            <div className="relative z-10 flex justify-center my-8">
              <XCircle className="w-20 h-20 text-red-500 animate-bounce" />
            </div>

            {/* Canceled Message */}
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-500 mb-4 font-['Playfair_Display'] relative z-10">
              Đơn hàng đã hủy
            </h1>

            <div className="text-lg text-gray-300 mb-8 font-['Montserrat'] relative z-10 py-4">
              {userRole === "buyer" ? (
                <div>
                  <p>Đơn hàng của bạn đã bị hủy</p>
                  <p>Vui lòng liên hệ người bán để biết chi tiết</p>
                </div>
              ) : (
                <div>
                  <p>Đơn hàng đã được hủy</p>
                  <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</p>
                </div>
              )}
            </div>

            <div className="mb-8 p-6 bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-xl border border-red-500/50 relative z-10">
              <h3 className="text-red-300 font-semibold mb-4 font-['Montserrat']">
                Thông tin đơn hàng
              </h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-['Montserrat']">
                    Sản phẩm:
                  </span>
                  <span className="text-white font-semibold font-['Montserrat']">
                    {productName}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-red-500/30">
                  <span className="text-gray-400 font-['Montserrat']">
                    Giá:
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-500 font-bold font-['Montserrat']">
                    {price}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 relative z-10 justify-center">
              <Link
                to={`${
                  userRole === "buyer"
                    ? `${ROUTES.PROFILE}/activity`
                    : `${ROUTES.PROFILE}/product-management`
                }`}
              >
                <button className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-['Montserrat']">
                  {userRole === "buyer" ? "Xem hoạt động" : "Quản lý sản phẩm"}
                </button>
              </Link>
              <Link to="/">
                <button className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-['Montserrat']">
                  Về trang chủ
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-12">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors duration-200 mb-4 font-['Montserrat']"
            >
              <ChevronLeft className="w-5 h-5" />
              Quay lại
            </button>
            <h1 className="text-4xl font-bold text-white font-['Playfair_Display']">
              Hoàn tất đơn hàng
            </h1>
          </div>
        </div>

        {/* Stepper */}
        <OrderStepper currentStep={currentStep} userRole={userRole} />

        {/* Main Content */}
        <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 rounded-2xl border border-slate-700/50 p-12 backdrop-blur-xl shadow-2xl shadow-amber-500/10 overflow-hidden relative">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-tr-full"></div>

          <div className="z-10 relative">{renderStepContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default OrderCompletion;
