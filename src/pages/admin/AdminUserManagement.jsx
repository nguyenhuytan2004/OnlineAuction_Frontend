import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Users,
  Shield,
  ShoppingCart,
  TrendingUp,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Package,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Trash2,
  Plus,
  AlertTriangle,
} from "lucide-react";

import userService from "../../services/userService";

import CustomDropdown from "../../components/common/CustomDropdown";
import formatters from "../../utils/formatters";
import BackgroundDecoration from "../../components/common/BackgroundDecoration";
import { notify } from "../../utils/toast";
import Tooltip from "../../components/common/Tooltip";
import { Toaster } from "react-hot-toast";

const DeleteModal = ({
  isModalOpen,
  selectedUser,
  setIsModalOpen,
  handleDeleteAccount,
  isDeleting,
}) => {
  if (!isModalOpen || !selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl w-full max-w-md overflow-hidden border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 text-white">
          <div className="flex items-center gap-3 p-2 justify-between">
            <h2 className="text-xl font-black">Xóa Người Dùng</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-3 transition-all duration-300 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 relative">
          <BackgroundDecoration accentColor="red" />
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-400 mb-2">Người Dùng</p>
            <p className="font-semibold text-slate-100 text-lg">
              {selectedUser.fullName}
            </p>
            <p className="text-sm text-slate-500 mt-2">{selectedUser.email}</p>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-200/80">
              Hành động này sẽ xóa vĩnh viễn người dùng khỏi hệ thống. Dữ liệu
              không thể phục hồi.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              disabled={isDeleting}
              className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 font-bold rounded-lg transition-all duration-300 hover:scale-95"
            >
              Hủy
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 hover:scale-95"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateModal = ({
  isModalOpen,
  setIsModalOpen,
  handleCreateAccount,
  isCreating,
  createError,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
  });

  const password = watch("password");
  const role = watch("role");

  const roleOptions = ["Quản Trị Viên", "Người Bán", "Người Mua"];
  const roleValues = ["ADMIN", "SELLER", "BIDDER"];
  const selectedRoleIndex = role ? roleValues.indexOf(role) : null;

  const onSubmit = async (data) => {
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...dataToSubmit } = data;
    const newUser = await handleCreateAccount(dataToSubmit);
    newUser && reset();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950 rounded-3xl w-full max-w-md border border-slate-700/50 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/50 to-teal-600/50 opacity-50"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black">Tạo Tài Khoản</h2>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-3 transition-all duration-300 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[80vh] overflow-y-auto relative">
          <BackgroundDecoration accentColor="emerald" />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 relative z-10"
          >
            {/* Full Name */}
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-2 uppercase tracking-wide block">
                Tên Đầy Đủ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tên đầy đủ"
                {...register("fullName", {
                  required: "Vui lòng nhập tên đầy đủ",
                })}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-100  border-slate-600/50 placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.fullName
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                }`}
              />
              {errors.fullName && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-2 uppercase tracking-wide block">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Nhập email"
                {...register("email", {
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email không hợp lệ",
                  },
                })}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-100 border-slate-600/50 placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
              {createError && (
                <p className="text-xs text-red-400 mt-1">{createError.email}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-2 uppercase tracking-wide block">
                Vai Trò <span className="text-red-500">*</span>
              </label>
              <CustomDropdown
                options={roleOptions}
                selectedIndex={selectedRoleIndex}
                onSelect={(index) => setValue("role", roleValues[index])}
                placeholder="-- Chọn vai trò --"
                accentColor="emerald"
              />
              <input
                type="hidden"
                {...register("role", { required: "Vui lòng chọn vai trò" })}
              />
              {errors.role && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-2 uppercase tracking-wide block">
                Mật Khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu",
                  minLength: {
                    value: 6,
                    message: "Mật khẩu phải có ít nhất 6 ký tự",
                  },
                })}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-100 border-slate-600/50 placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                }`}
              />
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-2 uppercase tracking-wide block">
                Xác Nhận Mật Khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                {...register("confirmPassword", {
                  required: "Vui lòng xác nhận mật khẩu",
                  validate: (value) =>
                    value === password || "Mật khẩu xác nhận không khớp",
                })}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-100 border-slate-600/50 placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isCreating}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-100 font-bold rounded-lg transition-all duration-300 hover:scale-95"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 hover:scale-95 shadow-lg shadow-emerald-500/30"
              >
                {isCreating ? "Đang tạo..." : "Tạo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const DetailModal = ({
  isDetailOpen,
  selectedUser,
  setIsDetailOpen,
  getRoleIcon,
  getRoleLabel,
  handleLockAccount,
  handleUnlockAccount,
  isUpdating,
}) => {
  if (!isDetailOpen || !selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950 rounded-3xl w-full max-w-2xl border border-slate-700/50 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600  to-sky-600 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-sky-600/50 opacity-50"></div>
          <div className="relative z-10 flex items-center justify-between">
            <h2 className="text-3xl font-black p-2">Chi Tiết Người Dùng</h2>
            <button
              onClick={() => setIsDetailOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-3 transition-all duration-300 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto relative">
          <BackgroundDecoration accentColor="blue" />
          <div className="p-8 space-y-8">
            {/* Role and Status */}
            <div className="flex items-center gap-4">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm ${
                  selectedUser.role === "SELLER"
                    ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                    : selectedUser.role === "BIDDER"
                    ? "bg-blue-500/20 border border-blue-500/30 text-blue-300"
                    : "bg-purple-500/20 border border-purple-500/30 text-purple-300"
                }`}
              >
                {getRoleIcon(selectedUser.role)}
                {getRoleLabel(selectedUser.role)}
              </span>
              <span
                className={`inline-flex px-4 py-2 text-sm font-bold rounded-full border ${
                  selectedUser.isActive
                    ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                    : "bg-red-500/20 border-red-500/30 text-red-300"
                }`}
              >
                {selectedUser.isActive ? "Hoạt động" : "Đã Khóa"}
              </span>
            </div>

            {/* Basic Information */}
            <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-4">
                Thông Tin Cơ Bản
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wide">
                    Tên Đầy Đủ
                  </p>
                  <p className="text-slate-200 font-semibold">
                    {selectedUser.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-slate-200 font-semibold break-all">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 rounded-xl border border-yellow-500/30 p-6">
                <p className="text-xs text-yellow-400 font-semibold mb-3 uppercase tracking-wide">
                  Điểm Đánh Giá
                </p>
                <p className="text-3xl font-black text-yellow-300">
                  {selectedUser.ratingScore}
                </p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 rounded-xl border border-cyan-500/30 p-6">
                <p className="text-xs text-cyan-400 font-semibold mb-3 uppercase tracking-wide">
                  Số Lần Đánh Giá
                </p>
                <p className="text-3xl font-black text-cyan-300">
                  {selectedUser.ratingCount}
                </p>
              </div>
            </div>

            {/* Created Date */}
            <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 px-6 py-4">
              <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wide">
                Ngày Tạo Tài Khoản
              </p>
              <p className="text-slate-200 font-semibold">
                {formatters.formatDate(selectedUser.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800/30 border-t border-slate-700/50 p-6 flex gap-3">
          <button
            disabled={isUpdating}
            onClick={() => setIsDetailOpen(false)}
            className="w-1/2 py-3 px-6 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 font-bold rounded-lg transition-all duration-300 hover:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Đóng
          </button>
          {selectedUser.role === "ADMIN" ? (
            <div className="relative group w-1/2">
              <button
                disabled
                className="py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-95 shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                Khóa tài khoản
              </button>
              <Tooltip
                text="Không thể khóa tài khoản quản trị viên"
                position="right-1/2 bottom-full mb-2 transform translate-x-1/2"
              />
            </div>
          ) : (
            <button
              disabled={isUpdating}
              onClick={
                selectedUser.isActive ? handleLockAccount : handleUnlockAccount
              }
              className="flex-1 py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-95 shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating
                ? selectedUser.isActive
                  ? "Đang khóa..."
                  : "Đang mở khóa..."
                : selectedUser.isActive
                ? "Khóa Tài Khoản"
                : "Mở Khóa Tài Khoản"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("Tất cả");
  const [filterRoleIndex, setFilterRoleIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [createError, setCreateError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const queryParams = {
          role:
            filterRole === "Tất cả"
              ? null
              : filterRole === "Quản Trị Viên"
              ? "ADMIN"
              : filterRole === "Người bán"
              ? "SELLER"
              : "BIDDER",
          page: currentPage - 1,
          size: 5,
        };
        const userPage = await userService.getUsers(queryParams);
        console.log("User page response:", userPage);
        const users = userPage.content;
        setUsers(users);
        setTotalPages(userPage.totalPages || 1);
        console.log("Fetched users:", users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [filterRole, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterRole, searchTerm]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole === "Tất cả" ||
      (filterRole === "Quản Trị Viên" && user.role === "ADMIN") ||
      (filterRole === "Người bán" && user.role === "SELLER") ||
      (filterRole === "Người mua" && user.role === "BIDDER");
    return matchesSearch && matchesRole;
  });

  const handleLockAccount = async () => {
    try {
      setIsUpdating(true);
      const updateUser = {
        email: selectedUser.email,
        fullName: selectedUser.fullName,
        ratingScore: selectedUser.ratingScore,
        ratingCount: selectedUser.ratingCount,
        role: selectedUser.role,
        sellerExpiresAt: selectedUser.sellerExpiresAt,
        isActive: false,
      };
      const updatedUser = await userService.updateUser(
        selectedUser.userId,
        updateUser,
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === updatedUser.userId
            ? { ...user, isActive: false }
            : user,
        ),
      );
      notify.success("Khóa tài khoản người dùng thành công");
      setSelectedUser(null);
      setIsDetailOpen(false);
    } catch (error) {
      console.error("Failed to lock user account:", error);
      notify.error("Khóa tài khoản người dùng thất bại. Vui lòng thử lại.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUnlockAccount = async () => {
    try {
      setIsUpdating(true);
      const updateUser = {
        email: selectedUser.email,
        fullName: selectedUser.fullName,
        ratingScore: selectedUser.ratingScore,
        ratingCount: selectedUser.ratingCount,
        role: selectedUser.role,
        sellerExpiresAt: selectedUser.sellerExpiresAt,
        isActive: true,
      };
      const updatedUser = await userService.updateUser(
        selectedUser.userId,
        updateUser,
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === updatedUser.userId
            ? { ...user, isActive: true }
            : user,
        ),
      );
      notify.success("Mở khóa tài khoản người dùng thành công");
      setSelectedUser(null);
      setIsDetailOpen(false);
    } catch (error) {
      console.error("Failed to unlock user account:", error);
      notify.error("Mở khóa tài khoản người dùng thất bại. Vui lòng thử lại.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await userService.deleteUser(selectedUser.userId);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== selectedUser.userId),
      );
      notify.success("Xóa người dùng thành công");
      setIsDeleteOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
      notify.error("Xóa người dùng thất bại. Vui lòng thử lại.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateAccount = async (accountData) => {
    try {
      setIsCreating(true);
      const newUser = await userService.createUser(accountData);
      setUsers((prevUsers) => [newUser, ...prevUsers]);
      notify.success("Tạo tài khoản thành công");
      setIsCreateOpen(false);

      return newUser;
    } catch (error) {
      console.error("Failed to create user:", error);
      setCreateError(error);
      notify.error("Tạo tài khoản thất bại. Vui lòng thử lại.");
    } finally {
      setIsCreating(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-4 h-4" />;
      case "SELLER":
        return <TrendingUp className="w-4 h-4" />;
      case "BIDDER":
        return <ShoppingCart className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-500/20 text-purple-300";
      case "SELLER":
        return "bg-emerald-500/20 text-emerald-300";
      case "BIDDER":
        return "bg-blue-500/20 text-blue-300";
      default:
        return "bg-slate-700/50 text-slate-300";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "ADMIN":
        return "Quản Trị Viên";
      case "SELLER":
        return "Người Bán";
      case "BIDDER":
        return "Người Mua";
      default:
        return "Không xác định";
    }
  };

  const filterRoleOptions = [
    "Tất cả",
    "Quản Trị Viên",
    "Người bán",
    "Người mua",
  ];

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-cyan-500/20 p-8 border border-slate-700/50 relative overflow-hidden backdrop-blur-sm flex items-center justify-between">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-blue-600/10"></div>
              <div className="flex items-center gap-4 relative z-10">
                <Users className="w-12 h-12 text-cyan-400" />
                <div>
                  <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2 tracking-tight">
                    Quản Lý Người Dùng
                  </h1>
                  <p className="text-slate-300 font-semibold tracking-wide">
                    Quản lý người bán, người mua và hoạt động
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/30 relative z-10"
              >
                <Plus className="w-5 h-5" />
                Tạo Tài Khoản
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 mb-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-500" />
                <div className="w-full">
                  <CustomDropdown
                    options={filterRoleOptions}
                    selectedIndex={filterRoleIndex}
                    onSelect={(index) =>
                      setFilterRole(filterRoleOptions[index]) ||
                      setFilterRoleIndex(index)
                    }
                    accentColor="blue"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              {/* Spinner with animate */}
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="w-12 h-12 border-4 border-t-4 border-slate-600 border-t-cyan-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-slate-800/50 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider">
                        Tên Người Dùng
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider">
                        Vai Trò
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-slate-300 uppercase tracking-wider">
                        Điểm Đánh Giá
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-slate-300 uppercase tracking-wider">
                        Trạng Thái
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-slate-300 uppercase tracking-wider">
                        Hành Động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.userId}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-100">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {user.userId}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${getRoleColor(
                              user.role,
                            )}`}
                          >
                            {getRoleIcon(user.role)}
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-yellow-400 font-bold">
                              {user.ratingScore}
                            </span>
                            <span className="text-xs text-slate-500">
                              ({user.ratingCount})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                              user.isActive
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {user.isActive ? "Hoạt động" : "Đã Khóa"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setIsDetailOpen(true);
                              }}
                              className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <div className="relative group">
                              <button
                                disabled={user.role === "ADMIN"}
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsDeleteOpen(true);
                                }}
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                              {user.role === "ADMIN" && (
                                <Tooltip
                                  text="Không thể xóa tài khoản quản trị viên"
                                  position="right-1/2 bottom-full mb-2"
                                />
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 font-semibold">
                  Không tìm thấy người dùng nào
                </p>
              </div>
            )}

            {filteredUsers.length > 0 && (
              <div className="bg-slate-800/30 border-t border-slate-700/50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">
                    Trang{" "}
                    <span className="font-bold text-slate-200">
                      {currentPage}
                    </span>{" "}
                    trên{" "}
                    <span className="font-bold text-slate-200">
                      {totalPages}
                    </span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1 || isLoading}
                      className="flex items-center gap-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 font-semibold rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Trước
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            disabled={isLoading}
                            className={`w-8 h-8 font-bold rounded-lg transition-colors ${
                              currentPage === page
                                ? "bg-cyan-600 text-white"
                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {page}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages || isLoading}
                      className="flex items-center gap-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 font-semibold rounded-lg transition-colors"
                    >
                      Sau
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <DetailModal
        isDetailOpen={isDetailOpen}
        selectedUser={selectedUser}
        setIsDetailOpen={setIsDetailOpen}
        getRoleIcon={getRoleIcon}
        getRoleLabel={getRoleLabel}
        handleLockAccount={handleLockAccount}
        handleUnlockAccount={handleUnlockAccount}
        isUpdating={isUpdating}
      />

      <DeleteModal
        isModalOpen={isDeleteOpen}
        selectedUser={selectedUser}
        setIsModalOpen={setIsDeleteOpen}
        handleDeleteAccount={handleDeleteAccount}
        isDeleting={isDeleting}
      />

      <CreateModal
        isModalOpen={isCreateOpen}
        setIsModalOpen={setIsCreateOpen}
        handleCreateAccount={handleCreateAccount}
        isCreating={isCreating}
        createError={createError}
      />
    </>
  );
};

export default AdminUserManagement;
