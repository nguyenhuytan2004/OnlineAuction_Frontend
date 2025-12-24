import React, { useState } from "react";
import { Mail, Lock, User, ShieldCheck } from "lucide-react";
import { notify } from "../../utils/toast";

const InputField = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-slate-300">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
      <input
        {...props}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100
        focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition"
      />
    </div>
  </div>
);

const CreateUserModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "BIDDER",
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!form.email || !form.password || !form.fullName) {
      notify.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-xl font-black text-white">Tạo người dùng</h2>
          <p className="text-sm text-slate-400 mt-1">
            Thêm tài khoản mới vào hệ thống
          </p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <InputField
            icon={Mail}
            label="Email"
            type="email"
            placeholder="user@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <InputField
            icon={Lock}
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <InputField
            icon={User}
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
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
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100
                focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition"
              >
                <option value="ADMIN">Admin</option>
                <option value="SELLER">Seller</option>
                <option value="BIDDER">Bidder</option>
              </select>
            </div>
            <p className="text-xs text-slate-500">
              Phân quyền truy cập cho người dùng
            </p>
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
            Tạo người dùng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
