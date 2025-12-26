import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { ROUTES } from "../../constants/routes";

const ResetPassword = () => {
  const navigate = useNavigate();

  // Form states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation states
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [confirmError, setConfirmError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Password strength calculation
  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    let errors = [];

    if (!pwd) {
      return {
        score: 0,
        label: "",
        color: "",
        errors: ["Mật khẩu là bắt buộc"],
      };
    }

    // Check length
    if (pwd.length >= 6) strength += 20;
    else errors.push("Ít nhất 6 ký tự");

    if (pwd.length >= 12) strength += 15;
    else if (pwd.length < 8) errors.push("Nên sử dụng 12+ ký tự");

    // Check uppercase
    if (/[A-Z]/.test(pwd)) strength += 20;
    else errors.push("Cần chứa chữ hoa");

    // Check lowercase
    if (/[a-z]/.test(pwd)) strength += 20;
    else errors.push("Cần chứa chữ thường");

    // Check digits
    if (/\d/.test(pwd)) strength += 15;
    else errors.push("Cần chứa chữ số");

    // Check special characters
    if (/[!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?]/.test(pwd)) strength += 10;
    else errors.push("Nên chứa ký tự đặc biệt");

    let label = "";
    let color = "";

    if (strength < 30) {
      label = "Yếu";
      color = "from-red-600 to-red-500";
    } else if (strength < 60) {
      label = "Trung bình";
      color = "from-orange-600 to-orange-500";
    } else if (strength < 85) {
      label = "Mạnh";
      color = "from-blue-600 to-blue-500";
    } else {
      label = "Rất mạnh";
      color = "from-green-600 to-green-500";
    }

    return { score: strength, label, color, errors };
  };

  const strengthInfo = calculatePasswordStrength(password);

  // Validate confirm password
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConfirmError("Mật khẩu không khớp");
    } else {
      setConfirmError("");
    }
  }, [password, confirmPassword]);

  // Handle form submission
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    // Validation
    if (!password) {
      setPasswordErrors(["Vui lòng nhập mật khẩu"]);
      return;
    }

    if (password.length < 6) {
      setPasswordErrors(["Mật khẩu phải có ít nhất 6 ký tự"]);
      return;
    }

    if (!confirmPassword) {
      setConfirmError("Vui lòng xác nhận mật khẩu");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Mật khẩu không khớp");
      return;
    }

    setIsUpdating(true);
    setPasswordErrors([]);
    setConfirmError("");

    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      setUpdateSuccess(true);

      // Auto-redirect after 2 seconds
      setTimeout(() => {
        navigate(ROUTES.LOGIN, { replace: true });
      }, 2000);
    }, 1500);
  };

  // Determine if form is valid
  const isFormValid =
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    password === confirmPassword;

  // Success screen
  if (updateSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="w-full max-w-md relative z-10 text-center">
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 rounded-3xl p-12 border border-slate-700/50 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-tr-full"></div>

            <div className="relative z-10 space-y-6">
              {/* Success icon */}
              <div className="mt-10 flex justify-center">
                <div className="relative">
                  <CheckCircle2
                    className="w-20 h-20 text-green-500 animate-bounce object-fill"
                    strokeWidth={1.5}
                  />
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Success message */}
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-3 font-['Montserrat']">
                Cập nhật thành công
              </h1>
              <p className="text-slate-300 font-['Montserrat'] text-base mb-2">
                Mật khẩu của bạn đã được đặt lại thành công.
              </p>
              <p className="text-slate-400 font-['Montserrat']">
                Bạn sẽ được chuyển hướng đến trang Đăng nhập trong giây lát...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden w-full">
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

          <div className="relative z-10">
            {/* Header */}
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-3 font-['Montserrat']">
                Tạo mật khẩu mới
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdatePassword}>
              {/* Password field */}
              <div className="mb-6">
                <label className="block text-sm text-slate-400 font-['Montserrat'] font-semibold mb-3 uppercase tracking-widest">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordErrors([]);
                    }}
                    placeholder="Nhập mật khẩu mới"
                    className={`w-full pr-12 pl-4 py-3.5 bg-gradient-to-br from-slate-800/60 to-slate-900/40 border-2 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all duration-300 font-['Montserrat'] font-semibold ${
                      passwordErrors.length > 0
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                        : "border-slate-600/50 hover:border-slate-500/70 focus:border-amber-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password strength indicator */}
                {password && (
                  <div className="mt-4 space-y-2">
                    {/* Strength bar */}
                    <div className="relative h-2 bg-slate-700/30 rounded-full overflow-hidden border border-slate-600/30">
                      <div
                        className={`h-full bg-gradient-to-r ${strengthInfo.color} transition-all duration-300 rounded-full`}
                        style={{ width: `${strengthInfo.score}%` }}
                      ></div>
                    </div>

                    {/* Strength label and error list */}
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-['Montserrat'] font-bold">
                        <span className="text-slate-400">Độ mạnh: </span>
                        <span
                          className={`text-transparent bg-clip-text bg-gradient-to-r ${strengthInfo.color}`}
                        >
                          {strengthInfo.label}
                        </span>
                      </span>
                    </div>

                    {/* Error list */}
                    {strengthInfo.errors.length > 0 && (
                      <ul className="space-y-1">
                        {strengthInfo.errors.map((error, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-slate-400 font-['Montserrat'] flex items-center gap-2"
                          >
                            <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                            {error}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Password errors */}
                {passwordErrors.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {passwordErrors.map((error, idx) => (
                      <p
                        key={idx}
                        className="text-red-400 text-xs font-['Montserrat'] font-semibold animate-in fade-in"
                      >
                        {error}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm password field */}
              <div>
                <label className="block text-sm text-slate-400 font-['Montserrat'] font-semibold mb-3 uppercase tracking-widest">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmError("");
                    }}
                    placeholder="Nhập lại mật khẩu"
                    className={`w-full pr-12 pl-4 py-3.5 bg-gradient-to-br from-slate-800/60 to-slate-900/40 border-2 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all duration-300 font-['Montserrat'] font-semibold ${
                      confirmError
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                        : "border-slate-600/50 hover:border-slate-500/70 focus:border-amber-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {confirmError && (
                  <p className="text-red-400 text-xs mt-2 font-['Montserrat'] font-semibold animate-in fade-in">
                    {confirmError}
                  </p>
                )}

                {/* Match indicator */}
                {confirmPassword && !confirmError && (
                  <div className="mt-2 flex items-center gap-2 text-green-400 text-xs font-['Montserrat'] font-semibold animate-in fade-in">
                    Mật khẩu khớp
                  </div>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={!isFormValid || isUpdating}
                className={`w-full py-4 px-6 rounded-xl font-['Montserrat'] font-bold text-lg transition-all duration-300 shadow-lg mt-10 ${
                  isFormValid && !isUpdating
                    ? "bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-500 hover:to-orange-400 text-white hover:shadow-amber-500/50 hover:scale-105 cursor-pointer"
                    : "bg-gradient-to-r from-slate-700 to-slate-600 text-slate-300 cursor-not-allowed opacity-60"
                }`}
              >
                {isUpdating ? (
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
                    Đang cập nhật...
                  </span>
                ) : (
                  "Cập nhật mật khẩu"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
