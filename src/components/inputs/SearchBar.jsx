import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import productService from "../../services/productService";
import favouriteService from "../../services/favouriteService";
import { useAuth } from "../../hooks/useAuth";
import formatters from "../../utils/formatters";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favoriteStatus, setFavoriteStatus] = useState({});
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Fetch search results
  useEffect(() => {
    if (keyword.trim().length === 0) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const delaySearch = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await productService.searchProducts(keyword, {
          page: 0,
          size: 5,
        });
        const products = Array.isArray(results.content) ? results.content : [];
        setSearchResults(products);

        // Fetch favorite status for each product
        const favorites = {};
        for (const product of products) {
          try {
            const isFav = await favouriteService.isInFavourites(
              product.productId,
            );
            favorites[product.productId] = isFav;
          } catch (err) {
            console.error("Failed to fetch favorite status:", err);
            favorites[product.productId] = false;
          }
        }
        setFavoriteStatus(favorites);
      } catch (err) {
        console.error("Search error:", err);
        setError("Đã có lỗi xảy ra khi tìm kiếm.");
        setSearchResults([]);
      } finally {
        setLoading(false);
        setShowDropdown(true);
      }
    }, 800);

    return () => clearTimeout(delaySearch);
  }, [keyword]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    const handlePressEscape = (e) => {
      if (e.key === "Escape") {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handlePressEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handlePressEscape);
    };
  }, []);

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleViewAllResults();
    }
  };

  // Navigate to ProductList with search query
  const handleViewAllResults = () => {
    if (keyword.trim()) {
      navigate(`${ROUTES.PRODUCT}?keyword=${encodeURIComponent(keyword)}`);
      setShowDropdown(false);
    }
  };

  // Navigate to product detail
  const handleSelectProduct = (productId) => {
    navigate(`${ROUTES.PRODUCT}/${productId}`);
    setKeyword("");
    setShowDropdown(false);
  };

  // Handle favorite button click
  const handleClickFavorite = async (e, productId) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    try {
      const currentStatus = favoriteStatus[productId] || false;

      if (currentStatus) {
        await favouriteService.removeFromFavourites(productId);
      } else {
        await favouriteService.addToFavourites(productId);
      }

      setFavoriteStatus((prev) => ({
        ...prev,
        [productId]: !currentStatus,
      }));
    } catch (err) {
      console.error("Failed to update favorite status:", err);
    }
  };

  return (
    <div className="flex-1 max-w-lg mx-auto px-4" ref={searchRef}>
      <div className="relative">
        {/* Premium Search Input */}
        <div className="flex items-center bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 focus-within:border-amber-500 focus-within:shadow-lg focus-within:shadow-amber-500/20 transition-all duration-300 backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-slate-400 ml-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() =>
              keyword.trim() &&
              searchResults.length > 0 &&
              setShowDropdown(true)
            }
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 px-3 py-3 outline-none font-semibold"
          />
          {keyword && (
            <button
              onClick={() => {
                setKeyword("");
                setSearchResults([]);
                setShowDropdown(false);
              }}
              className="text-slate-400 hover:text-amber-400 pr-4 font-bold text-lg transition-colors duration-300"
            >
              ✕
            </button>
          )}
        </div>

        {/* Premium Dropdown Results */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl shadow-slate-950/50 z-50 border border-slate-700/50 backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
            {loading && (
              <div className="p-6 text-center text-slate-400">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
                <p className="mt-3 text-sm font-semibold">Đang tìm kiếm...</p>
              </div>
            )}

            {!loading && error && (
              <div className="p-6 text-center text-red-400 animate-in fade-in duration-200">
                <p className="text-sm font-semibold">{error}</p>
              </div>
            )}

            {!loading && searchResults.length > 0 && (
              <>
                {/* Product List */}
                <div className="max-h-96 overflow-y-auto animate-in fade-in duration-200">
                  {searchResults.map((product, index) => {
                    const isNew =
                      new Date().getTime() -
                        new Date(product.createdAt).getTime() <
                      60 * 60 * 1000; // 1 hour
                    return (
                      <button
                        key={product.productId}
                        onClick={() => handleSelectProduct(product.productId)}
                        className="w-full px-5 py-4 hover:bg-slate-800/70 transition-all duration-300 text-left border-b border-slate-700/50 last:border-b-0 flex gap-4 animate-in fade-in slide-in-from-left-4 group relative"
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        {/* Favorite Button */}
                        <button
                          onClick={(e) =>
                            handleClickFavorite(e, product.productId)
                          }
                          className="absolute top-4 right-4 text-xl transition-all hover:scale-125 duration-300 z-50 cursor-pointer"
                        >
                          <i
                            className={
                              favoriteStatus[product.productId]
                                ? "fa-solid fa-heart"
                                : "fa-regular fa-heart"
                            }
                            style={{
                              color: favoriteStatus[product.productId]
                                ? "#fb923c"
                                : "#94a3b8",
                            }}
                          ></i>
                        </button>

                        {/* Product Image with Gradient Border */}
                        <div className="w-14 h-14 flex-shrink-0 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <img
                            src={product.mainImageUrl || null}
                            alt={product.productName}
                            className="w-full h-full object-cover rounded-lg border border-slate-700 group-hover:border-amber-500/50 transition-all duration-300 relative z-10"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='h-12 w-12 text-gray-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' /%3E%3C/svg%3E";
                            }}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-slate-100 font-bold line-clamp-2 text-sm mb-2 mr-10 group-hover:text-amber-100 transition-colors duration-300">
                            {product.productName}
                          </h4>
                          <div className="flex items-center justify-between">
                            <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-black text-sm">
                              {formatters.formatCurrency(product.currentPrice)}
                            </p>
                            {isNew && (
                              <span className="inline-block px-2 py-0.5 text-xs font-semibold text-amber-800 bg-amber-200 rounded-full">
                                Mới
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* View All Results Button */}
                <button
                  onClick={handleViewAllResults}
                  className="w-full px-5 py-4 text-center text-amber-400 hover:text-amber-300 font-black text-sm border-t border-slate-700/50 hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-orange-500/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 uppercase tracking-wider"
                >
                  Xem toàn bộ kết quả →
                </button>
              </>
            )}

            {!loading && !error && searchResults.length === 0 && (
              <div className="p-6 text-center text-slate-400 animate-in fade-in duration-200">
                <p className="text-sm font-semibold">
                  Không tìm thấy sản phẩm nào
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
