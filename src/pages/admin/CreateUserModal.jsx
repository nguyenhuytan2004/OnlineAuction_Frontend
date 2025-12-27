import React, { useState } from "react";
import { Mail, Lock, User, ShieldCheck, X } from "lucide-react";
import BackgroundDecoration from "../../components/common/BackgroundDecoration";
import CustomDropdown from "../../components/common/CustomDropdown";

const InputField = ({ icon: Icon, label, error, ...props }) => (
  <div className="mb-5">
    <label className="block text-sm font-bold text-slate-300 mb-2">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
      <input
        {...props}
        className={`w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border rounded-lg
        text-slate-100 placeholder-slate-500 outline-none transition-all
        focus:ring-2 focus:ring-cyan-500/20 ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-slate-600 focus:border-cyan-500"
        }`}
      />
    </div>
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const CreateUserModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "BIDDER",
  });

  const roleOptions = ["Admin", "Seller", "Bidder"];
  const [roleIndex, setRoleIndex] = useState(2);
  const ROLE_MAP = {
  Admin: "ADMIN",
  Seller: "SELLER",
  Bidder: "BIDDER",
};

  const [error, setError] = useState("");
  

  if (!isOpen) return null;

  const handleSubmit = () => {
    setError("");

    if (!form.email || !form.password || !form.fullName) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    onSubmit({
    ...form,
    role: form.role,
  });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
        rounded-3xl w-full max-w-md overflow-hidden
        border border-slate-700 shadow-2xl
        animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6
          text-white flex items-center justify-between">
          <h2 className="text-xl font-black">Tạo người dùng</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 relative z-10">
          <BackgroundDecoration accentColor="blue" />
          <InputField
            icon={Mail}
            label="Email"
            type="email"
            placeholder="user@email.com"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <InputField
            icon={Lock}
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <InputField
            icon={User}
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
          />

          {/* Role */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Vai trò
            </label>

            <CustomDropdown
              options={roleOptions}
              selectedIndex={roleIndex}
              onSelect={(index) => {
                setRoleIndex(index);
                setForm({
                  ...form,
                  role: ROLE_MAP[roleOptions[index]],
                });
              }}
              placeholder="-- Chọn vai trò --"
              accentColor="blue"
            />

            <p className="text-xs text-slate-500 mt-1">
              Phân quyền truy cập cho người dùng
            </p>
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-400 font-medium">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600
              text-slate-200 font-bold rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r
              from-cyan-600 to-blue-600
              hover:from-cyan-700 hover:to-blue-700
              text-white font-bold rounded-lg
              transition-all duration-300 hover:scale-105"
            >
              Tạo người dùng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
