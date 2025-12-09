import { useState } from "react";
import { Lock, Shield, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { CheckCircle, XCircle } from "lucide-react";
import userProfileService from "../../services/userProfileService";

/**
 * Component đổi mật khẩu
 */
const ChangePassword = () => {
    const [updateState, setUpdateState] = useState({
        message: "",
        success: false,
    });
    const {
        register,
        handleSubmit: checkOnSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const currentPassword = watch("currentPassword");
    const newPassword = watch("newPassword");

    const handleSubmit = async (data) => {
        console.log("Submitting password change:", data);
        try {
            const response = await userProfileService.changePassword(data);
            setUpdateState({
                message: response || "Đổi mật khẩu thành công!",
                success: true,
            });
            reset();
            setTimeout(
                () => setUpdateState({ message: "", success: false }),
                3000,
            );
        } catch (error) {
            setUpdateState({
                message: error || "Không thể đổi mật khẩu",
                success: false,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-purple-500/20 p-8 mb-8 border border-slate-700/50 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10"></div>
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
                        {updateState.success ? (
                            <div className="mb-6 p-4 bg-green-500/20 border-2 border-green-500/30 rounded-xl text-green-300 font-semibold animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-sm flex gap-2">
                                <CheckCircle />
                                {updateState.message}
                            </div>
                        ) : updateState.message ? (
                            <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-500/30 rounded-xl text-red-300 font-semibold animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-sm flex gap-2">
                                <XCircle />
                                {updateState.message}
                            </div>
                        ) : null}

                        <form
                            onSubmit={checkOnSubmit(handleSubmit)}
                            className="space-y-6"
                        >
                            {/* Current Password */}
                            <div>
                                <label
                                    htmlFor="currentPassword"
                                    className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider"
                                >
                                    Mật khẩu hiện tại{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        id="currentPassword"
                                        type="password"
                                        {...register("currentPassword", {
                                            required:
                                                "Vui lòng nhập mật khẩu hiện tại",
                                            minLength: {
                                                value: 6,
                                                message:
                                                    "Mật khẩu phải có ít nhất 6 ký tự",
                                            },
                                        })}
                                        className={`w-full pl-12 pr-4 py-3 bg-slate-950/50 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-slate-100 placeholder-slate-500 focus:outline-none ${
                                            errors.currentPassword
                                                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                                                : "border-slate-700/50 focus:border-purple-500 focus:ring-purple-500/20"
                                        }`}
                                        placeholder="Nhập mật khẩu hiện tại"
                                    />
                                </div>
                                {errors.currentPassword && (
                                    <p className="text-red-400 text-xs mt-2 font-semibold flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-200">
                                        {errors.currentPassword.message}
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
                                            validate: (value) =>
                                                value !== currentPassword ||
                                                "Mật khẩu mới phải khác mật khẩu hiện tại",
                                        })}
                                        className={`w-full pl-12 pr-4 py-3 bg-slate-950/50 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-slate-100 placeholder-slate-500 focus:outline-none ${
                                            errors.newPassword
                                                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                                                : "border-slate-700/50 focus:border-purple-500 focus:ring-purple-500/20"
                                        }`}
                                        placeholder="Nhập mật khẩu mới"
                                    />
                                </div>
                                {errors.newPassword && (
                                    <p className="text-red-400 text-xs mt-2 font-semibold flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-200">
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
                                        className={`w-full pl-12 pr-4 py-3 bg-slate-950/50 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-slate-100 placeholder-slate-500 focus:outline-none ${
                                            errors.confirmPassword
                                                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                                                : "border-slate-700/50 focus:border-purple-500 focus:ring-purple-500/20"
                                        }`}
                                        placeholder="Nhập lại mật khẩu mới"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-400 text-xs mt-2 font-semibold flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-200">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-full transition-all duration-500 hover:scale-105 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide"
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
