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
  Link,
} from "lucide-react";

import categoryService from "../../services/categoryService";
import Tooltip from "../common/Tooltip";

const AddAdditionalImageModal = ({ isOpen, onClose, onAdd, existingUrls }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loadError, setLoadError] = useState("");

  const validateAndPreviewUrl = (url) => {
    setImageUrl(url);
    setLoadError("");
    setPreviewImage(null);
    setIsUrlValid(false);

    if (!url.trim()) return;

    setIsValidating(true);
    try {
      new URL(url);
      const img = new Image();
      img.onload = () => {
        setPreviewImage(url);
        setIsUrlValid(true);
        setIsValidating(false);
      };
      img.onerror = () => {
        setLoadError("Không thể tải ảnh từ URL này");
        setIsValidating(false);
      };
      img.src = url;
    } catch {
      setLoadError("URL không hợp lệ");
      setIsValidating(false);
    }
  };

  const handleAddImage = () => {
    if (isUrlValid) {
      onAdd(imageUrl);
      setImageUrl("");
      setPreviewImage(null);
      setIsUrlValid(false);
      setLoadError("");
    }
  };

  const handleClose = () => {
    setImageUrl("");
    setPreviewImage(null);
    setIsUrlValid(false);
    setLoadError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 rounded-2xl shadow-2xl border border-slate-700/50 max-w-md w-full animate-in fade-in zoom-in-90 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-t-2xl p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Thêm Ảnh Phụ</h3>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-100">
              Đường dẫn ảnh (URL)
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => validateAndPreviewUrl(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
          </div>

          {/* Error Message */}
          {loadError && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{loadError}</p>
            </div>
          )}

          {/* Preview */}
          {previewImage && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-300">Xem trước</p>
              <img
                src={previewImage}
                alt="Preview"
                className="w-32 aspect-square object-cover rounded-lg border border-amber-500/30"
              />
            </div>
          )}

          {/* Duplicate Warning */}
          {imageUrl && existingUrls.includes(imageUrl) && !loadError && (
            <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <p className="text-sm text-amber-300">
                Ảnh này đã được thêm trước đó
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-lg transition-all"
            >
              Hủy
            </button>
            <button
              onClick={handleAddImage}
              disabled={!isUrlValid || isValidating}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
            >
              {isValidating ? "Kiểm tra..." : "Thêm Ảnh"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateProductModal = ({ isOpen, onClose, onSubmit }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [mainImageError, setMainImageError] = useState("");
  const [additionalImageUrls, setAdditionalImageUrls] = useState([]);
  const [productDescription, setProductDescription] = useState("");
  const [autoRenewal, setAutoRenewal] = useState(false);
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);

  const categoryRef = useRef(null);
  const editorRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
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

  const handleRemoveAdditionalImage = (indexToRemove) => {
    setAdditionalImageUrls((prev) =>
      prev.filter((url, index) => index !== indexToRemove),
    );
    setValue(
      "additionalImageUrls",
      additionalImageUrls.filter((url, index) => index !== indexToRemove),
    );
  };

  const handleMainImageUrlChange = (e) => {
    const url = e.target.value;
    setMainImageUrl(url);
    setValue("mainImageUrl", url);
    setMainImageError("");

    if (!url.trim()) {
      return;
    }

    try {
      new URL(url);
      const img = new Image();
      img.onload = () => {
        setMainImageUrl(url);
        setValue("mainImageUrl", url);
      };
      img.onerror = () => {
        setMainImageError("Không thể tải ảnh từ URL này");
      };
      img.src = url;
    } catch {
      setMainImageError("URL không hợp lệ");
    }
  };

  const handleAddAdditionalImage = (url) => {
    setAdditionalImageUrls((prev) => [...prev, url]);
    setValue("additionalImageUrls", [...additionalImageUrls, url]);
    setIsAddImageModalOpen(false);
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setProductDescription(editorRef.current.innerHTML);
    }
  };

  const handleClose = () => {
    setSelectedCategory("");
    setIsCategoryOpen(false);
    setMainImageUrl("");
    setMainImageError("");
    setAdditionalImageUrls([]);
    setProductDescription("");
    setAutoRenewal(false);
    setIsAddImageModalOpen(false);
    reset();
    onClose();
  };

  const onFormSubmit = async (data) => {
    const {
      startingPrice,
      stepPrice,
      additionalImageUrls,
      autoRenewal,
      ...rest
    } = data;
    const formData = {
      ...rest,
      categoryId: selectedCategory,
      description: productDescription,
      auxiliaryImageUrls: additionalImageUrls,
      startPrice: startingPrice,
      priceStep: stepPrice,
      isAutoRenew: autoRenewal,
    };

    await onSubmit(formData);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 rounded-3xl shadow-2xl shadow-amber-500/30 border border-slate-700/50 max-w-2xl w-full animate-in fade-in zoom-in-90 duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-600 to-orange-600 rounded-t-3xl p-8 overflow-hidden">
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

        {/* Content */}
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="px-8 pt-8 space-y-6 max-h-[80vh] overflow-y-auto flex flex-col"
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
            </div>
            <input
              className="hidden"
              {...register("categoryId", {
                required: "Vui lòng chọn danh mục",
              })}
            />
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
              <span className="text-xs text-amber-400 ml-2">
                (Tỷ lệ 1:1 được khuyến khích)
              </span>
            </label>

            {!mainImageError && mainImageUrl ? (
              <div className="space-y-2 w-1/4">
                <div className="relative group rounded-lg overflow-hidden border-2 border-amber-500/30 bg-slate-800/50 p-2">
                  <img
                    src={mainImageUrl || null}
                    alt="Main"
                    className="w-full aspect-square object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMainImageUrl("");
                      setValue("mainImageUrl", "");
                    }}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded"
                  >
                    <Trash2 className="w-6 h-6 text-red-400" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 text-center">
                  Nhấp vào ảnh để xóa
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  {...register("mainImageUrl", {
                    required: "Ảnh chính là bắt buộc",
                  })}
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  onChange={handleMainImageUrlChange}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
                {errors.mainImageUrl && (
                  <p className="text-xs text-red-400">
                    {errors.mainImageUrl.message}
                  </p>
                )}
                {mainImageError && (
                  <p className="text-xs text-red-400">{mainImageError}</p>
                )}
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-100 uppercase tracking-wider">
              Ảnh Phụ (Tối thiểu 3 ảnh){" "}
              <span className="text-orange-400">*</span>
              <span className="text-xs text-amber-400 ml-2">
                (Tỷ lệ 1:1 được khuyến khích)
              </span>
            </label>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {additionalImageUrls.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt="Additional"
                    className="w-32 aspect-square object-cover rounded border border-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAdditionalImage(idx)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
              <div className="relative group w-32 aspect-square">
                <button
                  type="button"
                  onClick={() => setIsAddImageModalOpen(true)}
                  className="absolute inset-0 flex justify-center items-center bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-lg hover:border-amber-500 transition-all"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <input
              className="hidden"
              {...register("additionalImageUrls", {
                required: "Cần ít nhất 3 ảnh phụ",
                validate: (value) =>
                  (value && value.length >= 3) || "Cần ít nhất 3 ảnh phụ",
              })}
            />
            {errors.additionalImageUrls && (
              <p className="text-xs text-red-400">
                {errors.additionalImageUrls.message}
              </p>
            )}
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
                    validate: (value) =>
                      parseInt(value) > 0 || "Phải lớn hơn 0đ",
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
                        "Phải lớn hơn giá khởi điểm"
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
                className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-slate-100 group relative"
              >
                <Bold className="w-4 h-4" />
                <Tooltip
                  text="In đậm (Ctrl + B)"
                  position="bottom-full left-1/2 -translate-x-1/2"
                />
              </button>

              <button
                type="button"
                onClick={() => applyFormat("italic")}
                className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-slate-100 group relative"
                title="In nghiêng"
              >
                <Italic className="w-4 h-4" />
                <Tooltip
                  text="In nghiêng (Ctrl + I)"
                  position="bottom-full left-1/2 -translate-x-1/2"
                />
              </button>

              <button
                type="button"
                onClick={() => applyFormat("underline")}
                className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-slate-100 group relative"
                title="Gạch dưới"
              >
                <Underline className="w-4 h-4" />
                <Tooltip
                  text="Gạch dưới (Ctrl + U)"
                  position="bottom-full left-1/2 -translate-x-1/2"
                />
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
            <p className="text-sm text-amber-300 font-semibold">
              Lưu ý: Thông tin bổ sung sẽ được chèn vào cuối mô tả hiện tại,
              không thay thế nội dung cũ.
            </p>
          </div>

          {/* Action */}
          <div className="sticky bottom-0 flex gap-3 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 px-8 py-6 border-t border-slate-700/50 rounded-xl -mx-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-100 font-bold rounded-xl transition-all duration-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105"
            >
              {isSubmitting ? "Đang tạo..." : "Đăng Sản Phẩm"}
            </button>
          </div>
        </form>

        {/* Add Additional Image Modal */}
        <AddAdditionalImageModal
          isOpen={isAddImageModalOpen}
          onClose={() => setIsAddImageModalOpen(false)}
          onAdd={handleAddAdditionalImage}
          existingUrls={mainImageUrl.concat(additionalImageUrls)}
        />
      </div>
    </div>
  );
};

export default CreateProductModal;
