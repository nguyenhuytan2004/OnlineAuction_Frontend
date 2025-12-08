import React, { useState } from "react";
import { Lock, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import userProfileService from "../../services/userProfileService";

/**
 * Component đổi mật khẩu
 */
const ChangePassword = () => {
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const newPassword = watch("newPassword");

    const onSubmit = async (data) => {
        try {
            await userProfileService.changePassword(data);
            setUpdateSuccess(true);
            reset();
            setTimeout(() => setUpdateSuccess(false), 3000);
        } catch (error) {
            alert(error.message || "Không thể đổi mật khẩu");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-purple-500/20 p-8 mb-8 border border-slate-700/50 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <Shield className="w-12 h-12 text-purple-400" />
                        <div>
                            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-2 tracking-tight">
                                Đổi Mật Khẩu
                            </h1>
                            <p className="text-slate-300 font-semibold tracking-wide">
                                Cập nhật mật khẩu để bảo mật tài khoản của bạn
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700/50 backdrop-blur-sm">
                        {updateSuccess && (
                            <div className="mb-6 p-4 bg-green-500/20 border-2 border-green-500/30 rounded-xl text-green-300 font-semibold animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-sm">
                                ✓ Đổi mật khẩu thành công!
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* Old Password */}
                            <div>
                                <label
                                    htmlFor="oldPassword"
                                    className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider"
                                >
                                    Mật khẩu hiện tại{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        id="oldPassword"
                                        type="password"
                                        {...register("oldPassword", {
                                            required:
                                                "Vui lòng nhập mật khẩu hiện tại",
                                            minLength: {
                                                value: 6,
                                                message:
                                                    "Mật khẩu phải có ít nhất 6 ký tự",
                                            },
                                        })}
                                        className={`w-full pl-12 pr-4 py-3 bg-slate-950/50 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-slate-100 placeholder-slate-500 ${
                                            errors.oldPassword
                                                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                                                : "border-slate-700/50 focus:border-purple-500 focus:ring-purple-500/20"
                                        }`}
                                        placeholder="Nhập mật khẩu hiện tại"
                                    />
                                </div>
                                {errors.oldPassword && (
                                    <p className="mt-2 text-sm text-red-400 font-semibold">
                                        {errors.oldPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* New Password */}
                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider"
                                >
                                    Mật khẩu mới{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        id="newPassword"
                                        type="password"
                                        {...register("newPassword", {
                                            required:
                                                "Vui lòng nhập mật khẩu mới",
                                            minLength: {
                                                value: 6,
                                                message:
                                                    "Mật khẩu phải có ít nhất 6 ký tự",
                                            },
                                        })}
                                        className={`w-full pl-12 pr-4 py-3 bg-slate-950/50 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-slate-100 placeholder-slate-500 ${
                                            errors.newPassword
                                                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                                                : "border-slate-700/50 focus:border-purple-500 focus:ring-purple-500/20"
                                        }`}
                                        placeholder="Nhập mật khẩu mới"
                                    />
                                </div>
                                {errors.newPassword && (
                                    <p className="mt-2 text-sm text-red-400 font-semibold">
                                        {errors.newPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider"
                                >
                                    Xác nhận mật khẩu mới{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        {...register("confirmPassword", {
                                            required:
                                                "Vui lòng xác nhận mật khẩu mới",
                                            validate: (value) =>
                                                value === newPassword ||
                                                "Mật khẩu xác nhận không khớp",
                                        })}
                                        className={`w-full pl-12 pr-4 py-3 bg-slate-950/50 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-slate-100 placeholder-slate-500 ${
                                            errors.confirmPassword
                                                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                                                : "border-slate-700/50 focus:border-purple-500 focus:ring-purple-500/20"
                                        }`}
                                        placeholder="Nhập lại mật khẩu mới"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-2 text-sm text-red-400 font-semibold">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-full transition-all duration-500 hover:scale-105 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Đang đổi mật khẩu...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5" />
                                        Đổi mật khẩu
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
