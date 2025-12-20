import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import OrderStepper from "../../components/orderCompletion/OrderStepper";
import PaymentStep from "../../components/orderCompletion/PaymentStep";
import ShippingAddressStep from "../../components/orderCompletion/ShippingAddressStep";
import ShippingInfoStep from "../../components/orderCompletion/ShippingInfoStep";
import ConfirmationStep from "../../components/orderCompletion/ConfirmationStep";

const OrderCompletion = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from navigation state
  const { productId, productName, price, userRole } = location.state || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Scroll to top on currentStep change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  useEffect(() => {
    if (!productId || !productName || !price || !userRole) {
      navigate(-1);
    }
  }, [productId, productName, price, userRole, navigate]);

  const handleNextStep = () => {
    setCompletedSteps([...completedSteps, currentStep]);

    if (userRole === "buyer") {
      // Buyer flow: 1 -> 2 -> 4
      if (currentStep === 1) {
        setCurrentStep(2);
      } else if (currentStep === 2) {
        setCurrentStep(4);
      } else if (currentStep === 4) {
        setShowSuccess(true);
      }
    } else {
      // Seller flow: only step 3
      if (currentStep === 3) {
        setShowSuccess(true);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PaymentStep
            onNext={handleNextStep}
            productName={productName}
            price={price}
          />
        );
      case 2:
        return <ShippingAddressStep onNext={handleNextStep} />;
      case 3:
        return <ShippingInfoStep onNext={handleNextStep} />;
      case 4:
        return <ConfirmationStep onNext={handleNextStep} />;
      default:
        return null;
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-12 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 rounded-3xl border border-slate-700/50 p-12 shadow-2xl relative overflow-hidden text-center">
            {/* Decorative corners */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-tr-full"></div>

            {/* Success Icon */}
            <div className="relative z-10 flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                <CheckCircle2 className="w-14 h-14 text-white" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500 mb-4 font-['Playfair_Display'] relative z-10">
              Thành công!
            </h1>

            <p className="text-xl text-gray-300 mb-8 font-['Montserrat'] relative z-10">
              {userRole === "buyer"
                ? "Đơn hàng của bạn đã được hoàn tất. Cảm ơn bạn đã mua sắm!"
                : "Đơn hàng đã được xác nhận. Cảm ơn bạn đã bán hàng!"}
            </p>

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
            <div className="flex gap-4 relative z-10">
              <button
                onClick={() => navigate("/user/activity")}
                className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-['Montserrat']"
              >
                Quay lại trang chủ
              </button>
              <button
                onClick={() => navigate("/user/activity")}
                className="flex-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-emerald-500/50 font-['Montserrat']"
              >
                Xem hoạt động của tôi
              </button>
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
