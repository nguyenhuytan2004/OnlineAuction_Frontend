import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import authService from "../../services/authService";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Email là bắt buộc";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ";
        }

        if (!formData.password) {
            newErrors.password = "Mật khẩu là bắt buộc";
        } else if (formData.password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            await authService.login(formData.email, formData.password);
            navigate(ROUTES.HOME);
        } catch (error) {
            setErrors({ general: error || "Lỗi đăng nhập" });
        } finally {
            setLoading(false);
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
                {errors.general && (
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
                            {errors.general}
                        </div>
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 relative z-10"
                >
                    {/* Email */}
                    <div>
                        <label className="block text-slate-300 text-sm font-black mb-2 uppercase tracking-wider">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email của bạn"
                            className={`w-full px-5 py-3.5 bg-slate-800/50 text-slate-100 font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 placeholder-slate-500 backdrop-blur-sm ${
                                errors.email
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-slate-700 hover:border-slate-600"
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-400 text-xs mt-2 font-semibold flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-200">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-slate-300 text-sm font-black mb-2 uppercase tracking-wider">
                            Mật Khẩu
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu của bạn"
                            className={`w-full px-5 py-3.5 bg-slate-800/50 text-slate-100 font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 placeholder-slate-500 backdrop-blur-sm ${
                                errors.password
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-slate-700 hover:border-slate-600"
                            }`}
                        />
                        {errors.password && (
                            <p className="text-red-400 text-xs mt-2 font-semibold flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-200">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-xs pt-2">
                        <label className="flex items-center text-slate-400 hover:text-slate-300 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                            />
                            <span className="ml-2 font-semibold">
                                Ghi nhớ tôi
                            </span>
                        </label>
                        <Link
                            to="#"
                            className="text-amber-400 hover:text-amber-300 transition-colors duration-300 font-bold"
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black py-4 px-6 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-amber-500/50 hover:scale-[1.02] uppercase tracking-wider text-sm overflow-hidden mt-6"
                    >
                        <span className="relative z-10">
                            {loading ? (
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

                {/* Divider */}
                <div className="my-8 flex items-center gap-4 relative z-10">
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1"></div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                        Hoặc
                    </span>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1"></div>
                </div>

                {/* Social Login */}
                <div className="space-y-3 relative z-10">
                    <button className="group w-full py-3.5 bg-slate-800/50 text-slate-200 rounded-xl hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 transition-all duration-300 flex items-center justify-center gap-3 border border-slate-700 hover:border-slate-600 font-bold">
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Đăng nhập bằng Google
                    </button>
                </div>

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
                        <span className="text-sm font-bold">
                            Quay về trang chủ
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
