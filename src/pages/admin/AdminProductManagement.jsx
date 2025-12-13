import React, { useState } from "react";
import {
  Trash2,
  Archive,
  Eye,
  Search,
  Filter,
  AlertTriangle,
  Boxes,
} from "lucide-react";

/**
 * Admin - Product Management
 * Quản lý sản phẩm: deactivate/archive sản phẩm
 */

// Action Modal Component
const ActionModal = ({
  isModalOpen,
  selectedProduct,
  modalAction,
  setIsModalOpen,
  handleConfirmAction,
}) => {
  if (!isModalOpen || !selectedProduct) return null;

  const isArchive = modalAction === "archive";
  const hasAuctions = selectedProduct.auctionCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl w-full max-w-md overflow-hidden border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300">
        <div
          className={`bg-gradient-to-r ${
            isArchive
              ? "from-amber-600 to-orange-600"
              : "from-red-600 to-rose-600"
          } p-6 text-white`}
        >
          <div className="flex items-center gap-3 mb-2">
            {hasAuctions && !isArchive ? (
              <AlertTriangle className="w-6 h-6" />
            ) : isArchive ? (
              <Archive className="w-6 h-6" />
            ) : (
              <Trash2 className="w-6 h-6" />
            )}
            <h2 className="text-xl font-black">
              {isArchive ? "Lưu Trữ Sản Phẩm" : "Xóa Sản Phẩm"}
            </h2>
          </div>
          <p className="text-sm text-white/90">
            {isArchive
              ? "Sản phẩm sẽ được lưu trữ"
              : "Thao tác này không thể hoàn tác"}
          </p>
        </div>

        <div className="p-6">
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-400 mb-2">Sản phẩm</p>
            <p className="font-bold text-slate-100 text-lg">
              {selectedProduct.name}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Người bán: {selectedProduct.sellerName}
            </p>
          </div>

          {hasAuctions && !isArchive && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-red-300 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Không thể xóa
              </p>
              <p className="text-sm text-red-200/80">
                Sản phẩm có {selectedProduct.auctionCount} lượt tham gia đấu
                giá. Vui lòng dùng "Lưu trữ" thay vào đó.
              </p>
            </div>
          )}

          {isArchive && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-amber-300 mb-1">
                Về sản phẩm này
              </p>
              <p className="text-sm text-amber-200/80">
                Sản phẩm sẽ bị ẩn khỏi danh sách công khai nhưng dữ liệu vẫn
                được lưu giữ.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmAction}
              disabled={!isArchive && hasAuctions}
              className={`flex-1 py-2.5 px-4 font-bold rounded-lg transition-all duration-300 ${
                isArchive
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white hover:scale-105"
                  : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {isArchive ? "Lưu Trữ" : "Xóa"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      category: "Điện thoại",
      status: "active",
      sellerName: "Tech Store",
      startPrice: 15000000,
      endTime: "2025-12-20",
      auctionCount: 45,
    },
    {
      id: 2,
      name: "MacBook Pro 16",
      category: "Laptop",
      status: "active",
      sellerName: "Apple Reseller",
      startPrice: 35000000,
      endTime: "2025-12-25",
      auctionCount: 23,
    },
    {
      id: 3,
      name: "iPad Air",
      category: "Máy tính bảng",
      status: "archived",
      sellerName: "Mobile Plus",
      startPrice: 12000000,
      endTime: "2025-12-18",
      auctionCount: 0,
    },
    {
      id: 4,
      name: "AirPods Pro",
      category: "Tai nghe",
      status: "active",
      sellerName: "Audio Store",
      startPrice: 5000000,
      endTime: "2025-12-22",
      auctionCount: 78,
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sellerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleOpenModal = (product, action) => {
    setSelectedProduct(product);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (selectedProduct && modalAction) {
      setProducts(
        products.map((p) =>
          p.id === selectedProduct.id
            ? {
                ...p,
                status: modalAction === "archive" ? "archived" : p.status,
              }
            : p,
        ),
      );
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-purple-500/20 p-8 border border-slate-700/50 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
            <div className="flex items-center gap-4 relative z-10">
              <Boxes className="w-12 h-12 text-purple-400" />
              <div>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 tracking-tight">
                  Quản Lý Sản Phẩm
                </h1>
                <p className="text-slate-300 font-semibold tracking-wide">
                  Kiểm soát, lưu trữ và xóa sản phẩm
                </p>
              </div>
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
                placeholder="Tìm sản phẩm, tên bán hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="archived">Đã lưu trữ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Sản Phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Danh Mục
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Người Bán
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Giá Khởi Động
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Lượt Tham Gia
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
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-100">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          ID: {product.id}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-slate-700 text-slate-300">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {product.sellerName}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-100">
                      {formatCurrency(product.startPrice)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex px-3 py-1 text-sm font-bold rounded-lg bg-blue-500/20 text-blue-300">
                        {product.auctionCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          product.status === "active"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-slate-700/50 text-slate-400"
                        }`}
                      >
                        {product.status === "active" ? "Hoạt động" : "Lưu trữ"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {product.status === "active" && (
                          <>
                            <button
                              onClick={() =>
                                handleOpenModal(product, "archive")
                              }
                              className="p-2 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors"
                              title="Lưu trữ"
                            >
                              <Archive className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleOpenModal(product, "delete")}
                              disabled={product.auctionCount > 0}
                              className="p-2 text-red-400 hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                              title={
                                product.auctionCount > 0
                                  ? "Không thể xóa (có lượt tham gia)"
                                  : "Xóa"
                              }
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {product.status === "archived" && (
                          <span className="text-xs text-slate-500">
                            Không có hành động
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <Eye className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-semibold">
                Không tìm thấy sản phẩm nào
              </p>
            </div>
          )}
        </div>
      </div>

      <ActionModal
        isModalOpen={isModalOpen}
        selectedProduct={selectedProduct}
        modalAction={modalAction}
        setIsModalOpen={setIsModalOpen}
        handleConfirmAction={handleConfirmAction}
      />
    </div>
  );
};

export default AdminProductManagement;
