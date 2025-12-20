import React from "react";
import {
  MoveRight,
  CreditCard,
  MapPinHouse,
  UserCheck,
  CheckCheckIcon,
} from "lucide-react";

const OrderStepper = ({ currentStep, userRole }) => {
  const buyerSteps = [
    { number: 1, label: "Thanh toán" },
    { number: 2, label: "Địa chỉ giao hàng" },
    { number: 4, label: "Xác nhận nhận hàng" },
  ];

  const sellerSteps = [{ number: 3, label: "Giao hàng & Hóa đơn" }];

  const steps = userRole === "buyer" ? buyerSteps : sellerSteps;

  return (
    <div className="flex items-center justify-between relative px-4 mb-12">
      {/* Steps */}
      {steps.map((step, index) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;

        return (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center flex-1 relative">
              {/* Step Circle */}
              <div
                className={`relative w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300 cursor-default ${
                  isActive
                    ? "bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/70 scale-110 z-20"
                    : isCompleted
                    ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/50 z-10"
                    : "bg-gradient-to-br from-slate-800 to-slate-700 shadow-lg z-10"
                }`}
              >
                {isCompleted ? (
                  <div className="relative">
                    <CheckCheckIcon className="w-10 h-10 text-white" />
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-300 animate-ping opacity-50"></div>
                  </div>
                ) : step.number === 1 ? (
                  <CreditCard className="w-10 h-10 text-white" />
                ) : step.number === 2 ? (
                  <MapPinHouse className="w-10 h-10 text-white" />
                ) : (
                  <UserCheck className="w-10 h-10 text-white" />
                )}

                {/* Border effect */}
                {isActive && (
                  <div className="absolute -inset-4 rounded-full border-2 border-amber-400/30 animate-pulse"></div>
                )}
              </div>

              {/* Step Label */}
              <div className="text-center">
                <h3
                  className={`text-sm font-semibold text-center transition-all duration-300 ${
                    isActive
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 text-base font-bold"
                      : isCompleted
                      ? "text-emerald-400 font-semibold"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </h3>
              </div>
            </div>

            {/* Connector arrow - only between steps */}
            {index < steps.length - 1 && (
              <div className="flex-shrink-0 mx-2 mb-4 relative z-5">
                <div
                  className={`transition-all duration-500 ${
                    isCompleted
                      ? "text-emerald-400"
                      : isActive
                      ? "text-amber-500 animate-bounce"
                      : "text-gray-600"
                  }`}
                >
                  <MoveRight className="w-6 h-6" />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OrderStepper;
