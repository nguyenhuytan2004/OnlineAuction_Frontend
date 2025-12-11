import React, { useState } from "react";
import { User, User2, Mail, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/useAuth";
import userProfileService from "../../../services/userProfileService";
import helpers from "../../../utils/helpers";

/**
 * Component cập nhật thông tin tài khoản
 */
const AccountSettings = () => {
    const { user } = useAuth();
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const {
        register,
        handleSubmit: checkOnSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            fullName: user?.fullName || "",
            email: user?.email || "",
        },
    });

    const handleSubmit = async (data) => {
        try {
            await userProfileService.updateProfile(data);
            setUpdateSuccess(true);
            setTimeout(() => setUpdateSuccess(false), 3000);
        } catch (error) {
            alert(error.message || "Không thể cập nhật thông tin");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-blue-500/20 p-8 mb-16 border border-slate-700/50 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <User className="w-12 h-12 text-blue-500" />
                        <div>
                            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-2 tracking-tight">
                                Thông Tin Tài Khoản
                            </h1>
                            <p className="text-slate-300 font-semibold tracking-wide">
                                Cập nhật họ tên và email của bạn
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700/50 backdrop-blur-sm">
                        {updateSuccess && (
                            <div className="mb-6 p-4 bg-green-500/20 border-2 border-green-500/30 rounded-xl text-green-300 font-semibold animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-sm">
                                ✓ Cập nhật thông tin thành công!
                            </div>
                        )}

                        <form
                            onSubmit={checkOnSubmit(handleSubmit)}
                            className="space-y-6"
                        >
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider"
                                >
                                    Email{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
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
                                        className={`w-full pl-12 pr-4 py-3 bg-slate-950/50 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-slate-100 placeholder-slate-500 focus:outline-none ${
                                            errors.email
                                                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                                                : "border-slate-700/50 focus:border-blue-500 focus:ring-blue-500/20"
                                        }`}
                                        placeholder="email@example.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-400 text-xs mt-2 font-semibold flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-200">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Full Name */}
                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider"
                                >
                                    Họ và tên{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <User2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        id="fullName"
                                        {...register("fullName", {
                                            required: "Họ tên là bắt buộc",
                                            minLength: {
                                                value: 3,
                                                message:
                                                    "Họ tên phải có ít nhất 3 ký tự",
                                            },
                                            maxLength: {
                                                value: 100,
                                                message:
                                                    "Họ tên không được quá 100 ký tự",
                                            },
                                        })}
                                        className={`w-full pl-12 pr-4 py-3 bg-slate-950/50 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-slate-100 placeholder-slate-500 focus:outline-none ${
                                            errors.fullName
                                                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                                                : "border-slate-700/50 focus:border-blue-500 focus:ring-blue-500/20 "
                                        }`}
                                        placeholder="Nhập họ và tên của bạn"
                                    />
                                </div>
                                {errors.fullName && (
                                    <p className="text-red-400 text-xs mt-2 font-semibold flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-200">
                                        {errors.fullName.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-full transition-all duration-500 hover:scale-105 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide"
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
