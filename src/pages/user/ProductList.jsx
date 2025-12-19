import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import ProductCard from "../../components/ProductCard";

import categoryService from "../../services/categoryService";
import productService from "../../services/productService";

const ITEMS_PER_PAGE = 6;

// --- COMPONENTS ---
// Premium Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
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
    <div className="flex items-center justify-center gap-3 mt-16 mb-10">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="group px-5 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-slate-200 rounded-xl hover:from-amber-600 hover:to-orange-600 hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-slate-800 disabled:hover:to-slate-700 font-bold shadow-lg hover:shadow-amber-500/50 border border-slate-600 hover:border-amber-500 uppercase tracking-wider text-sm"
      >
        <span className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Trước
        </span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`px-4 py-3 rounded-xl transition-all duration-300 font-black text-sm min-w-[3rem] ${
              page === currentPage
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/50 scale-110 border-2 border-amber-400"
                : page === "..."
                ? "bg-transparent text-slate-500 cursor-default"
                : "bg-slate-800/50 text-slate-300 hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 hover:text-white border border-slate-700 hover:border-slate-500 hover:scale-105"
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
        className="group px-5 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-slate-200 rounded-xl hover:from-amber-600 hover:to-orange-600 hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-slate-800 disabled:hover:to-slate-700 font-bold shadow-lg hover:shadow-amber-500/50 border border-slate-600 hover:border-amber-500 uppercase tracking-wider text-sm"
      >
        <span className="flex items-center gap-2">
          Sau
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

// Premium Category Item Component
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
        className={`group w-full text-left px-4 py-3 rounded-xl mb-2 transition-all duration-300 font-bold flex items-center justify-between ${
          selectedCategoryId === category.categoryId
            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/50 scale-[1.02]"
            : "bg-slate-800/50 text-slate-300 hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 hover:text-white border border-slate-700/50 hover:border-slate-600"
        } ${level > 0 ? "ml-4 text-sm" : "text-sm"}`}
      >
        <span className="tracking-wide">{category.categoryName}</span>
        {hasChildren && (
          <ChevronDown
            className={`h-5 w-5 text-amber-400 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {hasChildren && isExpanded && (
        <div className="mb-2 space-y-1 animate-in animate-slide-down duration-300">
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
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef(null);

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
            products = await productService.searchProductsWithCategoryId(
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16">
      <div className="container mx-auto px-8">
        {/* Premium Breadcrumb */}
        <div className="mb-8 text-sm flex items-center gap-2">
          <Link
            to={ROUTES.HOME}
            className="text-slate-400 hover:text-amber-400 transition-colors duration-300 font-semibold"
          >
            Trang chủ
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-slate-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-amber-400 font-bold">Sản phẩm</span>
        </div>

        {/* Premium Header with Gradient */}
        <div className="mb-12 relative">
          <div className="flex items-center gap-4 border-l-8 px-4  border-amber-500">
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 tracking-tight">
                Khám Phá Sản Phẩm
              </h1>
              <p className="text-slate-400 mt-2 text-lg">
                Có{" "}
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                  {totalProducts}
                </span>{" "}
                sản phẩm đang chờ bạn
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {/* Premium Sidebar - Filters */}
          <div className="col-span-1">
            <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 rounded-2xl p-7 border border-slate-700/50 sticky top-24 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-tr-full"></div>

              <div className="relative z-10">
                {/* Sort Section */}
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
                    <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 uppercase tracking-wider">
                      Sắp xếp
                    </h3>
                  </div>
                  <div className="relative" ref={sortDropdownRef}>
                    <button
                      onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                      className="w-full px-4 py-3.5 bg-slate-800/50 font-bold text-slate-200 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500 focus:shadow-lg focus:shadow-amber-500/20 hover:border-amber-500/50 transition-all duration-300 cursor-pointer backdrop-blur-sm flex items-center justify-between"
                    >
                      <span>
                        {currentSort === ""
                          ? "Mặc định"
                          : currentSort === "endTime,asc"
                          ? "Thời gian kết thúc (Sớm nhất)"
                          : currentSort === "endTime,desc"
                          ? "Thời gian kết thúc (Muộn nhất)"
                          : currentSort === "currentPrice,asc"
                          ? "Giá (Thấp đến Cao)"
                          : "Giá (Cao đến Thấp)"}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-amber-400 transition-transform duration-300 ${
                          isSortDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isSortDropdownOpen && (
                      <ul
                        className={`absolute z-50 w-full mt-2 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-amber-500/20 overflow-hidden animate-slide-down`}
                      >
                        {[
                          {
                            value: "",
                            label: "Mặc định",
                          },
                          {
                            value: "endTime,asc",
                            label: "Thời gian kết thúc (Sớm nhất)",
                          },
                          {
                            value: "endTime,desc",
                            label: "Thời gian kết thúc (Muộn nhất)",
                          },
                          {
                            value: "currentPrice,asc",
                            label: "Giá (Thấp đến Cao)",
                          },
                          {
                            value: "currentPrice,desc",
                            label: "Giá (Cao đến Thấp)",
                          },
                        ].map((option) => (
                          <li
                            key={option.value}
                            onClick={() => {
                              handleSortChange(option.value);
                              setIsSortDropdownOpen(false);
                            }}
                            className={`px-4 py-3 cursor-pointer transition-all duration-200 font-semibold ${
                              currentSort === option.value
                                ? "bg-gradient-to-r from-amber-600/30 to-orange-600/30 text-amber-400 border-l-4 border-amber-500"
                                : "text-slate-300 hover:bg-slate-700/50 hover:text-amber-400 hover:border-l-4 hover:border-amber-500/50"
                            }`}
                          >
                            {option.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-10"></div>

                {/* Category Filter Section */}
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
                    <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 uppercase tracking-wider">
                      Danh Mục
                    </h3>
                  </div>

                  <button
                    onClick={() => handleCategoryChange(0)}
                    className={`w-full text-left px-4 py-3 rounded-xl mb-3 transition-all duration-300 font-bold text-sm tracking-wide ${
                      selectedCategory === 0
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/50 scale-[1.02]"
                        : "bg-slate-800/50 text-slate-300 hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 hover:text-white border border-slate-700/50 hover:border-slate-600"
                    }`}
                  >
                    Tất Cả
                  </button>

                  <div className="space-y-1">
                    {categories.map((category) => (
                      <CategoryItem
                        key={category.categoryId}
                        category={category}
                        selectedCategoryId={selectedCategory}
                        onSelect={handleCategoryChange}
                      />
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8"></div>

                {/* Reset Filters Button */}
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
                  className="group w-full px-5 py-3.5 bg-gradient-to-r from-slate-800 to-slate-700 text-slate-200 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:text-white transition-all duration-300 font-black text-sm shadow-lg hover:shadow-orange-500/50 border border-slate-700 hover:border-orange-500 uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Đặt Lại Bộ Lọc
                </button>
              </div>
            </div>
          </div>

          {/* Premium Main Content */}
          <div className="col-span-3">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-24">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500"></div>
                </div>
                <p className="text-slate-400 mt-6 font-bold text-lg">
                  Đang tải sản phẩm...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border-2 border-red-700/50 rounded-2xl p-6 text-red-300 backdrop-blur-sm shadow-lg">
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-bold">{error}</span>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && products.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-8 justify-items-center">
                  {products.map(
                    (product, index) =>
                      product.isActive && (
                        <div
                          key={product.productId}
                          className="animate-slide-in-up"
                          style={{
                            animationDelay: `${index * 200}ms`,
                          }}
                        >
                          <ProductCard product={product} />
                        </div>
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
                <div className="text-center py-24">
                  <div className="inline-block p-8 bg-slate-800/50 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-20 w-20 text-slate-600 mx-auto mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-slate-400 text-lg font-bold">
                      Không tìm thấy sản phẩm nào
                    </p>
                    <p className="text-slate-500 text-sm mt-2">
                      Thử thay đổi bộ lọc hoặc tìm kiếm khác
                    </p>
                  </div>
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
