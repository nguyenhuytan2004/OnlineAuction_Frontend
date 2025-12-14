import React, { useState, useEffect } from "react";
import {
  Package,
  CheckCircle,
  Star,
  XCircle,
  FileEdit,
  Plus,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

import userProfileService from "../../../services/userProfileService";
import ratingService from "../../../services/ratingService";
import productService from "../../../services/productService";

import BuyerRatingModal from "../../../components/profile/BuyerRatingModal";
import CancelTransactionModal from "../../../components/profile/CancelTransactionModal";
import AddDescriptionModal from "../../../components/profile/AddDescriptionModal";
import CreateProductModal from "../../../components/profile/CreateProductModal";
import formatters from "../../../utils/formatters";

/**
 * Component hiển thị quản lý sản phẩm của người bán
 * - Sản phẩm đang đăng & còn hạn
 * - Sản phẩm đã có người thắng đấu giá
 */
const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(false);
  const [activeProducts, setActiveProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isAddDescModalOpen, setIsAddDescModalOpen] = useState(false);
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] =
    useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const activeProducts = await userProfileService.getActiveProducts();
        setActiveProducts(activeProducts);

        const soldProducts = await userProfileService.getSoldProducts();
        setSoldProducts(soldProducts);

        const isRatedList = await Promise.all(
          soldProducts.map((product) =>
            ratingService.checkIfRated(
              product.productId,
              product.seller?.userId,
              product.highestBidder?.userId,
            ),
          ),
        );

        const updatedSoldProducts = soldProducts.map((product, index) => ({
          ...product,
          isRated: isRatedList[index],
        }));
        setSoldProducts(updatedSoldProducts);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRateWinner = (product) => {
    setSelectedProduct(product);
    setIsRatingModalOpen(true);
  };

  const handleCancelTransaction = (product) => {
    setSelectedProduct(product);
    setIsCancelModalOpen(true);
  };

  const handleAddDescription = (product) => {
    setSelectedProduct(product);
    setIsAddDescModalOpen(true);
  };

  const handleSubmitRating = async (ratingData) => {
    try {
      await userProfileService.rateBuyer(ratingData);

      // Reload sold products
      const products = await userProfileService.getSoldProducts();
      setSoldProducts(products);
    } catch (error) {
      console.error("Error rating buyer:", error);
    }
  };

  const handleSubmitCancel = async (cancelData) => {
    try {
      await userProfileService.cancelAuctionResult(cancelData.productId);

      // Reload sold products
      const products = await userProfileService.getSoldProducts();
      setSoldProducts(products);
    } catch (error) {
      console.error("Error canceling transaction:", error);
    }
  };

  const handleSubmitAddDescription = async (data) => {
    try {
      const updatedDescription = await productService.appendProductDescription(
        data.productId,
        data.additionalDescription,
      );

      // Reload active products
      setActiveProducts((previousProducts) =>
        previousProducts.map((product) =>
          product.productId === data.productId
            ? { ...product, description: updatedDescription }
            : product,
        ),
      );

      return updatedDescription;
    } catch (error) {
      console.error("Error adding description:", error);
    }
  };

  const handleCreateProduct = async (formData) => {
    try {
      // TODO: Call API to create product
      // const createdProduct = await productService.createProduct(formData);

      toast.success("Sản phẩm đã được tạo thành công!");
      setIsCreateProductModalOpen(false);

      // Reload products
      const activeProducts = await userProfileService.getActiveProducts();
      setActiveProducts(activeProducts);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Lỗi tạo sản phẩm, vui lòng thử lại");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <CreateProductModal
        isOpen={isCreateProductModalOpen}
        onClose={() => setIsCreateProductModalOpen(false)}
        onSubmit={handleCreateProduct}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-28 py-8">
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-amber-500/20 p-8 mb-8 border border-slate-700/50 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-400/10"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <Package className="w-12 h-12 text-amber-500" />
                <div>
                  <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 mb-2 tracking-tight">
                    Quản lý sản phẩm
                  </h1>
                  <p className="text-slate-300 font-semibold tracking-wide">
                    Quản lý sản phẩm đang bán và đã bán
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateProductModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Thêm Sản Phẩm
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-lg p-2 mb-8 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("active")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-500 ${
                  activeTab === "active"
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/30 scale-[1.02]"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Đang bán</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-black ${
                    activeTab === "active"
                      ? "bg-white text-amber-600"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {activeProducts.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("sold")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-500 ${
                  activeTab === "sold"
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/30 scale-[1.02]"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                <span>Đã bán</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-black ${
                    activeTab === "sold"
                      ? "bg-white text-amber-600"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {soldProducts.length}
                </span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-amber-500/50"></div>
              </div>
            ) : (
              <>
                {activeTab === "active" && (
                  <div>
                    <h2 className="text-2xl font-black text-slate-100 mb-6 tracking-wide">
                      Sản phẩm đang bán & còn hạn
                    </h2>
                    {activeProducts.length === 0 ? (
                      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-700/50 rounded-2xl p-12 text-center backdrop-blur-sm shadow-xl">
                        <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 font-semibold">
                          Bạn chưa có sản phẩm nào đang bán
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-800/50 border-b border-slate-700">
                              <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider">
                                  Sản phẩm
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider">
                                  Danh mục
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider w-1/3">
                                  Mô tả
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-slate-300 uppercase tracking-wider">
                                  Hành động
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                              {activeProducts.map((product) => (
                                <tr
                                  key={product.productId}
                                  className="hover:bg-slate-800/30 transition-colors"
                                >
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={product.mainImageUrl || null}
                                        alt={product.productName || "No image"}
                                        className="w-12 h-12 object-cover rounded-lg border border-slate-600"
                                      />
                                      <div className="max-w-xs">
                                        <p className="font-bold text-slate-100 truncate">
                                          {product.productName}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                          ID: {product.productId}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-slate-700 text-slate-300">
                                      {product.category?.categoryName || "N/A"}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <p className="text-sm text-slate-300 line-clamp-2">
                                      {product.description || "Chưa có mô tả"}
                                    </p>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center justify-center">
                                      <button
                                        onClick={() =>
                                          handleAddDescription(product)
                                        }
                                        className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-amber-500/30"
                                        title="Bổ sung thông tin"
                                      >
                                        <FileEdit className="w-4 h-4" />
                                        Bổ sung
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "sold" && (
                  <div>
                    <h2 className="text-2xl font-black text-slate-100 mb-6 tracking-wide">
                      Sản phẩm đã có người thắng
                    </h2>
                    {soldProducts.length === 0 ? (
                      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-700/50 rounded-2xl p-12 text-center backdrop-blur-sm shadow-xl">
                        <CheckCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 font-semibold">
                          Chưa có sản phẩm nào được bán
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-800/50 border-b border-slate-700">
                              <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider">
                                  Sản phẩm
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider">
                                  Danh mục
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider">
                                  Giá bán
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider">
                                  Người mua
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-slate-300 uppercase tracking-wider">
                                  Hành động
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                              {soldProducts.map((product) => (
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
                                        <p className="font-bold text-slate-100 truncate">
                                          {product.productName}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                          ID: {product.productId}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-slate-700 text-slate-300">
                                      {product.category?.categoryName || "N/A"}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <p className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 text-lg">
                                      {formatters.formatCurrency(
                                        product.currentPrice ||
                                          product.finalPrice,
                                      )}
                                    </p>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div>
                                      <p className="font-semibold text-slate-200">
                                        {product.highestBidder?.fullName}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {product.highestBidder?.email}
                                      </p>
                                    </div>
                                  </td>
                                  {!product.isRated && (
                                    <td className="px-6 py-4">
                                      <div className="flex items-center justify-center gap-2">
                                        <button
                                          onClick={() =>
                                            handleRateWinner(product)
                                          }
                                          className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/30"
                                          title="Đánh giá người mua"
                                        >
                                          <Star className="w-4 h-4" />
                                          Đánh giá
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleCancelTransaction(product)
                                          }
                                          className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-sm font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/30"
                                          title="Huỷ giao dịch"
                                        >
                                          <XCircle className="w-4 h-4" />
                                          Huỷ
                                        </button>
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Modals */}
        {selectedProduct && (
          <>
            <BuyerRatingModal
              isOpen={isRatingModalOpen}
              onClose={() => {
                setIsRatingModalOpen(false);
                setSelectedProduct(null);
              }}
              product={selectedProduct}
              onSubmit={handleSubmitRating}
            />
            <CancelTransactionModal
              isOpen={isCancelModalOpen}
              onClose={() => {
                setIsCancelModalOpen(false);
                setSelectedProduct(null);
              }}
              product={selectedProduct}
              onSubmit={handleSubmitCancel}
            />
            <AddDescriptionModal
              isOpen={isAddDescModalOpen}
              onClose={() => {
                setIsAddDescModalOpen(false);
                setSelectedProduct(null);
              }}
              product={selectedProduct}
              onSubmit={handleSubmitAddDescription}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ProductManagement;
