import React, { useEffect, useMemo, useState } from "react";
import { ROUTES } from "../../constants/routes";
import { Link } from "react-router-dom";
import {
  Trash2,
  Archive,
  Eye,
  Search,
  Filter,
  AlertTriangle,
  Boxes,
  ChevronLeft,
  ChevronRight,
  LinkIcon,
  StopCircle,
  PlayCircle,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import productService from "../../services/productService";

import CustomDropdown from "../../components/common/CustomDropdown";
import Tooltip from "../../components/common/Tooltip";

import formatters from "../../utils/formatters";
import { notify } from "../../utils/toast";
import BackgroundDecoration from "../../components/common/BackgroundDecoration";

const StopModal = ({
  isModalOpen,
  selectedProduct,
  setIsModalOpen,
  handleStopProduct,
}) => {
  if (!isModalOpen || !selectedProduct) return null;

  const hasAuctions = selectedProduct.bidCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl w-full max-w-md overflow-hidden border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300">
        <div
          className={`bg-gradient-to-r from-red-600 to-rose-600 p-6 text-white`}
        >
          <div className="flex items-center gap-3 p-2">
            <h2 className="text-xl font-black">Dừng Hoạt Động Sản Phẩm</h2>
          </div>
        </div>

        <div className="p-6 relative">
          <BackgroundDecoration accentColor="red" />
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-400 mb-2">Sản phẩm</p>
            <p className="font-semibold text-slate-100 text-lg">
              {selectedProduct.productName}
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Danh mục: {selectedProduct.category.categoryName}
            </p>
          </div>

          {hasAuctions && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-200/80">
                Sản phẩm có {selectedProduct.bidCount} lượt tham gia đấu giá.
                Cân nhắc việc dừng hoạt động sản phẩm này.
              </p>
            </div>
          )}

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-200/80">
              Sản phẩm sẽ bị ẩn khỏi danh sách công khai nhưng dữ liệu vẫn được
              lưu giữ.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleStopProduct}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
            >
              Dừng Hoạt Động
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailModal = ({ isOpen, product, onClose }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950 rounded-3xl w-full max-w-2xl border border-slate-700/50 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-sky-600 py-8 px-10 text-white relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black">Chi Tiết Sản Phẩm</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-3 transition-all duration-300 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-10 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Product Title and Category */}
          <div>
            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
              {product.productName}
            </h3>
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 font-semibold text-sm">
                {product.category.categoryName}
              </span>
              <span
                className={`px-4 py-2 rounded-full font-semibold text-sm ${
                  product.isActive
                    ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                    : "bg-red-500/20 border border-red-500/30 text-red-300"
                }`}
              >
                {product.isActive ? "Hoạt Động" : "Dừng Hoạt Động"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-6">
            <h4 className="text-lg font-bold text-slate-100 mb-3">
              Mô Tả Sản Phẩm
            </h4>
            <p className="text-slate-300 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-5 hover:border-blue-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <p className="text-xs text-blue-400 font-semibold mb-2 uppercase tracking-wide">
                Giá Khởi Động
              </p>
              <p className="text-xl font-black text-orange-300">
                {formatters.formatCurrency(product.startPrice)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-5 hover:border-blue-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <p className="text-xs text-blue-400 font-semibold mb-2 uppercase tracking-wide">
                Giá Hiện Tại
              </p>
              <p className="text-xl font-black text-cyan-300">
                {formatters.formatCurrency(product.currentPrice)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-5 hover:border-blue-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <p className="text-xs text-blue-400 font-semibold mb-2 uppercase tracking-wide">
                Mua Ngay
              </p>
              <p className="text-xl font-black text-green-300">
                {formatters.formatCurrency(product.buyNowPrice) || "Không có"}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-5 hover:border-blue-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <p className="text-xs text-blue-400 font-semibold mb-2 uppercase tracking-wide">
                Bước Giá
              </p>
              <p className="text-xl font-black text-purple-300">
                {formatters.formatCurrency(product.priceStep)}
              </p>
            </div>
          </div>

          {/* Auction & Bidding Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-5">
              <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wide">
                Lượt Tham Gia
              </p>
              <p className="text-2xl font-black text-indigo-400">
                {product.bidCount}
              </p>
            </div>
            <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-5">
              <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wide">
                Người Thắng Giá
              </p>
              <p className="text-sm font-bold text-slate-200">
                {product.highestBidder?.fullName || "Chưa có"}
              </p>
            </div>
            <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-5">
              <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wide">
                Tự Động Gia Hạn
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full font-bold text-xs ${
                  product.isAutoRenew
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-slate-700/50 text-slate-400"
                }`}
              >
                {product.isAutoRenew ? "Có" : "Không"}
              </span>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-700/40 rounded-xl border border-slate-700/50 p-6">
            <h4 className="text-lg font-bold text-slate-100 mb-4">
              Thông Tin Người Bán
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 font-semibold mb-2">
                  Tên Người Bán
                </p>
                <p className="text-slate-200 font-semibold">
                  {product.seller.fullName}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold mb-2">
                  Email
                </p>
                <p className="text-slate-200 font-semibold text-sm">
                  {product.seller.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-20 mt-4 pt-4 mr-16 border-t border-slate-700/50">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                <p className="text-xs text-yellow-400 font-semibold mb-2 uppercase">
                  Điểm Đánh Giá
                </p>
                <p className="text-2xl font-black text-yellow-300">
                  {product.seller.ratingScore}
                </p>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 text-center">
                <p className="text-xs text-cyan-400 font-semibold mb-2 uppercase">
                  Số Lần Đánh Giá
                </p>
                <p className="text-2xl font-black text-cyan-300">
                  {product.seller.ratingCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 font-semibold">
                  Cho Phép Bidder Chưa Đánh Giá
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Cho phép những người dùng chưa có đánh giá tham gia đấu giá
                </p>
              </div>
              {product.allowUnratedBidder ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-400" />
              )}
            </div>
          </div>

          {/* Start Time & End Time */}
          <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 rounded-xl border border-slate-700/50 p-6 flex justify-around">
            <div className="flex flex-col items-center">
              <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wide">
                Thời Gian Tạo
              </p>
              <p className="text-lg font-bold text-slate-100">
                {formatters.formatDate(product.createdAt)}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wide">
                Thời Gian Kết Thúc
              </p>
              <p className="text-lg font-bold text-slate-100">
                {formatters.formatDate(product.endTime)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterStatusIndex, setFilterStatusIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const queryParams = {
          status:
            filterStatus === "Tất cả"
              ? "all"
              : filterStatus === "Hoạt động"
                ? "active"
                : "inactive",
          page: currentPage - 1,
          size: 5,
        };
        const productPage = await productService.getProducts(queryParams);
        const products = productPage.content;
        setProducts(products);
        setTotalPages(productPage.totalPages || 1);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, filterStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isActive = product.isActive;
    const matchesStatus =
      filterStatus === "Tất cả" ||
      (filterStatus === "Hoạt động" && isActive) ||
      (filterStatus === "Dừng hoạt động" && !isActive);
    return matchesSearch && matchesStatus;
  });

  const handleStopProduct = async () => {
    if (selectedProduct) {
      try {
        const updateData = {
          categoryId: selectedProduct.category.categoryId,
          productName: selectedProduct.productName,
          description: selectedProduct.description,
          currentPrice: selectedProduct.currentPrice,
          startPrice: selectedProduct.startPrice,
          priceStep: selectedProduct.priceStep,
          buyNowPrice: selectedProduct.buyNowPrice,
          endTime: selectedProduct.endTime,
          isAutoRenew: selectedProduct.isAutoRenew,
          allowUnratedBidder: selectedProduct.allowUnratedBidder,
          mainImageUrl: selectedProduct.mainImageUrl,
          isActive: false,
        };
        const updatedProduct = await productService.updateProduct(
          selectedProduct.productId,
          updateData,
        );
        setProducts((prevProducts) =>
          prevProducts.map((prod) =>
            prod.productId === updatedProduct.productId
              ? { ...prod, ...updatedProduct }
              : prod,
          ),
        );
        notify.success("Sản phẩm đã bị dừng hoạt động.");
      } catch (error) {
        console.error("Error stopping product:", error);
        notify.error(
          "Đã xảy ra lỗi khi dừng hoạt động sản phẩm. Vui lòng thử lại.",
        );
      }
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleReactivateProduct = async (product) => {
    try {
      const updateData = {
        categoryId: product.category.categoryId,
        productName: product.productName,
        description: product.description,
        currentPrice: product.currentPrice,
        startPrice: product.startPrice,
        priceStep: product.priceStep,
        buyNowPrice: product.buyNowPrice,
        endTime: product.endTime,
        isAutoRenew: product.isAutoRenew,
        allowUnratedBidder: product.allowUnratedBidder,
        mainImageUrl: product.mainImageUrl,
        isActive: true,
      };
      const updatedProduct = await productService.updateProduct(
        product.productId,
        updateData,
      );
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod.productId === updatedProduct.productId
            ? { ...prod, ...updatedProduct }
            : prod,
        ),
      );
      notify.success("Sản phẩm đã được tái hoạt động.");
    } catch (error) {
      console.error("Error reactivating product:", error);
      notify.error(
        "Đã xảy ra lỗi khi tái hoạt động sản phẩm. Vui lòng thử lại.",
      );
    }
  };

  const filterStatusOptions = useMemo(
    () => ["Tất cả", "Hoạt động", "Dừng hoạt động"],
    [],
  );

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
              <div className="w-full">
                <CustomDropdown
                  options={filterStatusOptions}
                  selectedIndex={filterStatusIndex}
                  onSelect={(index) =>
                    setFilterStatus(filterStatusOptions[index]) ||
                    setFilterStatusIndex(index)
                  }
                  accentColor="purple"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-12 h-12 border-4 border-t-4 border-slate-600 border-t-cyan-500 rounded-full animate-spin"></div>
              </div>
            ) : (
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
                  {filteredProducts.map((product) => {
                    return (
                      <tr
                        key={product.productId}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.mainImageUrl || null}
                              alt={product.productName}
                              className="w-12 h-12 object-cover rounded-lg border border-slate-600"
                            />
                            <div className="max-w-xs">
                              <Link
                                target="_blank"
                                to={`${ROUTES.PRODUCT}/${product.productId}`}
                                className="flex"
                              >
                                <p className="font-bold text-slate-100 truncate hover:underline hover:scale-105 transition-all duration-300">
                                  {product.productName}
                                </p>
                                <LinkIcon className="w-4 h-4 ml-1 text-slate-500 mt-1" />
                              </Link>
                              <p className="text-xs text-slate-500">
                                ID: {product.productId}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-slate-700 text-slate-300">
                            {product.category.categoryName}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-100">
                          {formatters.formatCurrency(product.currentPrice)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex px-3 py-1 text-sm font-bold rounded-lg bg-blue-500/20 text-blue-300">
                            {product.bidCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                              product.isActive
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-slate-700/50 text-slate-400"
                            }`}
                          >
                            {product.isActive
                              ? "Hoạt động"
                              : new Date(product.endTime) > new Date()
                                ? "Dừng hoạt động"
                                : "Đã kết thúc"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsDetailModalOpen(true);
                              }}
                              className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-colors hover:scale-110 duration-200"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            {product.isActive ? (
                              <div className="group relative">
                                <button
                                  onClick={() =>
                                    setSelectedProduct(product) ||
                                    setIsModalOpen(true)
                                  }
                                  className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                                >
                                  <StopCircle className="w-5 h-5" />
                                </button>
                                <Tooltip
                                  text="Dừng hoạt động"
                                  position="right-full bottom-1/2"
                                />
                              </div>
                            ) : new Date(product.endTime) > new Date() ? (
                              <div className="group relative">
                                <button
                                  onClick={() =>
                                    handleReactivateProduct(product)
                                  }
                                  className="p-2 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors"
                                >
                                  <PlayCircle className="w-5 h-5" />
                                </button>
                                <Tooltip
                                  text="Tái hoạt động"
                                  position="right-full bottom-1/2"
                                />
                              </div>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <Eye className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-semibold">
                Không tìm thấy sản phẩm nào
              </p>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="bg-slate-800/30 border-t border-slate-700/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  Trang{" "}
                  <span className="font-bold text-slate-200">
                    {currentPage}
                  </span>{" "}
                  trên{" "}
                  <span className="font-bold text-slate-200">{totalPages}</span>
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

      <StopModal
        isModalOpen={isModalOpen}
        selectedProduct={selectedProduct}
        setIsModalOpen={setIsModalOpen}
        handleStopProduct={handleStopProduct}
      />

      <DetailModal
        isOpen={isDetailModalOpen}
        product={selectedProduct}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default AdminProductManagement;
