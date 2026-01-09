import React, { useState, useEffect } from "react";

import { TrendingUp, Trophy, Package, Zap, Star } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Tooltip from "../../../components/common/Tooltip";
import { notify } from "../../../utils/toast";
import { useAuth } from "../../../hooks/useAuth";

import userProfileService from "../../../services/userProfileService";
import ratingService from "../../../services/ratingService";
import ProductCard from "../../../components/ProductCard";
import BuyerRatingModal from "../../../components/profile/BuyerRatingModal";

import formatters from "../../../utils/formatters";
import { ROUTES } from "../../../constants/routes";
import { Link } from "react-router-dom";

/**
 * Component hiển thị thông tin người dùng
 * - Sản phẩm đang tham gia đấu giá
 * - Sản phẩm đã thắng
 */
const Activity = () => {
  const [activeTab, setActiveTab] = useState("participating");
  const [loading, setLoading] = useState(false);
  const [participatingProducts, setParticipatingProducts] = useState([]);
  const [wonProducts, setWonProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const participatingProducts =
          await userProfileService.getParticipatingProducts();
        setParticipatingProducts(participatingProducts);
        const wonProducts = await userProfileService.getWonProducts();

        // Check if rated for each won product
        const isRatedList = await Promise.all(
          wonProducts.map((product) =>
            ratingService.checkIfRated(
              product.productId,
              product.highestBidder?.userId,
              product.seller?.userId,
            ),
          ),
        );

        const updatedWonProducts = wonProducts.map((product, index) => ({
          ...product,
          isRated: isRatedList[index],
        }));
        setWonProducts(updatedWonProducts);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleOpenRatingModal = async (product) => {
    setSelectedProduct(product);
    setIsRatingModalOpen(true);

    try {
      const existingRating = await ratingService.getRating(
        product.productId,
        product.highestBidder?.userId,
        product.seller?.userId,
      );
      setSelectedProduct((prevProduct) => ({
        ...prevProduct,
        initialRating: existingRating || {},
      }));
    } catch (error) {
      console.error("Error fetching existing rating:", error);
    }
  };

  const handleSubmitRating = async (ratingData) => {
    if (selectedProduct.isRated) {
      try {
        const updateRatingData = {
          ...ratingData,
          revieweeId: selectedProduct.seller?.userId,
        };
        await ratingService.updateRating(updateRatingData);
        notify.success("Cập nhật đánh giá thành công");
      } catch (error) {
        console.error("Error updating rating:", error);
        notify.error("Cập nhật đánh giá thất bại, vui lòng thử lại");
      }
    } else {
      try {
        await userProfileService.rateSeller(ratingData);

        setWonProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.productId === ratingData.productId
              ? { ...product, isRated: true }
              : product,
          ),
        );
        notify.success("Đánh giá người bán thành công");
      } catch (error) {
        console.error("Error rating seller:", error);
        notify.error("Đánh giá người bán thất bại, vui lòng thử lại");
      }
    }
  };

  // Component to display product card with status tag
  const ProductCardWithTag = ({ product }) => {
    const isCurrentUserBidding = product.highestBidder?.userId === user?.userId;

    return (
      <div className="relative group">
        <ProductCard product={product} />
        {/* Status Tag */}
        <div className="absolute top-3 left-3 z-10">
          {isCurrentUserBidding && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg shadow-amber-500/30 border border-amber-400/50">
              Đang giữ giá
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Toaster position="top-right" />
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
            isSeller={false}
            initialRating={selectedProduct.initialRating}
          />
        </>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Toaster position="top-right" />
        <div className="container mx-auto px-28 py-8">
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-amber-400/20 p-8 mb-8 border border-slate-700/50 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-300/10"></div>
            <div className="flex items-center gap-4 relative z-10">
              <Zap className="w-12 h-12 text-amber-400" />
              <div>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-2 tracking-tight">
                  Hoạt động
                </h1>
                <p className="text-slate-300 font-semibold tracking-wide">
                  Sản phẩm đang tham gia và đã thắng đấu giá
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-lg p-2 mb-8 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("participating")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-500 ${
                  activeTab === "participating"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-400/30 scale-[1.02]"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Đang tham gia</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-black ${
                    activeTab === "participating"
                      ? "bg-white text-amber-500"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {participatingProducts.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("won")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-500 ${
                  activeTab === "won"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-400/30 scale-[1.02]"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                }`}
              >
                <Trophy className="w-5 h-5" />
                <span>Đã thắng</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-black ${
                    activeTab === "won"
                      ? "bg-white text-amber-500"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {wonProducts.length}
                </span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin shadow-lg shadow-amber-400/50"></div>
              </div>
            ) : (
              <>
                {activeTab === "participating" && (
                  <div>
                    <h2 className="text-2xl font-black text-slate-100 mb-6 tracking-wide">
                      Sản phẩm đang tham gia đấu giá
                    </h2>
                    {participatingProducts.length === 0 ? (
                      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-700/50 rounded-2xl p-12 text-center backdrop-blur-sm shadow-xl">
                        <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 font-semibold">
                          Bạn chưa tham gia đấu giá sản phẩm nào
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {participatingProducts.map((product) => (
                          <ProductCardWithTag
                            key={product.productId}
                            product={product}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "won" && (
                  <div>
                    <h2 className="text-2xl font-black text-slate-100 mb-6 tracking-wide">
                      Sản phẩm đã thắng đấu giá
                    </h2>
                    {wonProducts.length === 0 ? (
                      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-700/50 rounded-2xl p-12 text-center backdrop-blur-sm shadow-xl">
                        <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 font-semibold">
                          Bạn chưa thắng sản phẩm nào
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
                                  Giá thắng
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider">
                                  Người bán
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-slate-300 uppercase tracking-wider">
                                  Đánh giá
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                              {wonProducts.map((product) => (
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
                                          to={`${ROUTES.PRODUCT}/${product.productId}`}
                                        >
                                          <p className="font-bold text-slate-100 truncate hover:underline hover:scale-105 transition-all duration-300">
                                            {product.productName}
                                          </p>
                                        </Link>
                                        <p className="text-xs text-slate-500">
                                          ID: {product.productId}
                                        </p>
                                      </div>
                                    </div>
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
                                        {product.seller?.fullName}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {product.seller?.email}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                      <button
                                        onClick={() =>
                                          handleOpenRatingModal(product)
                                        }
                                        className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/30 group relative"
                                      >
                                        <Tooltip
                                          text={
                                            product.isRated
                                              ? "Sửa đánh giá người bán"
                                              : "Đánh giá người bán"
                                          }
                                        />
                                        <Star className="w-4 h-4" />
                                        {product.isRated
                                          ? "Sửa đánh giá"
                                          : "Đánh giá"}
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Activity;
