import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import userProfileService from "../../services/userProfileService";
import ProductCard from "../../components/ProductCard";

/**
 * Component hiển thị sản phẩm yêu thích (Watch List)
 */
const Favorites = () => {
    const [loading, setLoading] = useState(false);
    const [watchList, setWatchList] = useState([]);

    useEffect(() => {
        loadWatchList();
    }, []);

    const loadWatchList = async () => {
        setLoading(true);
        try {
            const data = await userProfileService.getWatchList();
            setWatchList(data);
        } catch (error) {
            console.error("Error loading watch list:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-red-500/20 p-8 mb-8 border border-slate-700/50 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-700/10"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <Heart className="w-12 h-12 text-rose-400" />
                        <div>
                            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-700 mb-2 tracking-tight">
                                Sản Phẩm Yêu Thích
                            </h1>
                            <p className="text-slate-300 font-semibold tracking-wide">
                                Danh sách sản phẩm bạn đang theo dõi
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div>
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-pink-500/50"></div>
                        </div>
                    ) : watchList.length === 0 ? (
                        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-700/50 rounded-2xl p-12 text-center backdrop-blur-sm shadow-xl">
                            <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-300 font-semibold text-lg mb-2">
                                Danh sách yêu thích trống
                            </p>
                            <p className="text-slate-400">
                                Hãy thêm sản phẩm yêu thích để theo dõi chúng dễ
                                dàng hơn
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {watchList.map((product) => (
                                <ProductCard
                                    key={product.productId}
                                    product={product}
                                    showStatus={true}
                                    statusType="watchlist"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Favorites;
