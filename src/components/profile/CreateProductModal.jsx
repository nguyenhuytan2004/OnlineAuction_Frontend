import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  X,
  ChevronDown,
  Upload,
  Trash2,
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  AlertCircle,
} from "lucide-react";

import categoryService from "../../services/categoryService";

const CreateProductModal = ({ isOpen, onClose, onSubmit }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [productDescription, setProductDescription] = useState("");
  const [autoRenewal, setAutoRenewal] = useState(false);

  const categoryRef = useRef(null);
  const editorRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      productName: "",
      categoryId: "",
      startingPrice: "",
      stepPrice: "",
      buyNowPrice: "",
      description: "",
      autoRenewal: false,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryTree = await categoryService.getAllCategories();
        setCategories(categoryTree);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSelectCategory = (value) => {
    setSelectedCategory(value);
    setValue("categoryId", value);
    setIsCategoryOpen(false);
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImage({ file, preview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalImages((prev) => [
          ...prev,
          { file, preview: reader.result, id: Date.now() + Math.random() },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveAdditionalImage = (id) => {
    setAdditionalImages((prev) => prev.filter((img) => img.id !== id));
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setProductDescription(editorRef.current.innerHTML);
      setValue("description", editorRef.current.innerHTML);
    }
  };

  const handleClose = () => {
    setSelectedCategory("");
    setIsCategoryOpen(false);
    setMainImage(null);
    setAdditionalImages([]);
    setProductDescription("");
    setAutoRenewal(false);
    reset();
    onClose();
  };

  const onFormSubmit = async (data) => {
    // Validation
    if (!mainImage) {
      alert("Vui lòng chọn ảnh chính");
      return;
    }

    if (additionalImages.length < 3) {
      alert("Vui lòng chọn tối thiểu 3 ảnh phụ");
      return;
    }

    if (!productDescription.trim()) {
      alert("Vui lòng nhập mô tả sản phẩm");
      return;
    }

    const formData = {
      ...data,
      description: productDescription,
      autoRenewal,
      mainImage: mainImage.file,
      additionalImages: additionalImages.map((img) => img.file),
    };

    await onSubmit(formData);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 rounded-3xl shadow-2xl shadow-amber-500/30 border border-slate-700/50 max-w-2xl w-full animate-in fade-in zoom-in-90 duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-600 to-orange-600 rounded-t-3xl p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-white">
                Thêm Sản Phẩm Mới
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="fixed h-[80vh] w-full max-w-2xl z-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-tr-full"></div>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="p-8 space-y-6 max-h-[80vh] overflow-y-auto relative z-10"
        >
          {/* Product Name */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-100 uppercase tracking-wider">
              Tên Sản Phẩm <span className="text-orange-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập tên sản phẩm"
              {...register("productName", {
                required: "Tên sản phẩm là bắt buộc",
                minLength: {
                  value: 5,
                  message: "Tên sản phẩm phải có ít nhất 5 ký tự",
                },
              })}
              className={`w-full bg-slate-800/50 border rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                errors.productName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-600 focus:ring-amber-500"
              }`}
            />
            {errors.productName && (
              <p className="text-xs text-red-400">
                {errors.productName.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-100 uppercase tracking-wider">
              Danh Mục <span className="text-orange-400">*</span>
            </label>
            <div className="relative" ref={categoryRef}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`w-full bg-slate-800/50 border rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 flex items-center justify-between ${
                  errors.categoryId
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-600 focus:ring-amber-500"
                }`}
              >
                <span>
                  {selectedCategory
                    ? categories
                        .flatMap((cat) => cat.children)
                        .find(
                          (subCat) => subCat.categoryId === selectedCategory,
                        )?.categoryName
                    : "-- Chọn danh mục --"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <ul className="absolute top-full left-0 mt-2 w-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-500/30 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {categories.map((option) => {
                    return option.children.map((subOption) => (
                      <li key={subOption.categoryId}>
                        <button
                          type="button"
                          onClick={() =>
                            handleSelectCategory(subOption.categoryId)
                          }
                          className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 group ${
                            selectedCategory === subOption.categoryId
                              ? "bg-gradient-to-r from-amber-600/30 to-orange-600/30 border-l-2 border-amber-500 text-amber-300"
                              : "hover:bg-slate-700/50 text-slate-300 hover:text-slate-100"
                          }`}
                        >
                          {selectedCategory === subOption.categoryId && (
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          )}
                          <span className="font-semibold flex-1">
                            {subOption.categoryName}
                          </span>
                        </button>
                      </li>
                    ));
                  })}
                </ul>
              )}

              <input
                type="hidden"
                {...register("categoryId", {
                  required: "Vui lòng chọn danh mục",
                })}
                value={selectedCategory}
              />
            </div>
            {errors.categoryId && (
              <p className="text-xs text-red-400">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Main Image */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-100 uppercase tracking-wider">
              Ảnh Chính <span className="text-orange-400">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="hidden"
                id="mainImageInput"
              />
              <label
                htmlFor="mainImageInput"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 hover:border-amber-500 transition-all duration-300 cursor-pointer group"
              >
                {mainImage ? (
                  <div className="text-center">
                    <img
                      src={mainImage.preview}
                      alt="Main"
                      className="h-24 w-24 object-cover rounded mx-auto mb-2"
                    />
                    <p className="text-xs text-slate-400">
                      Nhấp để thay đổi ảnh
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-amber-500 transition-colors mx-auto mb-2" />
                    <p className="text-sm text-slate-400">
                      Chọn ảnh chính cho sản phẩm
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Additional Images */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-100 uppercase tracking-wider">
              Ảnh Phụ (Tối thiểu 3 ảnh){" "}
              <span className="text-orange-400">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImageUpload}
                className="hidden"
                id="additionalImagesInput"
              />
              <label
                htmlFor="additionalImagesInput"
                className="flex items-center justify-center w-full h-24 border-2 border-dashed border-slate-600 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 hover:border-amber-500 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-center">
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-amber-500 transition-colors mx-auto mb-1" />
                  <p className="text-xs text-slate-400">
                    Chọn 3 ảnh phụ trở lên
                  </p>
                </div>
              </label>

              {additionalImages.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {additionalImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.preview}
                        alt="Additional"
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAdditionalImage(img.id)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-slate-400 mt-2">
                {additionalImages.length}/3 ảnh tối thiểu
              </p>

              {additionalImages.length < 3 && (
                <div className="mt-2 p-4 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-300">
                    Cần thêm {3 - additionalImages.length} ảnh nữa
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-100 uppercase tracking-wider">
              Thông Tin Giá
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Khởi Điểm (đ) <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="1.000.000"
                  {...register("startingPrice", {
                    required: "Giá khởi điểm là bắt buộc",
                    pattern: {
                      value: /^\d*$/,
                      message: "Phải là số hợp lệ",
                    },
                    validate: (value) =>
                      parseInt(value) >= 1000 || "Phải ≥ 1.000đ",
                  })}
                  className={`w-full bg-slate-800/50 border rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    errors.startingPrice
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-600 focus:ring-amber-500"
                  }`}
                />
                {errors.startingPrice && (
                  <p className="text-xs text-red-400">
                    {errors.startingPrice.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Bước Giá (đ) <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="50.000"
                  {...register("stepPrice", {
                    required: "Bước giá là bắt buộc",
                    pattern: {
                      value: /^\d*$/,
                      message: "Phải là số hợp lệ",
                    },
                    validate: (value) => parseInt(value) > 0 || "Phải > 0đ",
                  })}
                  className={`w-full bg-slate-800/50 border rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    errors.stepPrice
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-600 focus:ring-amber-500"
                  }`}
                />
                {errors.stepPrice && (
                  <p className="text-xs text-red-400">
                    {errors.stepPrice.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Mua Ngay (đ)
                </label>
                <input
                  type="text"
                  placeholder="1.500.000"
                  {...register("buyNowPrice", {
                    pattern: {
                      value: /^\d*$/,
                      message: "Phải là số hợp lệ",
                    },
                    validate: (value) => {
                      if (!value) return true;
                      return (
                        parseInt(value) > parseInt(watch("startingPrice")) ||
                        "Phải > giá khởi điểm"
                      );
                    },
                  })}
                  className={`w-full bg-slate-800/50 border rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    errors.buyNowPrice
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-600 focus:ring-amber-500"
                  }`}
                />
                {errors.buyNowPrice && (
                  <p className="text-xs text-red-400">
                    {errors.buyNowPrice.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* WYSIWYG Description Editor */}
          <div className="">
            <label className="block text-sm font-bold text-slate-100 uppercase tracking-wider mb-2">
              Mô Tả Sản Phẩm <span className="text-orange-400">*</span>
            </label>

            {/* Toolbar */}
            <div className="flex items-center gap-2 p-3 bg-slate-800/50 border border-slate-700 border-b-0 rounded-t-xl flex-wrap">
              <button
                type="button"
                onClick={() => applyFormat("bold")}
                className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-slate-100"
                title="In đậm"
              >
                <Bold className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => applyFormat("italic")}
                className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-slate-100"
                title="In nghiêng"
              >
                <Italic className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => applyFormat("underline")}
                className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-slate-100"
                title="Gạch dưới"
              >
                <Underline className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-slate-700 mx-1"></div>

              <button
                type="button"
                onClick={() => applyFormat("formatBlock", "<h2>")}
                className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-slate-100"
                title="Tiêu đề lớn"
              >
                <Heading2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => applyFormat("formatBlock", "<h3>")}
                className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-slate-100"
                title="Tiêu đề nhỏ"
              >
                <Heading3 className="w-4 h-4" />
              </button>
            </div>

            {/* Editor Area */}
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              className="min-h-[120px] max-h-[150px] overflow-y-auto p-4 bg-slate-800/50 border-2 border-slate-700 rounded-b-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all text-slate-100 outline-none"
              style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
              data-placeholder="Nhập mô tả chi tiết sản phẩm..."
            />
          </div>

          {/* Auto-Renewal Option */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRenewal}
                onChange={(e) => {
                  setAutoRenewal(e.target.checked);
                  setValue("autoRenewal", e.target.checked);
                }}
                className="w-4 h-4 rounded accent-amber-600 cursor-pointer"
              />
              <span className="font-semibold text-slate-100">
                Tự động gia hạn
              </span>
            </label>
            <p className="text-xs text-slate-400 ml-7">
              Nếu bật, sản phẩm sẽ tự động gia hạn thêm 10 phút mỗi khi có lượt
              đấu giá mới trước khi kết thúc 5 phút.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-1" />
            <p className="text-sm text-amber-300 font-semibold">
              Lưu ý: Thông tin bổ sung sẽ được chèn vào cuối mô tả hiện tại,
              không thay thế nội dung cũ.
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-100 font-bold rounded-lg transition-all duration-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105"
            >
              {isSubmitting ? "Đang tạo..." : "Đăng Sản Phẩm Đấu Giá"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
