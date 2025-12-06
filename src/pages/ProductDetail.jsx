import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import helpers from "../utils/helpers";
import formatters from "../utils/formatters";

import productService from "../services/productService";
import bidService from "../services/bidService";
import { useWebSocket } from "../hooks/useWebSocket";

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [bidHistory, setBidHistory] = useState([]);
    const [qnaData, setQnaData] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [hoveredImage, setHoveredImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [showBidModal, setShowBidModal] = useState(false);
    const [showBuyNowModal, setShowBuyNowModal] = useState(false);
    const [maxBidPrice, setMaxBidPrice] = useState("");
    const [bidError, setBidError] = useState("");
    const [buyNowLoading, setBuyNowLoading] = useState(false);
    const [buyNowError, setBuyNowError] = useState("");
    const [notification, setNotification] = useState(null);
    const [isEligible, setIsEligible] = useState(false);
    const [isAuctionEnded, setIsAuctionEnded] = useState(false);

    const handleAuctionUpdate = useCallback((bidUpdate) => {
        console.log("Handling bid update:", bidUpdate);

        const fetchUpdatedData = async () => {
            try {
                const updatedProduct = await productService.getProductById(
                    bidUpdate.productId,
                );
                const newBid = await bidService.getBid(bidUpdate.newBidId);

                setProduct(updatedProduct);
                setBidHistory((prevBidHistory) => {
                    // Nếu bidHistory đã có 5 mục thì chỉ giữ lại 4 mục mới nhất cộng với mục mới
                    if (prevBidHistory.length === 5) {
                        return [newBid, ...prevBidHistory.slice(0, 4)];
                    }
                    return [newBid, ...prevBidHistory];
                });
            } catch (error) {
                console.error("Failed to fetch updated data:", error);
            }
        };

        fetchUpdatedData();

        // Show notification based on message type
        setNotification({
            message: "Có lượt đặt giá mới!",
            type: "info",
        });
        setTimeout(() => setNotification(null), 5000);
    }, []);

    const handleAuctionExtended = useCallback((newEndTime) => {
        console.log("Handling auction extension:", newEndTime);

        // Update product endTime
        setProduct((prev) => ({
            ...prev,
            endTime: newEndTime,
        }));

        // Show notification
        setNotification({
            message: `Phiên đấu giá đã được gia hạn!`,
            type: "info",
        });
        setTimeout(() => setNotification(null), 5000);
    }, []);

    const handleAuctionEnd = useCallback((message) => {
        console.log("Handling auction end:", message);

        setIsAuctionEnded(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        // Show notification
        setNotification({
            message,
            type: "info",
        });
        setTimeout(() => setNotification(null), 5000);
    }, []);

    const handleBuyNowAction = async () => {
        // Simulate delay for better UX
        setTimeout(async () => {
            try {
                await productService.buyNowProduct(productId);
                setShowBuyNowModal(false);

                // Reload product info
                const updatedProduct = await productService.getProductById(
                    productId,
                );
                setProduct(updatedProduct);
                setIsAuctionEnded(true);
            } catch (err) {
                setBuyNowError(
                    err.response?.data?.message ||
                        err.message ||
                        "Không thể hoàn tất mua ngay",
                );
            } finally {
                setBuyNowLoading(false);
            }
        }, 2000);
    };

    // WebSocket integration
    const {
        connected,
        error: wsError,
        placeBid: wsSendBid,
    } = useWebSocket(
        productId,
        handleAuctionUpdate,
        handleAuctionExtended,
        handleAuctionEnd,
    );

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
                setIsAuctionEnded(!productData.isActive);
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

    // Check eligibility to place bid
    useEffect(() => {
        const fetchEligibility = async () => {
            try {
                const isEligible = await productService.checkBiddingEligibility(
                    product.productId,
                );
                setIsEligible(isEligible);
            } catch (error) {
                console.error("Failed to check bidding eligibility:", error);
            }
        };

        if (product && !product.allowUnderratedBidder) fetchEligibility();
    }, [product]);

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

                {/* WebSocket Status & Notification */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-2 h-2 rounded-full ${
                                connected ? "bg-green-500" : "bg-red-500"
                            } animate-pulse`}
                        ></div>
                        <span className="text-sm text-gray-400">
                            {connected
                                ? "Kết nối trực tiếp"
                                : "Đang kết nối lại..."}
                        </span>
                    </div>

                    {wsError && (
                        <div className="text-sm text-red-400">{wsError}</div>
                    )}
                </div>

                {/* Notification Toast */}
                {notification && (
                    <div
                        className={`mb-4 p-4 rounded-lg border animate-slide-down ${
                            notification.type === "success"
                                ? "bg-green-900/20 border-green-700 text-green-300"
                                : notification.type === "warning"
                                ? "bg-yellow-900/20 border-yellow-700 text-yellow-300"
                                : "bg-blue-900/20 border-blue-700 text-blue-300"
                        }`}
                    >
                        <p className="flex items-center gap-2">
                            {notification.type === "success" && "✅"}
                            {notification.type === "warning" && "⚠️"}
                            {notification.type === "info" && "ℹ️"}
                            <span className="font-semibold">
                                {notification.message}
                            </span>
                        </p>
                    </div>
                )}

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
                    <div className="relative col-span-1  flex flex-col">
                        <div className="h-96 bg-gray-800 px-6 py-8 border border-gray-700 rounded-lg flex flex-col">
                            <button
                                onClick={() => setIsFavorited(!isFavorited)}
                                className="absolute top-9 right-10 text-2xl transition-transform hover:scale-125 duration-500"
                            >
                                <i
                                    className={
                                        isFavorited
                                            ? "fa-solid fa-heart"
                                            : "fa-regular fa-heart"
                                    }
                                    style={{ color: "#fdba74" }}
                                ></i>
                            </button>
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
                            {/* Action Buttons */}
                            <div className="flex gap-6 px-8 flex-grow items-center">
                                <button
                                    onClick={() => {
                                        if (
                                            product.buyNowPrice &&
                                            isEligible &&
                                            !isAuctionEnded
                                        ) {
                                            setShowBuyNowModal(true);
                                        }
                                    }}
                                    disabled={
                                        !product.buyNowPrice ||
                                        !isEligible ||
                                        isAuctionEnded
                                    }
                                    className={`flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 ${
                                        !product.buyNowPrice ||
                                        !isEligible ||
                                        isAuctionEnded
                                            ? "opacity-40 cursor-not-allowed grayscale"
                                            : ""
                                    }`}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        Mua ngay
                                    </span>
                                </button>
                                <button
                                    onClick={() => {
                                        if (
                                            connected &&
                                            isEligible &&
                                            !isAuctionEnded
                                        ) {
                                            setShowBidModal(true);
                                        }
                                    }}
                                    disabled={
                                        !connected ||
                                        !isEligible ||
                                        isAuctionEnded
                                    }
                                    className={`flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 ${
                                        !connected ||
                                        !isEligible ||
                                        isAuctionEnded
                                            ? "opacity-40 cursor-not-allowed grayscale"
                                            : ""
                                    }`}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        Đặt giá tối đa
                                    </span>
                                </button>
                            </div>
                        </div>
                        {/* Dates Info */}
                        <div className="grid grid-cols-2 gap-6 flex-grow items-center">
                            <div className="text-center p-4 bg-gray-800 rounded-lg">
                                <p className="text-sm text-gray-400 mb-2">
                                    Thời điểm đăng
                                </p>
                                <p className="text-lg font-semibold text-white">
                                    {formatters.formatDate(product.createdAt)}
                                </p>
                            </div>
                            <div className="text-center p-4 bg-gray-800 rounded-lg">
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
                                            bidHistory.map((bid, index) => (
                                                <tr
                                                    key={index}
                                                    className={`border-b border-gray-700 hover:bg-gray-700/30 ${
                                                        index === 0
                                                            ? "animate-fade-in bg-orange-900/10"
                                                            : ""
                                                    }`}
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

            {/* Place Max Bid Modal */}
            {showBidModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 w-96 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Đặt giá tối đa
                        </h2>
                        <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
                            <p className="text-gray-400 text-sm mb-2">
                                Sản phẩm
                            </p>
                            <p className="text-white font-semibold mb-4">
                                {product.productName}
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">
                                        Giá hiện tại
                                    </p>
                                    <p className="text-orange-400 font-bold">
                                        {formatters.formatCurrency(
                                            product.currentPrice,
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">
                                        Bước giá
                                    </p>
                                    <p className="text-orange-400 font-bold">
                                        {formatters.formatCurrency(
                                            product.priceStep,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-300 font-semibold mb-2">
                                Giá tối đa của bạn
                            </label>
                            <div className="relative">
                                <select
                                    value={maxBidPrice}
                                    onChange={(e) => {
                                        setMaxBidPrice(e.target.value);
                                        setBidError("");
                                    }}
                                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-orange-500 outline-none transition appearance-none max-h-30 overflow-y-auto"
                                >
                                    <option value="">-- Chọn giá --</option>
                                    {Array.from({ length: 20 }, (_, i) => {
                                        const price =
                                            product.currentPrice +
                                            (i + 1) * product.priceStep;
                                        return (
                                            <option key={i} value={price}>
                                                {formatters.formatCurrency(
                                                    price,
                                                )}
                                            </option>
                                        );
                                    })}
                                </select>
                                <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 px-2 text-white">
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
                            {bidError && (
                                <p className="text-red-400 text-sm mt-2">
                                    {bidError}
                                </p>
                            )}
                        </div>

                        <div className="mb-6 p-4 bg-orange-900/20 border border-orange-700/50 rounded-lg">
                            <p className="text-orange-300 text-sm">
                                <span>
                                    <i
                                        className="fa-solid fa-lightbulb"
                                        style={{ color: "#fdba74" }}
                                    ></i>
                                </span>{" "}
                                Hệ thống sẽ tự động tăng giá theo các mức tăng
                                để giúp bạn thắng đấu giá.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowBidModal(false);
                                    setMaxBidPrice("");
                                    setBidError("");
                                }}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    if (!maxBidPrice) {
                                        setBidError("Vui lòng chọn giá tối đa");
                                        return;
                                    }

                                    const bidAmount = parseFloat(maxBidPrice);

                                    try {
                                        wsSendBid(bidAmount);
                                        setShowBidModal(false);
                                        setMaxBidPrice("");
                                        setBidError("");
                                        setNotification({
                                            message: "Đã gửi yêu cầu đấu giá!",
                                            type: "info",
                                        });
                                        setTimeout(
                                            () => setNotification(null),
                                            3000,
                                        );
                                    } catch (err) {
                                        setBidError(
                                            err.message ||
                                                "Không thể gửi yêu cầu đấu giá",
                                        );
                                    }
                                }}
                                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                            >
                                Đặt giá
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Buy Now Confirmation Modal */}
            {showBuyNowModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 w-96 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Xác nhận mua ngay
                        </h2>
                        <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
                            <p className="text-gray-400 text-sm mb-2">
                                Sản phẩm
                            </p>
                            <p className="text-white font-semibold mb-4">
                                {product.productName}
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">
                                        Giá mua ngay
                                    </p>
                                    <p className="text-red-400 font-bold">
                                        {formatters.formatCurrency(
                                            product.buyNowPrice,
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">
                                        Giá hiện tại
                                    </p>
                                    <p className="text-orange-400 font-bold">
                                        {formatters.formatCurrency(
                                            product.currentPrice,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 p-4 bg-orange-900/20 border border-orange-700/50 rounded-lg">
                            <p className="text-orange-300 text-sm">
                                <span>
                                    <i
                                        className="fa-solid fa-lightbulb"
                                        style={{ color: "#fdba74" }}
                                    ></i>
                                </span>{" "}
                                Phiên đấu giá sẽ kết thúc ngay lập tức và bạn sẽ
                                trở thành người chiến thắng.
                            </p>
                        </div>

                        {buyNowError && (
                            <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                                <p className="text-red-400 text-sm">
                                    {buyNowError}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowBuyNowModal(false);
                                    setBuyNowError("");
                                }}
                                disabled={buyNowLoading}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={async () => {
                                    handleBuyNowAction();
                                    setBuyNowLoading(true);
                                    setBuyNowError("");
                                }}
                                disabled={buyNowLoading}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                            >
                                {buyNowLoading ? "Đang xử lý..." : "Mua ngay"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
