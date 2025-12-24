import React, { useState, useEffect } from "react";
import {
  User,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { notify } from "../../utils/toast";

const InputField = ({ icon: Icon, label, value, onChange, disabled }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-slate-300">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
      <input
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`w-full pl-10 pr-4 py-2.5 rounded-lg
        bg-slate-900 border border-slate-700 text-slate-100
        focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      />
    </div>
  </div>
);

const EditUserModal = ({ isOpen, user, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    fullName: "",
    role: "BIDDER",
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.name,
        email: user.email,
        role: user.role.toUpperCase(),
        isActive: user.status === "active",
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = () => {
    if (!form.fullName) {
      notify.error("Tên người dùng không được để trống");
      return;
    }
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-xl font-black text-white">
            Chỉnh sửa người dùng
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Cập nhật thông tin và phân quyền
          </p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">

          {/* Full name */}
          <InputField
            icon={User}
            label="Họ và tên"
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
          />

          {/* Email (readonly) */}
          <InputField
            icon={User}
            label="Email"
            value={user.email}
            disabled
          />

          {/* Role */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">
              Vai trò
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100
                focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
              >
                <option value="ADMIN">Admin</option>
                <option value="SELLER">Seller</option>
                <option value="BIDDER">Bidder</option>
              </select>
            </div>
            <p className="text-xs text-slate-500">
              Quyền truy cập của người dùng trong hệ thống
            </p>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-200">
                Trạng thái hoạt động
              </p>
              <p className="text-xs text-slate-500">
                Cho phép hoặc vô hiệu hóa tài khoản
              </p>
            </div>

            <button
              onClick={() =>
                setForm({ ...form, isActive: !form.isActive })
              }
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold
              ${
                form.isActive
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              {form.isActive ? (
                <ToggleRight className="w-5 h-5" />
              ) : (
                <ToggleLeft className="w-5 h-5" />
              )}
              {form.isActive ? "Hoạt động" : "Vô hiệu"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm rounded-lg font-bold
            bg-gradient-to-r from-cyan-600 to-blue-600
            hover:from-cyan-700 hover:to-blue-700 text-white"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
