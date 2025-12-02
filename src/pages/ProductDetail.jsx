import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import helpers from "../utils/helpers";
import formatters from "../utils/formatters";

import productService from "../services/productService";

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [bidHistory, setBidHistory] = useState([]);
    const [qnaData, setQnaData] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [hoveredImage, setHoveredImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch product details
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const [productData, bidsData, qnaData, relatedProductsData] =
                    await Promise.all([
                        productService.getProductById(productId),
                        productService.getBidsHistory(productId),
                        productService.getProductQnA(productId),
                        productService.getRelatedProducts(productId),
                    ]);
                setProduct(productData);
                setBidHistory(Array.isArray(bidsData) ? bidsData : []);
                setQnaData(Array.isArray(qnaData) ? qnaData : []);
                setRelatedProducts(
                    Array.isArray(relatedProductsData)
                        ? relatedProductsData
                        : [],
                );
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setError("Không thể tải chi tiết sản phẩm");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 py-12">
                <div className="container mx-auto px-8 text-center">
                    <div className="inline-block">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                    <p className="text-gray-400 mt-4">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-900 py-12">
                <div className="container mx-auto px-8">
                    <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-300">
                        {error || "Không tìm thấy sản phẩm"}
                    </div>
                </div>
            </div>
        );
    }

    // Get all images (main + auxiliary)
    const allImages = [
        product.mainImageUrl,
        ...(product.auxiliaryImages?.map((img) => img.imageUrl) || []),
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-gray-900 py-12">
            <div className="container mx-auto px-8">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-400">
                    <Link to={ROUTES.HOME} className="hover:text-orange-400">
                        Trang chủ
                    </Link>
                    {" > "}
                    <Link to={ROUTES.PRODUCT} className="hover:text-orange-400">
                        Sản phẩm
                    </Link>
                    {" > "}
                    <span className="text-gray-300">{product.productName}</span>
                </div>

                {/* Top Section: 3 Columns Layout */}
                <div className="grid grid-cols-3 gap-8 mb-12">
                    {/* Column 1: Images */}
                    <div className="col-span-1">
                        {/* Main Image */}
                        <div className="mb-4 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                            <img
                                src={
                                    hoveredImage || product.mainImageUrl || null
                                }
                                alt={product.productName}
                                className="w-full h-96 object-cover transition-all duration-500"
                            />
                        </div>

                        {/* Thumbnail Images */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-3 gap-2">
                                {allImages.slice(1, 4).map((image, idx) => (
                                    <button
                                        key={idx}
                                        onMouseEnter={() =>
                                            setHoveredImage(image)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredImage(null)
                                        }
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition border-gray-700 hover:border-gray-600`}
                                    >
                                        <img
                                            src={image || null}
                                            alt={`Ảnh ${idx + 2}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Column 2: Main Information */}
                    <div className="col-span-1 px-6 py-8 border border-gray-700 rounded-lg h-96 bg-gray-800">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {product.productName}
                            </h1>
                            <span className="bg-orange-900/30 text-orange-300 px-3 py-1 rounded-full text-sm">
                                {product.category.categoryName}
                            </span>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm text-gray-400 mb-2">
                                Giá hiện tại
                            </p>
                            <p className="text-4xl font-bold text-orange-500">
                                {formatters.formatCurrency(
                                    product.currentPrice,
                                )}
                            </p>
                        </div>
                        <div className="mb-8">
                            <p className=" text-gray-400 mb-1">
                                Giá mua ngay:{" "}
                                <span className="font-bold text-red-400">
                                    {product.buyNowPrice ? (
                                        formatters.formatCurrency(
                                            product.buyNowPrice,
                                        )
                                    ) : (
                                        <span className="text-red-400/80 font-semibold">
                                            Không có
                                        </span>
                                    )}
                                </span>
                            </p>
                        </div>

                        {/* Dates Info */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                                <p className="text-sm text-gray-400 mb-2">
                                    Thời điểm đăng
                                </p>
                                <p className="text-lg font-semibold text-white">
                                    {formatters.formatDate(product.createdAt)}
                                </p>
                            </div>
                            <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                                <p className="text-sm text-gray-400 mb-2">
                                    Thời điểm kết thúc
                                </p>
                                <p
                                    className={`text-lg font-semibold ${helpers.getTimeColorClass(
                                        product.endTime,
                                    )}`}
                                >
                                    {formatters.getRelativeTime(
                                        product.endTime,
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Bid History Table */}
                    <div className="col-span-1 flex flex-col justify-start space-y-6">
                        {/* Highest Bidder Info Box */}
                        {product.highestBidder ? (
                            <div className="p-4 bg-orange-900/20 border border-orange-700/50 rounded-lg">
                                <h3 className="text-lg font-bold text-orange-300 mb-3">
                                    <i
                                        className="fa-solid fa-user"
                                        style={{ color: "#fdba74" }}
                                    ></i>{" "}
                                    Người đặt giá cao nhất
                                </h3>
                                <p className="text-white font-semibold mb-2">
                                    {product.highestBidder.fullName}
                                </p>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <svg
                                            key={i}
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-4 w-4 ${
                                                i <
                                                helpers.getRatingStars(
                                                    product.highestBidder
                                                        .ratingScore,
                                                    product.highestBidder
                                                        .ratingCount,
                                                )
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-600"
                                            }`}
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="text-sm text-gray-400">
                                        ({product.highestBidder.ratingCount})
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                                <p className="text-gray-400">
                                    Chưa có người đặt giá nào
                                </p>
                            </div>
                        )}
                        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-gray-700 ">
                                <h3 className="text-lg font-bold text-white">
                                    📜 Lịch sử đấu giá
                                </h3>
                            </div>
                            <div className="overflow-y-auto flex-1 max-h-[500px]">
                                <table className="w-full text-sm text-left text-gray-300">
                                    <thead className="text-xs text-gray-400 uppercase bg-gray-700/50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3">
                                                Thời gian
                                            </th>
                                            <th className="px-4 py-3">
                                                Người ra giá
                                            </th>
                                            <th className="px-11">Giá</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bidHistory.length > 0 ? (
                                            bidHistory.map((bid) => (
                                                <tr
                                                    key={bid.bidId}
                                                    className="border-b border-gray-700 hover:bg-gray-700/30"
                                                >
                                                    <td className="px-4 py-5">
                                                        {new Date(
                                                            bid.bidAt,
                                                        ).toLocaleDateString(
                                                            "vi-VN",
                                                            {
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            },
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-white">
                                                        {bid.bidder.fullName}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-orange-400 font-bold">
                                                        {formatters.formatCurrency(
                                                            bid.bidPrice,
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="3"
                                                    className="px-4 py-3 text-center text-gray-400"
                                                >
                                                    Chưa có lịch sử đấu giá
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Seller & Dates */}
                <div className="grid grid-cols-3 gap-8 mb-12">
                    {/* Seller Info */}
                    <div className="col-span-1 p-6 bg-gray-800 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-bold text-gray-400 mb-4">
                            <i
                                className="fa-solid fa-user"
                                style={{ color: "#9ca3af" }}
                            ></i>{" "}
                            Thông tin người bán
                        </h3>
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <p className="text-xl font-semibold text-white mb-2">
                                    {product.seller.fullName}
                                </p>
                                <p className="text-sm text-gray-400 mb-2">
                                    {product.seller.email}
                                </p>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <svg
                                            key={i}
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-5 w-5 ${
                                                i <
                                                helpers.getRatingStars(
                                                    product.seller.ratingScore,
                                                    product.seller.ratingCount,
                                                )
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-600"
                                            }`}
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="text-sm text-gray-400">
                                        ({product.seller.ratingCount} đánh giá)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="col-span-2 mb-12 p-6 bg-gray-800 rounded-lg border border-gray-700 h-full">
                        <h2 className="text-xl font-bold text-gray-400 mb-4">
                            <i
                                className="fa-solid fa-circle-info"
                                style={{ color: "#9ca3af" }}
                            ></i>{" "}
                            Mô tả chi tiết
                        </h2>
                        <div className="text-white whitespace-pre-line leading-relaxed">
                            {product.description}
                        </div>
                    </div>
                </div>

                {/* Q&A Section */}
                <div className="mb-12 border bg-gray-800 rounded-lg border-gray-700 p-8">
                    <h2 className="text-2xl font-bold text-gray-300 mb-6">
                        <i
                            className="fa-solid fa-comment"
                            style={{ color: "#9ca3af" }}
                        ></i>{" "}
                        Câu hỏi & Trả lời
                    </h2>
                    <div className="space-y-4">
                        {qnaData.length === 0 ? (
                            <p className="text-gray-400">
                                Chưa có câu hỏi nào cho sản phẩm này.
                            </p>
                        ) : (
                            qnaData.map((qa) => (
                                <div
                                    key={qa.questionId}
                                    className="p-6 bg-gray-700/50 rounded-lg border border-gray-700"
                                >
                                    {/* Question */}
                                    <div className="mb-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm text-orange-400 font-semibold">
                                                {qa.questionUser.fullName}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(
                                                    qa.questionAt,
                                                ).toLocaleDateString("vi-VN")}
                                            </span>
                                        </div>
                                        <p className="text-gray-300">
                                            {qa.questionText}
                                        </p>
                                    </div>

                                    {/* Answer */}
                                    {qa.answers &&
                                        qa.answers.map((answer) => (
                                            <div
                                                key={answer.answerId}
                                                className="ml-4 pl-4 border-l-2 border-gray-700"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-sm text-green-400 font-semibold">
                                                        Trả lời
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(
                                                            answer.answerAt,
                                                        ).toLocaleDateString(
                                                            "vi-VN",
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-gray-300">
                                                    {answer.answerText}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-300 mb-6">
                        Sản phẩm liên quan
                    </h2>
                    <div className="grid grid-cols-5 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <div
                                key={relatedProduct.productId}
                                className="bg-gray-800 rounded-lg hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 overflow-hidden border border-gray-700 group"
                            >
                                <Link
                                    to={`${ROUTES.PRODUCT}/${relatedProduct.productId}`}
                                >
                                    {/* Image Section */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-700">
                                        <img
                                            src={
                                                relatedProduct.mainImageUrl ||
                                                null
                                            }
                                            alt={relatedProduct.productName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Overlay Button */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <button className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-orange-600">
                                                Xem Chi Tiết
                                            </button>
                                        </div>
                                    </div>
                                </Link>

                                {/* Content Section */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-100 text-base mb-1 line-clamp-2 min-h-[3rem]">
                                        {relatedProduct.productName}
                                    </h3>

                                    <div className="flex items-end justify-between mb-3">
                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Giá hiện tại
                                            </p>
                                            <p className="text-orange-500 font-bold text-lg">
                                                {formatters.formatCurrency(
                                                    relatedProduct.currentPrice,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-700 text-sm">
                                        <div
                                            className={`flex items-center gap-1 font-medium ${helpers.getTimeColorClass(
                                                relatedProduct.endTime,
                                            )}`}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
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
                                            <span>
                                                {formatters.getRemainingTime(
                                                    relatedProduct.endTime,
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 text-gray-400 font-medium">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
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
                                                {relatedProduct.bidCount} lượt
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
