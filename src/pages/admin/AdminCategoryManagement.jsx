import React, { useState } from "react";
import {
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  X,
  Check,
  Package,
} from "lucide-react";

/**
 * Admin - Category Management
 * Quản lý danh mục: tạo, sửa, xem chi tiết, xóa
 */

// Action Modal Component
const ActionModal = ({
  isModalOpen,
  selectedCategory,
  modalAction,
  setIsModalOpen,
  handleConfirmAction,
}) => {
  if (!isModalOpen || !selectedCategory) return null;

  const hasProducts = selectedCategory.productCount > 0;
  const canDelete = !hasProducts;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl w-full max-w-md overflow-hidden border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300">
        <div
          className={`bg-gradient-to-r ${
            modalAction === "delete"
              ? "from-red-600 to-rose-600"
              : "from-amber-600 to-orange-600"
          } p-6 text-white`}
        >
          <div className="flex items-center gap-3 mb-2">
            {modalAction === "delete" ? (
              <Trash2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
            <h2 className="text-xl font-black">
              {modalAction === "delete" ? "Xóa Danh Mục" : "Không Thể Xóa"}
            </h2>
          </div>
          <p className="text-sm text-white/90">
            {hasProducts
              ? "Danh mục này có sản phẩm đang hoạt động"
              : "Thao tác này không thể hoàn tác"}
          </p>
        </div>

        <div className="p-6">
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-400 mb-2">Danh mục</p>
            <p className="font-bold text-slate-100 text-lg">
              {selectedCategory.name}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {selectedCategory.productCount} sản phẩm
            </p>
          </div>

          {hasProducts && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-red-300 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Không thể xóa
              </p>
              <p className="text-sm text-red-200/80">
                Danh mục có {selectedCategory.productCount} sản phẩm đang hoạt
                động. Vui lòng xóa hoặc chuyển tất cả sản phẩm sang danh mục
                khác trước khi xóa danh mục này.
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
              disabled={!canDelete}
              className={`flex-1 py-2.5 px-4 font-bold rounded-lg transition-all duration-300 ${
                canDelete
                  ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white hover:scale-105"
                  : "opacity-50 cursor-not-allowed bg-gradient-to-r from-red-600 to-rose-600 text-white"
              }`}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit/Create Modal Component
const EditModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  editingCategory,
  setEditingCategory,
  handleSaveCategory,
}) => {
  const [categoryName, setCategoryName] = useState(editingCategory?.name || "");
  const [categoryDesc, setCategoryDesc] = useState(
    editingCategory?.description || "",
  );

  const handleSave = () => {
    if (categoryName.trim()) {
      handleSaveCategory({
        ...editingCategory,
        name: categoryName,
        description: categoryDesc,
      });
      setCategoryName("");
      setCategoryDesc("");
      setEditingCategory(null);
      setIsEditModalOpen(false);
    }
  };

  if (!isEditModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl w-full max-w-md overflow-hidden border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Edit className="w-6 h-6" />
            <h2 className="text-xl font-black">
              {editingCategory?.id ? "Sửa Danh Mục" : "Tạo Danh Mục Mới"}
            </h2>
          </div>
          <button
            onClick={() => {
              setIsEditModalOpen(false);
              setEditingCategory(null);
              setCategoryName("");
              setCategoryDesc("");
            }}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Tên Danh Mục <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Nhập tên danh mục..."
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Mô Tả
            </label>
            <textarea
              value={categoryDesc}
              onChange={(e) => setCategoryDesc(e.target.value)}
              placeholder="Nhập mô tả danh mục..."
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none h-24"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingCategory(null);
                setCategoryName("");
                setCategoryDesc("");
              }}
              className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={!categoryName.trim()}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4 inline mr-2" />
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Detail Modal Component
const DetailModal = ({ isDetailOpen, setIsDetailOpen, selectedCategory }) => {
  if (!isDetailOpen || !selectedCategory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl w-full max-w-md overflow-hidden border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6" />
            <h2 className="text-xl font-black">Chi Tiết Danh Mục</h2>
          </div>
          <button
            onClick={() => setIsDetailOpen(false)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-sm text-slate-400 mb-2">Tên Danh Mục</p>
            <p className="text-lg font-black text-slate-100">
              {selectedCategory.name}
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-sm text-slate-400 mb-2">Mô Tả</p>
            <p className="text-sm text-slate-300">
              {selectedCategory.description || "Không có mô tả"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Sản Phẩm</p>
              <p className="text-2xl font-black text-blue-400">
                {selectedCategory.productCount}
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Trạng Thái</p>
              <span className="inline-flex px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-lg">
                {selectedCategory.status === "active"
                  ? "Đang Hoạt Động"
                  : "Không Hoạt Động"}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsDetailOpen(false)}
            className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminCategoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Điện Tử",
      description: "Các sản phẩm điện tử, thiết bị công nghệ",
      productCount: 45,
      status: "active",
      createdDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Quần Áo",
      description: "Thời trang nam nữ, phụ kiện",
      productCount: 78,
      status: "active",
      createdDate: "2024-02-01",
    },
    {
      id: 3,
      name: "Sách & Tạp Chí",
      description: "Sách, tạp chí, báo",
      productCount: 0,
      status: "active",
      createdDate: "2024-03-10",
    },
    {
      id: 4,
      name: "Đồ Gia Dụng",
      description: "Nội thất, đồ dùng nhà bếp",
      productCount: 23,
      status: "active",
      createdDate: "2024-03-20",
    },
    {
      id: 5,
      name: "Thể Thao & Ngoài Trời",
      description: "Dụng cụ thể thao, quần áo thể thao",
      productCount: 0,
      status: "inactive",
      createdDate: "2024-04-05",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = cat.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || cat.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleOpenModal = (category) => {
    setSelectedCategory(category);
    setModalAction("delete");
    setIsModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (selectedCategory) {
      setCategories(categories.filter((c) => c.id !== selectedCategory.id));
      setIsModalOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleOpenEdit = (category = null) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleSaveCategory = (category) => {
    if (category.id) {
      // Update existing
      setCategories(
        categories.map((c) => (c.id === category.id ? category : c)),
      );
    } else {
      // Create new
      const newCategory = {
        ...category,
        id: Math.max(...categories.map((c) => c.id), 0) + 1,
        productCount: 0,
        status: "active",
        createdDate: new Date().toISOString().split("T")[0],
      };
      setCategories([...categories, newCategory]);
    }
  };

  const handleOpenDetail = (category) => {
    setSelectedCategory(category);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-purple-500/20 p-8 border border-slate-700/50 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <Package className="w-12 h-12 text-purple-500" />
                <div>
                  <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-400 mb-2 tracking-tight">
                    Quản Lý Danh Mục
                  </h1>
                  <p className="text-slate-300 font-semibold tracking-wide">
                    Tạo, sửa, xem chi tiết danh mục sản phẩm
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleOpenEdit(null)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-5 h-5" />
                Tạo Danh Mục
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer appearance-none"
            >
              <option value="all">Tất Cả Trạng Thái</option>
              <option value="active">Đang Hoạt Động</option>
              <option value="inactive">Không Hoạt Động</option>
            </select>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Danh Mục
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Mô Tả
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Sản Phẩm
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-100">
                        {category.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(category.createdDate).toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-400">
                        {category.description.length > 50
                          ? category.description.substring(0, 50) + "..."
                          : category.description}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20 text-blue-300 font-bold">
                        {category.productCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold ${
                          category.status === "active"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-slate-700/50 text-slate-400"
                        }`}
                      >
                        {category.status === "active"
                          ? "Đang Hoạt Động"
                          : "Không Hoạt Động"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenDetail(category)}
                          className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(category)}
                          className="p-2 rounded-lg hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 transition-colors"
                          title="Sửa"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(category)}
                          disabled={category.productCount > 0}
                          className={`p-2 rounded-lg transition-colors ${
                            category.productCount > 0
                              ? "text-red-600/50 cursor-not-allowed"
                              : "hover:bg-red-500/20 text-red-400 hover:text-red-300"
                          }`}
                          title={
                            category.productCount > 0
                              ? "Không thể xóa: danh mục có sản phẩm"
                              : "Xóa"
                          }
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <Eye className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-semibold">
                Không tìm thấy danh mục nào
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
            <p className="text-slate-400 text-sm font-semibold mb-2">
              Tổng Danh Mục
            </p>
            <p className="text-3xl font-black text-blue-400">
              {categories.length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
            <p className="text-slate-400 text-sm font-semibold mb-2">
              Đang Hoạt Động
            </p>
            <p className="text-3xl font-black text-emerald-400">
              {categories.filter((c) => c.status === "active").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
            <p className="text-slate-400 text-sm font-semibold mb-2">
              Tổng Sản Phẩm
            </p>
            <p className="text-3xl font-black text-purple-400">
              {categories.reduce((sum, c) => sum + c.productCount, 0)}
            </p>
          </div>
        </div>
      </div>

      <ActionModal
        isModalOpen={isModalOpen}
        selectedCategory={selectedCategory}
        modalAction={modalAction}
        setIsModalOpen={setIsModalOpen}
        handleConfirmAction={handleConfirmAction}
      />

      <EditModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editingCategory={editingCategory}
        setEditingCategory={setEditingCategory}
        handleSaveCategory={handleSaveCategory}
        categories={categories}
      />

      <DetailModal
        isDetailOpen={isDetailOpen}
        setIsDetailOpen={setIsDetailOpen}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default AdminCategoryManagement;
