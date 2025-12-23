import React, { useEffect, useState } from "react";
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
  ChevronDown,
  ChevronRight,
  PackageOpen,
  ChevronUp,
} from "lucide-react";
import { useForm } from "react-hook-form";
import categoryService from "../../services/categoryService";
import productService from "../../services/productService";
import CustomDropdown from "../../components/common/CustomDropdown";
import Tooltip from "../../components/common/Tooltip";
import { notify } from "../../utils/toast";
import { Toaster } from "react-hot-toast";
import BackgroundDecoration from "../../components/common/BackgroundDecoration";

const DetailModal = ({ isDetailOpen, setIsDetailOpen, selectedCategory }) => {
  if (!isDetailOpen || !selectedCategory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl w-full max-w-md overflow-hidden border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3 p-2">
            <h2 className="text-xl font-black">Chi Tiết Danh Mục</h2>
          </div>
        </div>

        <div className="p-6 space-y-4 relative">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-600/20 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-tr-full"></div>

          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-sm text-slate-400 mb-2">Tên Danh Mục</p>
            <p className="text-lg font-black text-slate-400">
              {selectedCategory.categoryName}
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
              <p className="text-2xl font-black text-blue-400 ml-2">
                {selectedCategory.productCount}
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Trạng Thái</p>
              <span className="inline-flex px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-lg">
                Đang hoạt động
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsDetailOpen(false)}
            className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg transition-colors relative z-10"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateModal = ({
  isCreateModalOpen,
  setIsCreateModalOpen,
  categories,
  handleCreateCategory,
}) => {
  const [parentCategoryId, setParentCategoryId] = useState(null);
  const [parentCategoryIndex, setParentCategoryIndex] = useState(null);

  const {
    register,
    handleSubmit: checkOnSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (isCreateModalOpen) {
      reset({
        categoryName: "",
        description: "",
        parentCategoryId: null,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setParentCategoryId(null);
      setParentCategoryIndex(null);
    }
  }, [isCreateModalOpen, reset]);

  const parentCategoryOptions = categories.map((cat) => cat.categoryName);

  const handleSelectCategory = (index) => {
    setParentCategoryIndex(index);
    const selectedParentCategory = categories[index];
    setParentCategoryId(selectedParentCategory.categoryId);
    setValue("parentCategoryId", selectedParentCategory.categoryId);
  };

  const onSubmit = async (data) => {
    try {
      await handleCreateCategory({
        categoryName: data.categoryName,
        description: data.description,
        parentCategoryId: data.parentCategoryId || null,
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleClose = () => {
    setIsCreateModalOpen(false);
    setParentCategoryId(null);
    setParentCategoryIndex(null);
    reset();
  };

  if (!isCreateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl w-full max-w-md overflow-hidden border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3 p-2">
            <h2 className="text-xl font-black">Tạo Danh Mục Mới</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={checkOnSubmit(onSubmit)} className="p-6 relative">
          <BackgroundDecoration accentColor="green" />
          {/* Danh Mục Cha */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Danh Mục Cha
            </label>
            <CustomDropdown
              options={parentCategoryOptions}
              selectedIndex={parentCategoryIndex}
              onSelect={handleSelectCategory}
              placeholder="-- Chọn danh mục --"
              accentColor="green"
            />
            {/* Hidden input for parentCategoryId */}
            <input
              type="hidden"
              {...register("parentCategoryId")}
              value={parentCategoryId ? parentCategoryId : ""}
            />
          </div>

          {/* Tên Danh Mục */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Tên Danh Mục <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register("categoryName", {
                required: "Tên danh mục không được để trống",
                minLength: {
                  value: 2,
                  message: "Tên danh mục phải có ít nhất 2 ký tự",
                },
              })}
              placeholder="Nhập tên danh mục..."
              className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all ${
                errors.categoryName
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-600 focus:border-emerald-500"
              }`}
            />
            {errors.categoryName && (
              <p className="text-red-400 text-xs mt-1">
                {errors.categoryName.message}
              </p>
            )}
          </div>

          {/* Mô Tả */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Mô Tả
            </label>
            <textarea
              {...register("description")}
              placeholder="Nhập mô tả danh mục..."
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none h-24"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang tạo..." : "Tạo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  selectedCategory,
  categories,
  handleUpdateCategory,
}) => {
  const [parentCategoryId, setParentCategoryId] = useState(null);
  const [parenCategoryIndex, setParentCategoryIndex] = useState(null);

  const {
    register,
    handleSubmit: checkOnSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (isEditModalOpen && selectedCategory) {
      reset({
        categoryName: selectedCategory.categoryName || "",
        description: selectedCategory.description || "",
        parentCategoryId: selectedCategory.parentCategoryId || null,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setParentCategoryId(selectedCategory?.parent?.categoryId);
      setParentCategoryIndex(
        categories.findIndex(
          (cat) => cat.categoryId === selectedCategory?.parent?.categoryId,
        ),
      );
      setValue("parentCategoryId", selectedCategory?.parent?.categoryId);
    }
  }, [isEditModalOpen, selectedCategory, reset, categories, setValue]);

  const parentCategoryOptions = categories
    .filter((cat) => cat.categoryId !== selectedCategory?.categoryId)
    .map((cat) => cat.categoryName);

  const handleSelectCategory = (index) => {
    setParentCategoryIndex(index);
    const selectedParentCategory = categories[index];
    setParentCategoryId(selectedParentCategory.categoryId);
    setValue("parentCategoryId", selectedParentCategory.categoryId);
  };

  const onSubmit = async (data) => {
    try {
      await handleUpdateCategory({
        categoryId: selectedCategory.categoryId,
        categoryName: data.categoryName,
        description: data.description,
        parentCategoryId: data.parentCategoryId,
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleClose = () => {
    setIsEditModalOpen(false);
    reset();
  };

  if (!isEditModalOpen || !selectedCategory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl w-full max-w-md overflow-hidden border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3 p-2">
            <h2 className="text-xl font-black">Sửa Danh Mục</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={checkOnSubmit(onSubmit)} className="p-6 relative">
          <BackgroundDecoration accentColor="purple" />
          {/* Danh Mục Cha */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Danh Mục Cha (tùy chọn)
            </label>
            <CustomDropdown
              options={parentCategoryOptions}
              selectedIndex={parenCategoryIndex}
              onSelect={handleSelectCategory}
              accentColor="purple"
              error={!!errors.parentCategoryId}
            />
            {/* Hidden input for parentCategoryId */}
            <input
              type="hidden"
              {...register("parentCategoryId")}
              value={parentCategoryId ? parentCategoryId : ""}
            />
          </div>

          {/* Tên Danh Mục */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Tên Danh Mục <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register("categoryName", {
                required: "Tên danh mục không được để trống",
                minLength: {
                  value: 2,
                  message: "Tên danh mục phải có ít nhất 2 ký tự",
                },
              })}
              placeholder="Nhập tên danh mục..."
              className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all ${
                errors.categoryName
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-600 focus:border-indigo-500"
              }`}
            />
            {errors.categoryName && (
              <p className="text-red-400 text-xs mt-1">
                {errors.categoryName.message}
              </p>
            )}
          </div>

          {/* Mô Tả */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Mô Tả
            </label>
            <textarea
              {...register("description")}
              placeholder="Nhập mô tả danh mục..."
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none h-24"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteModal = ({
  isModalOpen,
  selectedCategory,
  setIsModalOpen,
  handleDeleteCategory,
}) => {
  if (!isModalOpen || !selectedCategory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl w-full max-w-md overflow-hidden border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300">
        <div
          className={`bg-gradient-to-r from-red-600 to-rose-600 p-6 text-white`}
        >
          <div className="flex items-center gap-3 p-2">
            <h2 className="text-xl font-black">Xóa Danh Mục</h2>
          </div>
        </div>

        <div className="p-6 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-red-500/20 to-transparent rounded-tr-full"></div>
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-400 mb-2">Danh mục</p>
            <p className="font-bold text-slate-400 text-lg">
              {selectedCategory.categoryName}
            </p>
          </div>

          {/* Cảnh báo */}
          <div className="mb-6 p-5 bg-red-500/10 border-2 border-red-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <p className="text-sm text-red-400">
                Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể
                hoàn tác.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg transition-colors relative z-10"
            >
              Hủy
            </button>
            <button
              onClick={handleDeleteCategory}
              className={`flex-1 py-2.5 px-4 font-bold rounded-lg transition-all duration-300 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white hover:scale-105"`}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminCategoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryTree = await categoryService.getAllCategories();

        await Promise.all(
          categoryTree.map(async (cat) => {
            if (cat.children && cat.children.length > 0) {
              await Promise.all(
                cat.children.map(async (child) => {
                  const productPage =
                    await productService.getProductsByCategoryId(
                      child.categoryId,
                    );
                  child.productCount = productPage.content.length;
                }),
              );
            } else {
              const productPage = await productService.getProductsByCategoryId(
                cat.categoryId,
              );
              cat.productCount = productPage.content.length;
            }
          }),
        );

        console.log("Fetched Categories:", categoryTree);
        setCategories(categoryTree);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories
    .map((cat) => {
      const matchesSearch = cat.categoryName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const filteredChildren =
        cat.children &&
        cat.children.filter((child) =>
          child.categoryName.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      if (matchesSearch || (filteredChildren && filteredChildren.length > 0)) {
        return {
          ...cat,
          children: filteredChildren || [],
        };
      }

      return null;
    })
    .filter(Boolean);

  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      try {
        await categoryService.deleteCategory(selectedCategory.categoryId);
        setCategories(
          categories.filter(
            (cat) => cat.categoryId !== selectedCategory.categoryId,
          ),
        );
        setIsDeleteModalOpen(false);
        setSelectedCategory(null);
        if (!selectedCategory.parent) {
          setCategories(
            categories.filter(
              (cat) => cat.categoryId !== selectedCategory.categoryId,
            ),
          );
        } else {
          setCategories(
            categories.map((cat) => ({
              ...cat,
              children: cat.children.filter(
                (child) => child.categoryId !== selectedCategory.categoryId,
              ),
            })),
          );
        }
        notify.success("Xóa danh mục thành công");
      } catch (error) {
        console.error("Error deleting category:", error);
        notify.error("Xóa danh mục thất bại. Vui lòng thử lại.");
      }
    }
  };

  const handleUpdateCategory = async (updateCategory) => {
    try {
      const updatedCategory = await categoryService.updateCategory(
        updateCategory.categoryId,
        {
          categoryName: updateCategory.categoryName,
          description: updateCategory.description,
          parentCategoryId: updateCategory.parentCategoryId,
        },
      );
      updatedCategory.children = selectedCategory.children;
      updatedCategory.productCount = selectedCategory.productCount;

      setCategories((prevCategories) => {
        // Nếu danh mục có danh mục cha
        if (selectedCategory.parent) {
          // Nếu thay đổi danh mục cha
          if (
            selectedCategory.parent.categoryId !==
            updatedCategory.parentCategoryId
          ) {
            // Xóa khỏi danh mục cha cũ
            let newCategories = prevCategories.map((cat) => ({
              ...cat,
              children: cat.children.filter(
                (child) => child.categoryId !== updatedCategory.categoryId,
              ),
            }));
            // Thêm vào danh mục cha mới
            newCategories = newCategories.map((cat) => {
              if (cat.categoryId === updatedCategory.parent.categoryId) {
                return {
                  ...cat,
                  children: [...cat.children, updatedCategory],
                };
              }
              return cat;
            });
            return newCategories;
          }
          // Nếu không thay đổi danh mục cha
          else {
            return prevCategories.map((cat) => {
              if (cat.categoryId === selectedCategory.parent.categoryId) {
                return {
                  ...cat,
                  children: cat.children.map((child) =>
                    child.categoryId === updatedCategory.categoryId
                      ? updatedCategory
                      : child,
                  ),
                };
              }
              return cat;
            });
          }
        }
        // Nếu danh mục không có danh mục cha
        else {
          // Trở thành danh mục con của danh mục khác
          if (updatedCategory.parent) {
            return prevCategories
              .filter((cat) => cat.categoryId !== updatedCategory.categoryId)
              .map((cat) => {
                if (cat.categoryId === updatedCategory.parent.categoryId) {
                  return {
                    ...cat,
                    children: [...cat.children, updatedCategory],
                  };
                }
                return cat;
              });
          }
          // Vẫn là danh mục cha
          else {
            return prevCategories.map((cat) =>
              cat.categoryId === updatedCategory.categoryId
                ? updatedCategory
                : cat,
            );
          }
        }
      });

      setIsEditModalOpen(false);
      setSelectedCategory(null);
      notify.success("Cập nhật danh mục thành công");
    } catch (error) {
      console.error("Error updating category:", error);
      notify.error("Cập nhật danh mục thất bại. Vui lòng thử lại.");
    }
  };

  const handleCreateCategory = async (newCategory) => {
    try {
      const createdCategory = await categoryService.createCategory({
        categoryName: newCategory.categoryName,
        description: newCategory.description,
        parentCategoryId: newCategory.parentCategoryId || null,
      });
      createdCategory.children = [];
      createdCategory.productCount = 0;

      setCategories((prevCategories) => {
        if (newCategory.parentCategoryId) {
          return prevCategories.map((cat) => {
            if (cat.categoryId === newCategory.parentCategoryId) {
              return {
                ...cat,
                children: [...cat.children, createdCategory],
              };
            }
            return cat;
          });
        } else {
          return [...prevCategories, createdCategory];
        }
      });

      setIsCreateModalOpen(false);
      notify.success("Tạo danh mục thành công");
    } catch (error) {
      console.error("Error creating category:", error);
      notify.error("Tạo danh mục thất bại. Vui lòng thử lại.");
      throw error;
    }
  };

  const toggleExpanded = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Recursive component to render category tree
  const CategoryTreeNode = ({ category, level = 0 }) => {
    const isExpanded = expandedCategories[category.categoryId];
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={category.categoryId}>
        {/* Parent Category */}
        <div
          className={`flex items-center gap-3 px-6 py-4 border-b border-slate-700/30 hover:bg-slate-700/20 transition-all duration-200 ${
            level === 0 ? "" : ""
          }`}
          style={{ paddingLeft: `${24 + level * 48}px` }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(category.categoryId)}
              className="flex-shrink-0 p-1 hover:bg-slate-600/50 rounded-lg transition-all duration-200 group"
            >
              <ChevronDown
                className={`w-5 h-5 text-amber-400 transition-transform duration-300 ${
                  isExpanded ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>
          ) : (
            <div className="w-6"></div>
          )}

          {/* Package Icon - Smooth transition between opened/closed */}
          <div className="relative flex-shrink-0 w-5 h-5">
            {isExpanded && hasChildren ? (
              <PackageOpen className="w-5 h-5 text-amber-400" />
            ) : (
              <Package className="w-5 h-5 text-slate-500" />
            )}
          </div>

          {/* Category Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <p className="font-semibold text-slate-100 truncate">
                {category.categoryName}
              </p>
              {category.children.length === 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-900/30 text-amber-300 border border-amber-500/30">
                  {category.productCount} sản phẩm
                </span>
              )}
            </div>
            {category.description && (
              <p className="text-xs text-slate-500 truncate">
                {category.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <button
              onClick={() => {
                setSelectedCategory(category);
                setIsDetailOpen(true);
              }}
              className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-colors hover:scale-110 duration-200"
              title="Xem chi tiết"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setSelectedCategory(category);
                setIsEditModalOpen(true);
              }}
              className="p-2 rounded-lg hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 transition-colors hover:scale-110 duration-200"
              title="Sửa"
            >
              <Edit className="w-5 h-5" />
            </button>
            {category.children.length > 0 ? (
              <button
                disabled
                className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors hover:scale-110 duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative group"
              >
                <Trash2 className="w-5 h-5 " />
                <Tooltip
                  text="Không thể xóa danh mục có danh mục con"
                  position="right-1/2 bottom-1/4 mb-2"
                />
              </button>
            ) : category.productCount > 0 ? (
              <button
                disabled
                className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors hover:scale-110 duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative group"
              >
                <Trash2 className="w-5 h-5 " />
                <Tooltip
                  text="Không thể xóa danh mục có sản phẩm"
                  position="right-1/2 bottom-1/4 mb-2"
                />
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedCategory(category);
                  setIsDeleteModalOpen(true);
                }}
                className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors hover:scale-110 duration-200 relative group"
              >
                <Trash2 className="w-5 h-5 " />
                <Tooltip
                  text="Xóa danh mục"
                  position="right-1/2 bottom-1/3 mb-2"
                />
              </button>
            )}
          </div>
        </div>

        {/* Children Categories */}
        {hasChildren && (
          <div
            className={`border-l-2 border-slate-700/30 overflow-hidden
            }`}
            style={{
              maxHeight: isExpanded ? "1000px" : "0px",
            }}
          >
            {category.children.map((child) => (
              <CategoryTreeNode
                key={child.categoryId}
                category={child}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Toaster position="top-right" />
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
                      Xem chi tiết, sửa, xóa danh mục sản phẩm
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-lg shadow-emerald-500/30"
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
                className="w-1/3 pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Categories Table */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <div className="w-full">
                {/* Tree Header */}
                <div className="bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 border-b border-slate-700 px-6 py-4 sticky top-0">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                      Danh Mục (Phân Cấp)
                    </p>
                    <span className="ml-auto text-xs text-slate-500">
                      {categories.length} danh mục chính
                    </span>
                  </div>
                </div>

                {/* Tree Content */}
                <div className="divide-y divide-slate-700/30">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <CategoryTreeNode
                        key={category.categoryId}
                        category={category}
                        level={0}
                      />
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 font-semibold">
                        Không tìm thấy danh mục nào
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DeleteModal
          isModalOpen={isDeleteModalOpen}
          selectedCategory={selectedCategory}
          setIsModalOpen={setIsDeleteModalOpen}
          handleDeleteCategory={handleDeleteCategory}
        />

        <CreateModal
          isCreateModalOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
          categories={categories}
          handleCreateCategory={handleCreateCategory}
        />

        <EditModal
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          selectedCategory={selectedCategory}
          categories={categories}
          handleUpdateCategory={handleUpdateCategory}
        />

        <DetailModal
          isDetailOpen={isDetailOpen}
          setIsDetailOpen={setIsDetailOpen}
          selectedCategory={selectedCategory}
        />
      </div>
    </>
  );
};

export default AdminCategoryManagement;
