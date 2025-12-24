import React, { useState, useEffect } from "react";
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
} from "lucide-react";

import adminUserService from "../../services/adminUserService";
import { notify } from "../../utils/toast";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";

/**
 * Admin - User Management
 * Quản lý người dùng: admin, bidder, seller
 */

// User Detail Modal Component
const UserDetailModal = ({
  isDetailOpen,
  selectedUser,
  setIsDetailOpen,
  getRoleIcon,
  getRoleLabel,
  handleDeleteUser,
  onEdit,
}) => {
  if (!isDetailOpen || !selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300 max-h-96 overflow-y-auto">

        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white sticky top-0">
          <div className="flex items-center justify-between mb-2">
            {/* Left: User info */}
            <div className="flex items-center gap-3">
              {getRoleIcon(selectedUser.role)}
              <h2 className="text-xl font-black">{selectedUser.name}</h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedUser.role === "admin"
                    ? "bg-purple-500/30 text-purple-300"
                    : selectedUser.role === "seller"
                    ? "bg-emerald-500/30 text-emerald-300"
                    : "bg-blue-500/30 text-blue-300"
                }`}
              >
                {getRoleLabel(selectedUser.role)}
              </span>
            </div>
          </div>

          <p className="text-sm text-white/90">{selectedUser.email}</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Basic Info */}
          <div className="bg-slate-800/50 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Thông tin cơ bản
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Email</span>
                <span className="text-slate-200 font-semibold">
                  {selectedUser.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Điện thoại</span>
                <span className="text-slate-200 font-semibold">
                  {selectedUser.phone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Địa chỉ</span>
                <span className="text-slate-200 font-semibold">
                  {selectedUser.location}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tham gia</span>
                <span className="text-slate-200 font-semibold">
                  {selectedUser.joinDate}
                </span>
              </div>
            </div>
          </div>

          {/* Seller Stats */}
          {selectedUser.role === "seller" && selectedUser.sellerInfo && (
            <div className="bg-slate-800/50 rounded-xl p-4">
              <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Thống kê người bán
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-500 text-xs mb-1">Sản phẩm</p>
                  <p className="text-lg font-black text-emerald-400">
                    {selectedUser.sellerInfo.products}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-1">Doanh thu</p>
                  <p className="text-lg font-black text-emerald-400">
                    {(selectedUser.sellerInfo.sales / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bidder Stats */}
          {selectedUser.role === "bidder" && selectedUser.bidderInfo && (
            <div className="bg-slate-800/50 rounded-xl p-4">
              <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Thống kê người mua
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-500 text-xs mb-1">Lượt đấu giá</p>
                  <p className="text-lg font-black text-blue-400">
                    {selectedUser.bidderInfo.bids}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-1">Chiến thắng</p>
                  <p className="text-lg font-black text-blue-400">
                    {selectedUser.bidderInfo.wins}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsDetailOpen(false)}
              className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={onEdit}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
            >
              Chỉnh sửa
            </button>
            <button
              onClick={handleDeleteUser}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
            >
              Xóa Tài Khoản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await adminUserService.getAllUsers();

      console.log("USERS RAW:", res);

      // apiClient trả array trực tiếp
      const raw = Array.isArray(res) ? res : [];

      const normalized = raw.map((u) => ({
        id: u.userId,
        name: u.fullName,
        email: u.email,
        phone: u.phone ?? "N/A",
        location: u.address ?? "N/A",
        role: u.role.toLowerCase(), // ADMIN / SELLER / BIDDER
        status: u.isActive ? "active" : "inactive",
        joinDate: new Date(u.createdAt).toLocaleDateString("vi-VN"),

        // optional – nếu backend chưa có
        sellerInfo: u.sellerInfo ?? null,
        bidderInfo: u.bidderInfo ?? null,
      }));

      setUsers(normalized);
    } catch (error) {
      notify.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (payload) => {
    try {
      const created = await adminUserService.createUser(payload);

      setUsers((prev) => [
        {
          id: created.userId,
          name: created.fullName,
          email: created.email,
          role: created.role.toLowerCase(),
          status: created.isActive ? "active" : "inactive",
          joinDate: new Date(created.createdAt).toLocaleDateString("vi-VN"),
          phone: created.phone ?? "N/A",
          location: created.address ?? "N/A",
        },
        ...prev,
      ]);

      notify.success("Tạo người dùng thành công");
      setIsCreateOpen(false);
    } catch (e) {
      notify.error("Tạo người dùng thất bại");
    }
  };


  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const handleOpenDetail = async (user) => {
    try {
      const res = await adminUserService.getUserById(user.id);

      setSelectedUser({
        ...user,
        ...{
          phone: res.phone ?? user.phone,
          location: res.address ?? user.location,
          sellerInfo: res.sellerInfo,
          bidderInfo: res.bidderInfo,
        },
      });

      setIsDetailOpen(true);
    } catch (error) {
      notify.error("Không thể tải chi tiết người dùng");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;

    try {
      await adminUserService.deleteUser(selectedUser.id);

      notify.success("Đã xóa người dùng");

      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setIsDetailOpen(false);
    } catch (error) {
      notify.error("Xóa người dùng thất bại");
    }
  };

  const handleUpdateUser = async (payload) => {
    try {
      const updated = await adminUserService.updateUser(
        selectedUser.id,
        payload,
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                name: updated.fullName,
                role: updated.role.toLowerCase(),
                status: updated.isActive ? "active" : "inactive",
              }
            : u,
        ),
      );

      notify.success("Cập nhật người dùng thành công");
    } catch (e) {
      notify.error("Cập nhật thất bại");
    }
  };


  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "seller":
        return <TrendingUp className="w-4 h-4" />;
      case "bidder":
        return <ShoppingCart className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-300";
      case "seller":
        return "bg-emerald-500/20 text-emerald-300";
      case "bidder":
        return "bg-blue-500/20 text-blue-300";
      default:
        return "bg-slate-700/50 text-slate-300";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Quản Trị Viên";
      case "seller":
        return "Người Bán";
      case "bidder":
        return "Người Mua";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-cyan-500/20 p-8 border border-slate-700/50 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-blue-600/10"></div>

            <div className="flex items-center justify-between relative z-10">
              {/* Left */}
              <div className="flex items-center gap-4">
                <Users className="w-12 h-12 text-cyan-400" />
                <div>
                  <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2 tracking-tight">
                    Quản Lý Người Dùng
                  </h1>
                  <p className="text-slate-300 font-semibold tracking-wide">
                    Quản lý admin, người bán, người mua
                  </p>
                </div>
              </div>

              {/* Right: Create User Button */}
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105"
              >
                + Tạo người dùng
              </button>
            </div>
          </div>
        </div>


        {/* Search & Filter */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Quản Trị Viên</option>
                <option value="seller">Người Bán</option>
                <option value="bidder">Người Mua</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-black text-white">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-slate-700 rounded-lg transition-all">
                  <MoreVertical className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* User Info */}
              <h3 className="font-bold text-slate-100 mb-1">{user.name}</h3>
              <p className="text-xs text-slate-500 mb-4">{user.email}</p>

              {/* Role & Status */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded ${getRoleColor(
                    user.role,
                  )}`}
                >
                  {getRoleIcon(user.role)}
                  {getRoleLabel(user.role)}
                </span>
                <span
                  className={`inline-flex px-2.5 py-1 text-xs font-bold rounded ${
                    user.status === "active"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-slate-700/50 text-slate-400"
                  }`}
                >
                  {user.status === "active" ? "Hoạt động" : "Không hoạt động"}
                </span>
              </div>

              {/* Contact */}
              <div className="border-t border-slate-700 pt-4 mb-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-4 h-4" />
                  {user.phone}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </div>
              </div>

              {/* Stats */}
              {user.role === "seller" && user.sellerInfo && (
                <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                  <div className="bg-slate-900/50 rounded-lg p-2">
                    <p className="text-xs text-slate-500">Sản phẩm</p>
                    <p className="font-black text-emerald-400">
                      {user.sellerInfo.products}
                    </p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2">
                    <p className="text-xs text-slate-500">Doanh thu</p>
                    <p className="font-black text-emerald-400">
                      {(user.sellerInfo.sales / 1000000).toFixed(0)}M
                    </p>
                  </div>
                </div>
              )}

              {user.role === "bidder" && user.bidderInfo && (
                <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                  <div className="bg-slate-900/50 rounded-lg p-2">
                    <p className="text-xs text-slate-500">Lượt đấu</p>
                    <p className="font-black text-blue-400">
                      {user.bidderInfo.bids}
                    </p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2">
                    <p className="text-xs text-slate-500">Thắng</p>
                    <p className="font-black text-blue-400">
                      {user.bidderInfo.wins}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => handleOpenDetail(user)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
              >
                Xem Chi Tiết
              </button>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-semibold">
              Không tìm thấy người dùng nào
            </p>
          </div>
        )}
      </div>

      <UserDetailModal
        isDetailOpen={isDetailOpen}
        selectedUser={selectedUser}
        setIsDetailOpen={setIsDetailOpen}
        getRoleIcon={getRoleIcon}
        getRoleLabel={getRoleLabel}
        handleDeleteUser={handleDeleteUser}
        onEdit={() => {
          setIsDetailOpen(false);
          setIsEditOpen(true);
        }}
      />

      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateUser}
      />

      <EditUserModal
        isOpen={isEditOpen}
        user={selectedUser}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleUpdateUser}
      />
    </div>
  );
};

export default AdminUserManagement;