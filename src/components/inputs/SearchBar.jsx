import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import productService from "../../services/productService";
import formatters from "../../utils/formatters";

const SearchBar = () => {
    const [keyword, setKeyword] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Fetch search results
    useEffect(() => {
        if (keyword.trim().length === 0) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        const delaySearch = setTimeout(async () => {
            setLoading(true);
            try {
                const results = await productService.searchProducts(keyword, {
                    page: 0,
                    size: 5,
                });
                setSearchResults(
                    Array.isArray(results.content) ? results.content : [],
                );
                setShowDropdown(true);
            } catch (err) {
                console.error("Search error:", err);
                setSearchResults([]);
            } finally {
                setLoading(false);
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
            navigate(
                `${ROUTES.PRODUCT}?keyword=${encodeURIComponent(keyword)}`,
            );
            setShowDropdown(false);
        }
    };

    // Navigate to product detail
    const handleSelectProduct = (productId) => {
        navigate(`${ROUTES.PRODUCT}/${productId}`);
        setKeyword("");
        setShowDropdown(false);
    };

    return (
        <div className="flex-1 max-w-lg mx-auto px-4" ref={searchRef}>
            <div className="relative">
                {/* Search Input */}
                <div className="flex items-center bg-gray-800 rounded-lg border border-gray-600 focus-within:border-orange-500 transition">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400 ml-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
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
                        className="flex-1 bg-transparent text-white placeholder-gray-400 px-3 py-3 outline-none"
                    />
                    {keyword && (
                        <button
                            onClick={() => {
                                setKeyword("");
                                setSearchResults([]);
                                setShowDropdown(false);
                            }}
                            className="text-gray-400 hover:text-gray-300 pr-3"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Dropdown Results */}
                {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-700 animate-in fade-in slide-in-from-top-2 duration-500">
                        {loading && (
                            <div className="p-4 text-center text-gray-400">
                                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                                <p className="mt-2 text-sm">Đang tìm kiếm...</p>
                            </div>
                        )}

                        {!loading && searchResults.length > 0 && (
                            <>
                                {/* Product List */}
                                <div className="max-h-96 overflow-y-auto animate-in fade-in duration-200">
                                    {searchResults.map((product, index) => (
                                        <button
                                            key={product.productId}
                                            onClick={() =>
                                                handleSelectProduct(
                                                    product.productId,
                                                )
                                            }
                                            className="w-full px-4 py-3 hover:bg-gray-700 transition text-left border-b border-gray-700 last:border-b-0 flex gap-3 animate-in fade-in slide-in-from-left-4 duration-200"
                                            style={{
                                                animationDelay: `${
                                                    index * 50
                                                }ms`,
                                            }}
                                        >
                                            {/* Product Image */}
                                            <div className="w-12 h-12 flex-shrink-0">
                                                <img
                                                    src={
                                                        product.mainImageUrl ||
                                                        null
                                                    }
                                                    alt={product.productName}
                                                    className="w-full h-full object-cover rounded"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='h-12 w-12 text-gray-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' /%3E%3C/svg%3E";
                                                    }}
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-gray-100 font-medium line-clamp-2 text-sm">
                                                    {product.productName}
                                                </h4>
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-orange-400 font-semibold text-sm">
                                                        {formatters.formatCurrency(
                                                            product.currentPrice,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* View All Results Button */}
                                <button
                                    onClick={handleViewAllResults}
                                    className="w-full px-4 py-3 text-center text-orange-400 hover:text-orange-300 font-semibold text-sm border-t border-gray-700 hover:bg-gray-700 transition animate-in fade-in slide-in-from-bottom-2 duration-300"
                                >
                                    Xem toàn bộ kết quả →
                                </button>
                            </>
                        )}

                        {!loading && searchResults.length === 0 && (
                            <div className="p-4 text-center text-gray-400 animate-in fade-in duration-200">
                                <p className="text-sm">
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
