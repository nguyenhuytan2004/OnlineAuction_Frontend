import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Mail } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import authService from "../../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // States
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Stage 2: OTP states
  const [showOtpStage, setShowOtpStage] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");

  // Timer states
  const [timeLeft, setTimeLeft] = useState(null);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef([]);

  // Countdown timer effect
  useEffect(() => {
    if (!showOtpStage || timeLeft === null) return;

    if (timeLeft === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showOtpStage]);

  // Email validation
  const validateEmail = (emailStr) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailStr);
  };

  // Handle send code
  const handleSendCode = async () => {
    setEmailError("");
    setSubmitError("");
    setSubmitSuccess("");

    if (!email.trim()) {
      setEmailError("Vui lòng nhập email");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Email không hợp lệ");
      return;
    }

    setIsSending(true);

    try {
      console.info("[FORGOT_PASSWORD][SEND_OTP][START]", email);

      await authService.forgotPassword(email);

      console.info("[FORGOT_PASSWORD][SEND_OTP][SUCCESS]", email);

      setSubmitSuccess("Mã OTP đã được gửi đến email");
      setShowOtpStage(true);
      setTimeLeft(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);

    } catch (error) {
      console.error("[FORGOT_PASSWORD][SEND_OTP][ERROR]", error);

      setSubmitError(
        error?.response?.data || "Không thể gửi mã OTP"
      );
    } finally {
      setIsSending(false);
    }
  };



  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP key down
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP paste
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

  // Handle verify OTP
  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setOtpError("Vui lòng nhập đầy đủ 6 chữ số");
      return;
    }

    setIsVerifying(true);
    setOtpError("");
    setSubmitError("");

    try {
      console.info("[FORGOT_PASSWORD][VERIFY_OTP][START]", email);

      await authService.verifyResetPasswordOtp(email, otpCode);

      console.info("[FORGOT_PASSWORD][VERIFY_OTP][SUCCESS]", email);

      navigate("/reset-password", {
        state: { email },
      });

    } catch (error) {
      console.error("[FORGOT_PASSWORD][VERIFY_OTP][ERROR]", error);

      setOtpError(
        error?.response?.data || "OTP không hợp lệ hoặc đã hết hạn"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle resend code
  const handleResendOtp = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setCanResend(false);
    setTimeLeft(60);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setSubmitError("");

    try {
      console.info("[FORGOT_PASSWORD][RESEND_OTP][START]", email);

      await authService.forgotPassword(email);

      console.info("[FORGOT_PASSWORD][RESEND_OTP][SUCCESS]", email);

      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("[FORGOT_PASSWORD][RESEND_OTP][ERROR]", error);

      setOtpError("Gửi lại OTP thất bại");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <button
          onClick={() => navigate(ROUTES.LOGIN)}
          className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-8 font-['Montserrat'] font-semibold group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại Đăng nhập
        </button>

        {/* Main card */}
        <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 rounded-3xl p-12 border border-slate-700/50 shadow-2xl backdrop-blur-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-tr-full"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-3 font-['Montserrat']">
                Lấy lại mật khẩu
              </h1>
            </div>

            {/* Stage 1: Email Input */}
            {!showOtpStage && (
              <div
                className={`transition-all duration-500 ${
                  showOtpStage
                    ? "opacity-50 pointer-events-none"
                    : "opacity-100"
                }`}
              >
                <div className="mb-6">
                  <label className="block text-sm text-slate-400 font-['Montserrat'] font-semibold mb-3 uppercase tracking-widest">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                      placeholder="Nhập email của bạn"
                      disabled={showOtpStage}
                      className={`w-full pl-12 pr-4 py-3.5 bg-gradient-to-br ${
                        showOtpStage
                          ? "from-slate-800/30 to-slate-900/20 cursor-not-allowed"
                          : "from-slate-800/60 to-slate-900/40"
                      } border-2 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all duration-300 font-['Montserrat'] font-semibold ${
                        emailError
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                          : "border-slate-600/50 hover:border-slate-500/70 focus:border-amber-500 focus:ring-amber-500/30"
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p className="text-red-400 text-xs mt-2 font-['Montserrat'] font-semibold animate-in fade-in">
                      {emailError}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleSendCode}
                  disabled={isSending || showOtpStage}
                  className="w-full py-4 px-6 rounded-xl font-['Montserrat'] font-bold text-lg transition-all duration-300 shadow-lg bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-500 hover:to-orange-400 text-white hover:shadow-amber-500/50 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSending ? (
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
                      Đang gửi...
                    </span>
                  ) : (
                    "Gửi mã xác thực"
                  )}
                </button>
              </div>
            )}

            {/* Submit error */}
            {submitError && (
              <p className="mt-3 text-sm text-rose-400 font-['Montserrat'] font-medium flex items-center gap-2 animate-in fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                {submitError}
              </p>
            )}

            {/* Submit success */}
            {submitSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-['Montserrat'] animate-in fade-in">
                {submitSuccess}
              </div>
            )}


            {/* Stage 2: OTP Input */}
            {showOtpStage && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Email confirmation message */}
                <div className="mb-8 p-4 bg-gradient-to-r from-blue-900/20 via-blue-800/10 to-blue-900/20 border border-blue-500/30 rounded-xl flex flex-col items-center">
                  <p className="text-sm text-blue-300 font-['Montserrat'] flex items-center gap-2">
                    Mã xác thực đã được gửi đến
                  </p>

                  <p className="font-bold text-blue-200">{email}</p>
                </div>

                {/* OTP Input boxes */}
                <div className="mb-8">
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
                          otpError
                            ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500 text-red-500"
                            : "border-2 border-slate-600/50 text-amber-400 focus:border-amber-500 focus:ring-amber-500"
                        } bg-slate-900 rounded-xl  focus:ring-2 outline-none transition-all duration-300 font-['Montserrat'] hover:border-slate-500/70`}
                        placeholder="•"
                      />
                    ))}
                  </div>
                  {otpError && (
                    <div className="mt-4 text-center text-sm text-red-500 font-['Montserrat']">
                      {otpError}
                    </div>
                  )}
                </div>

                {/* Timer and Resend */}
                <div className="mb-8 p-5 bg-gradient-to-r from-slate-800/50 to-slate-900/30 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-300 font-['Montserrat']">
                      <span className="text-sm">
                        {canResend
                          ? "Nếu chưa có mã"
                          : `Gửi lại mã trong ${timeLeft}s`}
                      </span>
                    </div>
                    <button
                      onClick={handleResendOtp}
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
                  onClick={handleVerifyOtp}
                  disabled={isVerifying || otp.join("").length !== 6}
                  className={`w-full py-4 px-6 rounded-xl font-['Montserrat'] font-bold text-lg transition-all duration-300 shadow-lg ${
                    otp.join("").length === 6
                      ? "bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-500 hover:to-orange-400 text-white hover:shadow-amber-500/50 hover:scale-105 cursor-pointer"
                      : "bg-gradient-to-r from-slate-700 to-slate-600 text-slate-300 cursor-not-allowed opacity-60"
                  }`}
                >
                  {isVerifying ? (
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
                      Đang xác thực...
                    </span>
                  ) : (
                    "Xác nhận"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
