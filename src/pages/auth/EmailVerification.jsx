import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import { notify } from "../../utils/toast";
import authService from "../../services/authService";

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state or use fake email
  const email = location.state?.email || "user***@example.com";

  // OTP states
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // Countdown timer states
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef([]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setGeneralError("");

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData
      .split("")
      .concat(Array(6 - pastedData.length).fill(""));
    setOtp(newOtp);

    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      setGeneralError("");
      const enteredOtp = otp.join("");
      await authService.verifyEmail(email, enteredOtp);
      setVerificationSuccess(true);

      // Auto redirect after 2 seconds
      setTimeout(() => {
        navigate(ROUTES.HOME, { replace: true });
      }, 2000);
    } catch (error) {
      console.error("Verification error:", error);
      setGeneralError(error || "Lỗi xác thực. Vui lòng thử lại.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setCanResend(false);
    setTimeLeft(60);
    setOtp(["", "", "", "", "", ""]);
    setGeneralError("");

    try {
      await authService.resendVerifyEmailOtp(email);
      notify.success("Mã xác nhận đã được gửi lại đến email của bạn");
    } catch (error) {
      console.error("Resend code error:", error);
      notify.error(error || "Lỗi gửi lại mã. Vui lòng thử lại.");
    } finally {
      setIsResending(false);
      inputRefs.current[0]?.focus();
    }
  };

  if (verificationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 rounded-3xl p-12 border border-slate-700/50 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-tr-full"></div>

            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-6 animate-bounce">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </div>
              </div>

              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500 mb-4 font-['Montserrat']">
                Xác thực thành công
              </h1>

              <p className="text-slate-300 text-lg font-['Montserrat'] mb-8">
                Tài khoản của bạn đã được kích hoạt. Chuyển hướng tới trang
                chủ...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <button
          onClick={() => navigate(ROUTES.REGISTER)}
          className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-8 font-['Montserrat'] font-semibold group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại
        </button>

        {/* Main card */}
        <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 rounded-3xl p-12 border border-slate-700/50 shadow-2xl backdrop-blur-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-tr-full"></div>

          {/* Content */}
          <div className="relative z-10 space-y-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-10 font-['Montserrat']">
                Xác thực tài khoản
              </p>
              <p className="text-slate-300 font-['Montserrat'] text-base">
                Mã xác nhận 6 chữ số đã được gửi đến
              </p>
              <p className="text-amber-400 font-['Montserrat'] font-semibold mt-2">
                {email}
              </p>
            </div>

            {/* OTP Input boxes */}
            <div className="mb-10">
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    maxLength="1"
                    className={`w-14 h-16 text-center text-2xl font-black ${
                      generalError
                        ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500 text-red-500"
                        : "border-2 border-slate-600/50 text-amber-400 focus:border-amber-500 focus:ring-amber-500"
                    } bg-slate-900 rounded-xl  focus:ring-2 outline-none transition-all duration-300 font-['Montserrat'] hover:border-slate-500/70`}
                    placeholder="•"
                  />
                ))}
              </div>
              {generalError && (
                <div className="mt-4 text-center text-sm text-red-500 font-['Montserrat']">
                  {generalError}
                </div>
              )}
            </div>

            {/* Timer and Resend */}
            <div className="mb-8 p-5 bg-gradient-to-r from-slate-800/50 to-slate-900/30 rounded-xl border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300 font-['Montserrat']">
                  <span className="text-sm">
                    {canResend
                      ? "Nếu chưa nhận được mã"
                      : `Gửi lại mã trong ${timeLeft}s`}
                  </span>
                </div>
                <button
                  onClick={handleResendCode}
                  disabled={!canResend || isResending}
                  className={`text-sm font-['Montserrat'] font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
                    canResend && !isResending
                      ? "text-amber-400 hover:text-amber-300 cursor-pointer"
                      : "text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {isResending ? "Đang gửi..." : "Gửi lại"}
                </button>
              </div>
            </div>

            {/* Verify button */}
            <button
              onClick={handleVerify}
              disabled={isVerifying || otp.join("").length !== 6}
              className={`w-full py-4 px-6 rounded-xl font-['Montserrat'] font-bold text-lg transition-all duration-300 shadow-lg relative overflow-hidden ${
                otp.join("").length === 6
                  ? "bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-500 hover:to-orange-400 text-white hover:shadow-amber-500/50 hover:scale-105 cursor-pointer"
                  : "bg-gradient-to-r from-slate-700 to-slate-600 text-slate-300 cursor-not-allowed opacity-60"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isVerifying ? (
                  <>
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
                    Đang xác thực...
                  </>
                ) : (
                  "Xác nhận"
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
