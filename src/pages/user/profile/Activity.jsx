import React, { useState, useEffect } from "react";
import { TrendingUp, Trophy, Package, Zap } from "lucide-react";
import userProfileService from "../../../services/userProfileService";
import ProductCard from "../../../components/ProductCard";

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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const participatingProducts =
          await userProfileService.getParticipatingProducts();
        setParticipatingProducts(participatingProducts);
        const wonProducts = await userProfileService.getWonProducts();
        setWonProducts(wonProducts);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12">
      <div className="container mx-auto px-4 py-8">
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
                        <ProductCard product={product} />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {wonProducts.map((product) => (
                        <ProductCard
                          key={product.productId}
                          product={product}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activity;
