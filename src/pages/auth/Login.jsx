import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import authService from "../../services/authService";
import { useForm } from "react-hook-form";
import helpers from "../../utils/helpers";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [generalError, setGeneralError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit: checkOnSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data) => {
    try {
      if (!captchaToken) {
        setGeneralError("Vui lòng xác nhận captcha");
        return;
      }

      const { user } = await authService.login(
        data.email,
        data.password,
        captchaToken,
      );

      // Check if there's a previous page to redirect to
      const returnUrl = location.state?.returnUrl;
      if (returnUrl) {
        navigate(returnUrl, { replace: true });
      } else if (user.role === "ADMIN") {
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.HOME, { replace: true });
      }
    } catch (error) {
      setGeneralError(error?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 rounded-3xl p-10 shadow-2xl border border-slate-700/50 backdrop-blur-xl relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-tr-full"></div>

        {/* Header */}
        <div className="text-center mb-10 relative z-10">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 mb-3 tracking-tight">
            OnlineAuction
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mx-auto mb-4"></div>
          <h2 className="text-3xl font-black text-slate-100 tracking-wide">
            Đăng Nhập
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-semibold">
            Chào mừng quay lại sàn đấu giá
          </p>
        </div>

        {/* General Error */}
        {generalError && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-900/30 to-red-800/30 border-2 border-red-700/50 rounded-xl text-red-300 text-sm font-semibold backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {generalError}
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={checkOnSubmit(handleSubmit)}
          className="space-y-5 relative z-10"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-slate-300 text-sm font-black mb-2 uppercase tracking-wider"
            >
              Email
            </label>
            <input
              id="email"
              type="text"
              {...register("email", {
                required: "Email là bắt buộc",
                pattern: {
                  value: helpers.getEmailRegex(),
                  message: "Email không hợp lệ",
                },
              })}
              placeholder="Nhập email của bạn"
              className={`w-full px-5 py-3.5 bg-slate-800/50 text-slate-100 font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 placeholder-slate-500 backdrop-blur-sm ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-700 hover:border-slate-600"
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-2 font-semibold flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-200">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-slate-300 text-sm font-black mb-2 uppercase tracking-wider"
            >
              Mật Khẩu
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Mật khẩu là bắt buộc",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              })}
              placeholder="Nhập mật khẩu của bạn"
              className={`w-full px-5 py-3.5 bg-slate-800/50 text-slate-100 font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 placeholder-slate-500 backdrop-blur-sm ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-700 hover:border-slate-600"
              }`}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-2 font-semibold flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-200">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-2">
            <label
              htmlFor="rememberMe"
              className="flex items-center text-slate-400 hover:text-slate-300 cursor-pointer group"
            >
              <input
                id="rememberMe"
                type="checkbox"
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-2 focus:ring-amber-500 transition-all duration-300"
              />
              <span className="ml-2 font-semibold">Ghi nhớ tôi</span>
            </label>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-amber-400 hover:text-amber-300 transition-colors duration-300 font-bold"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4 relative z-10">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1"></div>
          </div>

          <ReCAPTCHA
            sitekey="6LcPT0YsAAAAAMkgm_dhM05o1A2WL0TFbys1HjZW"
            onChange={(token) => setCaptchaToken(token)}
            className="mt-4 flex justify-center"
          />
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black py-4 px-6 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-amber-500/50 hover:scale-[1.02] uppercase tracking-wider text-sm overflow-hidden mt-6"
          >
            <span className="relative z-10">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
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
                "Đăng Nhập"
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-8 text-center relative z-10">
          <p className="text-slate-400 text-sm font-semibold">
            Chưa có tài khoản?{" "}
            <Link
              to={ROUTES.REGISTER}
              className="text-amber-400 hover:text-amber-300 font-black transition-colors duration-300"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* Return home page */}
        <div className="mt-6 relative z-10">
          <Link
            to={ROUTES.HOME}
            className="text-slate-400 hover:text-amber-400 transition-colors duration-300 flex items-center justify-center gap-2 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="text-sm font-bold">Quay về trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
