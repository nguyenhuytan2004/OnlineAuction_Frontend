import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import apiClient from "../utils/apiClient";

const ITEMS_PER_PAGE = 6;

// --- COMPONENTS ---

// Product Card for List
const ProductCard = ({ product }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    // Calculate time left
    const getTimeLeft = (endTime) => {
        const now = new Date();
        const end = new Date(endTime);
        const diff = end - now;

        if (diff < 0) return "Đã kết thúc";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);

        if (days > 0) return `${days} ngày`;
        if (hours > 0) return `${hours}:${minutes.toString().padStart(2, "0")}`;
        return `${minutes}p`;
    };

    // Get category display name
    const getCategoryName = () => {
        if (product.category.parent) {
            return product.category.categoryName;
        }
        return product.category.categoryName;
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 overflow-hidden border border-gray-700 group h-full flex flex-col">
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-700">
                {product.mainImageUrl ? (
                    <img
                        src={product.mainImageUrl}
                        alt={product.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}

                {/* Overlay Button */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link
                        to={`/auctions/${product.productId}`}
                        className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-orange-600"
                    >
                        Xem Chi Tiết
                    </Link>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Category Badge */}
                <p className="text-xs text-orange-400 mb-1 font-semibold uppercase">
                    {getCategoryName()}
                </p>

                <h3
                    className="font-semibold text-gray-100 text-sm mb-2 line-clamp-2 flex-grow"
                    title={product.productName}
                >
                    {product.productName}
                </h3>

                {/* Prices */}
                <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1">Giá hiện tại</p>
                    <p className="text-orange-400 font-bold text-base">
                        {formatCurrency(product.currentPrice)}
                    </p>
                    {product.buyNowPrice && (
                        <p className="text-xs text-gray-500 line-through">
                            {formatCurrency(product.buyNowPrice)}
                        </p>
                    )}
                </div>

                {/* Seller Info */}
                <div className="mb-3 p-2 bg-gray-700/50 rounded text-xs">
                    <p className="text-gray-300">
                        <span className="font-semibold">
                            {product.seller.fullName}
                        </span>
                    </p>
                    <div className="flex items-center gap-1 text-yellow-400 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-3 w-3 ${
                                    i <
                                    Math.round(
                                        (product.seller.ratingScore * 1.0) /
                                            product.seller.ratingCount,
                                    )
                                        ? "fill-yellow-400"
                                        : "text-gray-600"
                                }`}
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                        <span className="ml-1">
                            ({product.seller.ratingCount})
                        </span>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-700 text-xs">
                    <div className="flex items-center gap-1 text-gray-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>{getTimeLeft(product.endTime)}</span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-400 font-medium">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                        <span>{product.bidCount} lượt</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxPagesToShow / 2),
        );
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        if (startPage > 1) pages.push(1, "...");

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages) pages.push("...", totalPages);

        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-12 mb-8">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                ← Trước
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() =>
                            typeof page === "number" && onPageChange(page)
                        }
                        disabled={page === "..."}
                        className={`px-3 py-2 rounded-lg transition font-medium ${
                            page === currentPage
                                ? "bg-orange-500 text-white"
                                : page === "..."
                                ? "bg-transparent text-gray-400 cursor-default"
                                : "bg-gray-700 text-white hover:bg-gray-600"
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Sau →
            </button>
        </div>
    );
};

// Category Item Component
const CategoryItem = ({
    category,
    selectedCategoryId,
    onSelect,
    level = 0,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = category.children && category.children.length > 0;

    return (
        <div key={category.categoryId}>
            <button
                onClick={() => {
                    if (hasChildren) {
                        setIsExpanded(!isExpanded);
                    } else {
                        onSelect(category.categoryId);
                    }
                }}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition font-medium flex items-center justify-between ${
                    selectedCategoryId === category.categoryId
                        ? "bg-orange-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                } ${level > 0 ? "ml-4 text-sm" : ""}`}
            >
                <span>{category.categoryName}</span>
                {hasChildren && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                )}
            </button>

            {hasChildren && isExpanded && (
                <div className="mb-2">
                    {category.children.map((child) => (
                        <CategoryItem
                            key={child.categoryId}
                            category={child}
                            selectedCategoryId={selectedCategoryId}
                            onSelect={onSelect}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// --- MAIN COMPONENT ---
const ProductList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPageParam = parseInt(searchParams.get("page") || "1");
    const currentCategoryParam = parseInt(searchParams.get("category") || "0");

    const [currentPage, setCurrentPage] = useState(currentPageParam);
    const [selectedCategory, setSelectedCategory] =
        useState(currentCategoryParam);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Build category tree from flat list
    const buildCategoryTree = (flatCategories) => {
        const map = {};
        const roots = [];

        // Create map
        flatCategories.forEach((cat) => {
            map[cat.categoryId] = { ...cat, children: [] };
        });

        // Build tree
        flatCategories.forEach((cat) => {
            if (cat.parent) {
                if (map[cat.parent.categoryId]) {
                    map[cat.parent.categoryId].children.push(
                        map[cat.categoryId],
                    );
                }
            } else {
                roots.push(map[cat.categoryId]);
            }
        });

        return roots;
    };

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await apiClient.get("/api/categories");
                const tree = buildCategoryTree(data);
                setCategories(tree);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };

        fetchCategories();
    }, []);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                params.append("page", currentPage - 1); // API uses 0-based pagination
                params.append("size", ITEMS_PER_PAGE);

                if (selectedCategory > 0) {
                    params.append("categoryId", selectedCategory);
                }

                const data = await apiClient.get(
                    `/api/products?${params.toString()}`,
                );

                setProducts(data.content || []);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Không thể tải sản phẩm");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, selectedCategory]);

    // Handle pagination change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setSearchParams({
                page,
                category: selectedCategory,
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Handle category change
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
        setSearchParams({
            page: 1,
            category: categoryId,
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 py-12">
            <div className="container mx-auto px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Tất Cả Sản Phẩm
                    </h1>
                    <p className="text-gray-400">
                        Tìm kiếm những sản phẩm tuyệt vời từ người bán trên sàn
                    </p>
                </div>

                <div className="grid grid-cols-4 gap-8">
                    {/* Sidebar - Filters */}
                    <div className="col-span-1">
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-8">
                            {/* Category Filter */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="text-orange-400">✓</span>
                                    Danh Mục
                                </h3>

                                <button
                                    onClick={() => handleCategoryChange(0)}
                                    className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition font-medium ${
                                        selectedCategory === 0
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                                >
                                    Tất Cả
                                </button>

                                {categories.map((category) => (
                                    <CategoryItem
                                        key={category.categoryId}
                                        category={category}
                                        selectedCategoryId={selectedCategory}
                                        onSelect={handleCategoryChange}
                                    />
                                ))}
                            </div>

                            {/* Reset Filters */}
                            <button
                                onClick={() => {
                                    setSelectedCategory(0);
                                    setCurrentPage(1);
                                    setSearchParams({
                                        page: 1,
                                        category: 0,
                                    });
                                }}
                                className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition font-medium text-sm"
                            >
                                Đặt Lại Bộ Lọc
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-3">
                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-16">
                                <div className="inline-block">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                                </div>
                                <p className="text-gray-400 mt-4">
                                    Đang tải...
                                </p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-300">
                                {error}
                            </div>
                        )}

                        {/* Products Grid */}
                        {!loading && products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product.productId}
                                            product={product}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        ) : (
                            !loading && (
                                <div className="text-center py-16">
                                    <p className="text-gray-400 text-lg">
                                        Không tìm thấy sản phẩm nào.
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
