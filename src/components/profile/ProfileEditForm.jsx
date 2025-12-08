import React from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Lock, Save } from "lucide-react";

/**
 * Component form cập nhật thông tin cá nhân
 */
const ProfileEditForm = ({ user, onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            fullName: user?.fullName || "",
            email: user?.email || "",
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
                <label
                    htmlFor="fullName"
                    className="block text-sm font-bold text-slate-700 mb-2"
                >
                    Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        id="fullName"
                        type="text"
                        {...register("fullName", {
                            required: "Họ tên là bắt buộc",
                            minLength: {
                                value: 3,
                                message: "Họ tên phải có ít nhất 3 ký tự",
                            },
                            maxLength: {
                                value: 100,
                                message: "Họ tên không được quá 100 ký tự",
                            },
                        })}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 transition-all ${
                            errors.fullName
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : "border-slate-300 focus:border-amber-500 focus:ring-amber-500/20"
                        }`}
                        placeholder="Nhập họ và tên của bạn"
                    />
                </div>
                {errors.fullName && (
                    <p className="mt-2 text-sm text-red-600 font-semibold">
                        {errors.fullName.message}
                    </p>
                )}
            </div>

            {/* Email */}
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-bold text-slate-700 mb-2"
                >
                    Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        id="email"
                        type="email"
                        {...register("email", {
                            required: "Email là bắt buộc",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Email không hợp lệ",
                            },
                        })}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 transition-all ${
                            errors.email
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : "border-slate-300 focus:border-amber-500 focus:ring-amber-500/20"
                        }`}
                        placeholder="email@example.com"
                    />
                </div>
                {errors.email && (
                    <p className="mt-2 text-sm text-red-600 font-semibold">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang lưu...
                    </>
                ) : (
                    <>
                        <Save className="w-5 h-5" />
                        Lưu thay đổi
                    </>
                )}
            </button>
        </form>
    );
};

/**
 * Component form đổi mật khẩu
 */
export const ChangePasswordForm = ({ onSubmit }) => {
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

    const onSubmitForm = async (data) => {
        await onSubmit(data);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            {/* Old Password */}
            <div>
                <label
                    htmlFor="oldPassword"
                    className="block text-sm font-bold text-slate-700 mb-2"
                >
                    Mật khẩu hiện tại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        id="oldPassword"
                        type="password"
                        {...register("oldPassword", {
                            required: "Vui lòng nhập mật khẩu hiện tại",
                            minLength: {
                                value: 6,
                                message: "Mật khẩu phải có ít nhất 6 ký tự",
                            },
                        })}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 transition-all ${
                            errors.oldPassword
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : "border-slate-300 focus:border-amber-500 focus:ring-amber-500/20"
                        }`}
                        placeholder="Nhập mật khẩu hiện tại"
                    />
                </div>
                {errors.oldPassword && (
                    <p className="mt-2 text-sm text-red-600 font-semibold">
                        {errors.oldPassword.message}
                    </p>
                )}
            </div>

            {/* New Password */}
            <div>
                <label
                    htmlFor="newPassword"
                    className="block text-sm font-bold text-slate-700 mb-2"
                >
                    Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        id="newPassword"
                        type="password"
                        {...register("newPassword", {
                            required: "Vui lòng nhập mật khẩu mới",
                            minLength: {
                                value: 6,
                                message: "Mật khẩu phải có ít nhất 6 ký tự",
                            },
                        })}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 transition-all ${
                            errors.newPassword
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : "border-slate-300 focus:border-amber-500 focus:ring-amber-500/20"
                        }`}
                        placeholder="Nhập mật khẩu mới"
                    />
                </div>
                {errors.newPassword && (
                    <p className="mt-2 text-sm text-red-600 font-semibold">
                        {errors.newPassword.message}
                    </p>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-bold text-slate-700 mb-2"
                >
                    Xác nhận mật khẩu mới{" "}
                    <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword", {
                            required: "Vui lòng xác nhận mật khẩu mới",
                            validate: (value) =>
                                value === newPassword ||
                                "Mật khẩu xác nhận không khớp",
                        })}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 transition-all ${
                            errors.confirmPassword
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : "border-slate-300 focus:border-amber-500 focus:ring-amber-500/20"
                        }`}
                        placeholder="Nhập lại mật khẩu mới"
                    />
                </div>
                {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 font-semibold">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
    );
};

export default ProfileEditForm;
