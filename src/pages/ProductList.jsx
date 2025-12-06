import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import formatters from "../utils/formatters";
import helpers from "../utils/helpers";

import categoryService from "../services/categoryService";
import productService from "../services/productService";

const ITEMS_PER_PAGE = 6;

// --- COMPONENTS ---

// Product Card for List
const ProductCard = ({ product }) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 overflow-hidden border border-gray-700 group h-full flex flex-col w-80">
            <Link to={`${ROUTES.PRODUCT}/${product.productId}`}>
                {/* Image Section */}
                <div className="relative aspect-square overflow-hidden bg-gray-700">
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
                        <button className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-orange-600">
                            Xem Chi Tiết
                        </button>
                    </div>
                </div>
            </Link>
            {/* Content Section */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Product Name */}
                <h3
                    className="font-semibold text-gray-100 text-sm mb-2 line-clamp-2"
                    title={product.productName}
                >
                    {product.productName}
                </h3>

                {/* Current Price */}
                <div className="mb-2">
                    <p className="text-xs text-gray-400 mb-1">Giá hiện tại</p>
                    <p className="text-orange-500 font-bold text-lg">
                        {formatters.formatCurrency(product.currentPrice)}
                    </p>
                </div>

                {/* Buy Now Price */}
                <div className="mb-2 pb-2 border-b border-gray-700">
                    <p className="text-xs text-gray-400">
                        Giá mua ngay:{" "}
                        {product.buyNowPrice ? (
                            <span className="text-red-400 font-bold">
                                {formatters.formatCurrency(product.buyNowPrice)}
                            </span>
                        ) : (
                            <span className="text-red-400/80 font-semibold">
                                Không có
                            </span>
                        )}
                    </p>
                </div>

                {/* Highest Bidder Info */}
                {product.highestBidder ? (
                    <div className="mb-2 p-2 bg-orange-900/20 rounded border border-orange-800/50 text-xs">
                        <p className="text-orange-300 font-semibold mb-1">
                            Người đang đặt giá cao nhất
                        </p>
                        <p className="text-gray-300">
                            {product.highestBidder.fullName}
                        </p>
                        <div className="flex items-center gap-1 text-yellow-400 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-3 w-3 ${
                                        i <
                                        helpers.getRatingStars(
                                            product.highestBidder.ratingScore,
                                            product.highestBidder.ratingCount,
                                        )
                                            ? "fill-yellow-400"
                                            : "text-gray-600"
                                    }`}
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                            <span className="ml-1 text-gray-400">
                                ({product.highestBidder.ratingCount})
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="mb-2 p-2 bg-gray-700/30 rounded border border-gray-600/50 text-xs">
                        <p className="text-gray-400">
                            Chưa có người đặt giá nào
                        </p>
                    </div>
                )}

                {/* Footer Info */}
                <div className="flex flex-col gap-2 pt-2 border-t border-gray-700 text-xs">
                    {/* Created Date */}
                    <div>
                        <p className="text-xs text-gray-400">
                            Ngày đăng:{" "}
                            <span className="text-gray-400 font-semibold">
                                {formatters.formatDate(product.createdAt)}
                            </span>
                        </p>
                    </div>
                    {/* Time Left */}
                    <div className="flex items-center gap-2 text-gray-400">
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
                        <span>Còn lại: </span>
                        <span
                            className={helpers.getTimeColorClass(
                                product.endTime,
                            )}
                        >
                            {formatters.getRemainingTime(product.endTime)}
                        </span>
                    </div>

                    {/* Bid Count */}
                    <div className="flex items-center gap-2 text-gray-400">
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
                        <span>
                            Lượt ra giá:{" "}
                            <span className="font-semibold text-gray-400">
                                {product.bidCount}
                            </span>
                        </span>
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
    const currentSortParam = searchParams.get("sort") || "";
    const currentCategoryParam = parseInt(searchParams.get("category") || "0");
    const searchQueryParam = searchParams.get("keyword") || "";

    const [currentPage, setCurrentPage] = useState(currentPageParam);
    const [currentSort, setCurrentSort] = useState(currentSortParam);
    const [selectedCategory, setSelectedCategory] =
        useState(currentCategoryParam);
    const [currentKeyword, setCurrentKeyword] = useState(searchQueryParam);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sync state with URL parameters whenever URL changes
    useEffect(() => {
        const newCategory = parseInt(searchParams.get("category") || "0");
        const newKeyword = searchParams.get("keyword") || "";
        const newPage = parseInt(searchParams.get("page") || "1");
        const newSort = searchParams.get("sort") || "";

        setSelectedCategory(newCategory);
        setCurrentKeyword(newKeyword);
        setCurrentPage(newPage);
        setCurrentSort(newSort);
    }, [searchParams]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            setError(null);
            try {
                const categoryTree = await categoryService.getAllCategories();
                setCategories(categoryTree);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError("Không thể tải danh mục");
                setCategories([]);
            } finally {
                setLoading(false);
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
                params.append("page", currentPage - 1);
                params.append("size", ITEMS_PER_PAGE);
                params.append("sort", currentSort);

                let products;
                const options = Object.fromEntries(params.entries());
                if (currentKeyword) {
                    if (selectedCategory > 0) {
                        products =
                            await productService.searchProductsWithCategoryId(
                                selectedCategory,
                                currentKeyword,
                                options,
                            );
                    } else {
                        products = await productService.searchProducts(
                            currentKeyword,
                            options,
                        );
                    }
                } else {
                    if (selectedCategory > 0) {
                        products = await productService.getProductsByCategoryId(
                            selectedCategory,
                            options,
                        );
                    } else {
                        products = await productService.getAllProducts(options);
                    }
                }

                setProducts(products.content || []);
                setTotalProducts(products.totalElements || 0);
                setTotalPages(products.totalPages || 1);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Không thể tải sản phẩm");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, currentKeyword, currentPage, currentSort]);

    // Handle pagination change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setSearchParams({
                category: selectedCategory,
                page,
                size: ITEMS_PER_PAGE,
                sort: currentSort,
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Handle sort change
    const handleSortChange = (sort) => {
        setCurrentSort(sort);
        setCurrentPage(1);
        setSearchParams({
            category: selectedCategory,
            page: 1,
            size: ITEMS_PER_PAGE,
            sort,
        });
    };

    // Handle category change
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
        setCurrentSort("");
        setSearchParams({
            category: categoryId,
            keyword: currentKeyword,
            page: 1,
            size: ITEMS_PER_PAGE,
            sort: "",
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 py-12">
            <div className="container mx-auto px-8">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-400">
                    <Link to={ROUTES.HOME} className="hover:text-orange-400">
                        Trang chủ
                    </Link>
                    {" > "}
                    <span className="text-gray-300">Sản phẩm</span>
                </div>
                {/* Header */}
                <div className="mb-8 text-2xl">
                    <p className="text-gray-400">
                        Có{" "}
                        <span className="font-bold text-orange-400">
                            {totalProducts}
                        </span>{" "}
                        sản phẩm
                    </p>
                </div>

                <div className="grid grid-cols-4 gap-8">
                    {/* Sidebar - Filters */}
                    <div className="col-span-1">
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-8">
                            {/* Sort */}

                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <i
                                        className="fa-solid fa-list"
                                        style={{ color: "#d1d5db" }}
                                    ></i>
                                    Sắp xếp
                                </h3>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-2 bg-gray-700 font-bold text-gray-300 rounded-lg border border-gray-600 focus:outline-none focus:border-orange-500 hover:border-orange-500 transition duration-300 appearance-none cursor-pointer"
                                        onChange={(e) =>
                                            handleSortChange(e.target.value)
                                        }
                                        value={currentSort}
                                    >
                                        <option value="">Mặc định</option>
                                        <option value="endTime,asc">
                                            Thời gian kết thúc (Sớm nhất)
                                        </option>
                                        <option value="endTime,desc">
                                            Thời gian kết thúc (Muộn nhất)
                                        </option>
                                        <option value="currentPrice,asc">
                                            Giá (Thấp đến Cao)
                                        </option>
                                        <option value="currentPrice,desc">
                                            Giá (Cao đến Thấp)
                                        </option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-white">
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            {/* Category Filter */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <i
                                        className="fa-solid fa-sort"
                                        style={{ color: "#d1d5db" }}
                                    ></i>
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
                                    setCurrentSort("");
                                    setCurrentKeyword("");
                                    setSearchParams({
                                        page: 1,
                                        sort: "",
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
                                <div className="grid grid-cols-3 gap-6 justify-items-center">
                                    {products.map(
                                        (product) =>
                                            product.isActive && (
                                                <ProductCard
                                                    key={product.productId}
                                                    product={product}
                                                />
                                            ),
                                    )}
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
