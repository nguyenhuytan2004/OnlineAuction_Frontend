import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
    CheckCircle,
    Info,
    TriangleAlert,
    XCircle,
    ChevronDown,
} from "lucide-react";
import { ROUTES } from "../constants/routes";
import helpers from "../utils/helpers";
import formatters from "../utils/formatters";
import ProductCard from "../components/ProductCard_LessInfo";
import productService from "../services/productService";
import bidService from "../services/bidService";
import favouriteService from "../services/favouriteService";
import { useWebSocket } from "../hooks/useWebSocket";
import { useAuction } from "../hooks/useAuction";
import { useBid } from "../hooks/useBid";
import { useQnA } from "../hooks/useQnA";
import { useAuth } from "../hooks/useAuth";

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
    const [isBidDropdownOpen, setIsBidDropdownOpen] = useState(false);
    const bidDropdownRef = useRef(null);
    const [buyNowError, setBuyNowError] = useState("");
    const [notification, setNotification] = useState(null);
    const [isEligible, setIsEligible] = useState(false);
    const [isAuctionEnded, setIsAuctionEnded] = useState(false);
    const [questionText, setQuestionText] = useState("");
    const [answerTexts, setAnswerTexts] = useState({});
    const navigate = useNavigate();

    const { isAuthenticated, user } = useAuth();
    const isCurrentUserSeller =
        isAuthenticated && user.userId === product?.seller?.userId;

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
                    // If history already has 5 bids, remove the oldest one
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
        setTimeout(() => setNotification(null), 3000);
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
        setTimeout(() => setNotification(null), 3000);
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
        setTimeout(() => setNotification(null), 3000);
    }, []);

    const handleBuyNowAction = async () => {
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

    const handleNewQuestion = useCallback((newQuestion) => {
        console.log("New question received:", newQuestion);
        setQnaData((prev) => [newQuestion, ...prev]);
    }, []);

    const handleNewAnswer = useCallback((newAnswer, questionId) => {
        console.log("New answer received:", newAnswer);

        setQnaData((prev) =>
            prev.map((qa) => {
                if (qa.questionId === questionId) {
                    return {
                        ...qa,
                        answers: [...(qa.answers || []), newAnswer],
                    };
                }
                return qa;
            }),
        );
    }, []);

    const handleClickFavoriteProduct = async (productId, isFavorited) => {
        try {
            if (isFavorited) {
                await favouriteService.addToFavourites(productId);
            } else {
                await favouriteService.removeFromFavourites(productId);
            }
        } catch (error) {
            console.error("Failed to update favorite status:", error);
        }
    };

    // WebSocket connection
    const { connected, unsubscribeFromProduct } = useWebSocket();

    // Q&A hook
    const { askQuestion, answerQuestion, subscribeToAnswers } = useQnA(
        productId,
        product?.seller?.userId,
        connected,
        handleNewQuestion,
        handleNewAnswer,
    );

    // Track subscribed questions to avoid duplicate subscriptions
    const subscribedQuestionsRef = useRef(new Set());

    // Subscribe to answers for each question when Q&A data updates
    useEffect(() => {
        if (product && connected) {
            qnaData.forEach((qa) => {
                // Just subscribe if not already subscribed
                if (!subscribedQuestionsRef.current.has(qa.questionId)) {
                    subscribeToAnswers(qa.questionId);
                    subscribedQuestionsRef.current.add(qa.questionId);
                }
            });
        }
    }, [connected, qnaData, product, subscribeToAnswers]);

    // Auction hook
    useAuction(
        productId,
        connected,
        handleAuctionUpdate,
        handleAuctionExtended,
        handleAuctionEnd,
    );

    // Bid hook
    const { placeBid: wsSendBid } = useBid(productId);

    // Fetch product details
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const [
                    productData,
                    bidsData,
                    qnaData,
                    relatedProductsData,
                    isFavorited,
                ] = await Promise.all([
                    productService.getProductById(productId),
                    productService.getBidsHistory(productId),
                    productService.getProductQnA(productId),
                    productService.getRelatedProducts(productId),
                    favouriteService.isInFavourites(productId),
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
                setIsFavorited(isFavorited);
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setError("Không thể tải chi tiết sản phẩm");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();

        return () => {
            unsubscribeFromProduct(productId);
        };
    }, [productId, unsubscribeFromProduct]);

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

        if (isAuthenticated && product && !product.allowUnderratedBidder)
            fetchEligibility();
    }, [isAuthenticated, product]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                bidDropdownRef.current &&
                !bidDropdownRef.current.contains(event.target)
            ) {
                setIsBidDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
                <div className="container mx-auto px-8 text-center">
                    <div className="inline-block relative">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-amber-500"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-xl"></div>
                    </div>
                    <p className="text-gray-300 mt-6 text-lg font-medium font-['Montserrat']">
                        Đang tải...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
                <div className="container mx-auto px-8">
                    <div className="bg-gradient-to-br from-red-900/30 via-red-800/20 to-red-900/30 border border-red-500/50 rounded-2xl p-8 backdrop-blur-xl">
                        <div className="flex items-center justify-center gap-3">
                            <XCircle className="w-8 h-8 text-red-400" />
                            <p className="text-red-200 text-xl font-semibold font-['Montserrat']">
                                {error || "Không tìm thấy sản phẩm"}
                            </p>
                        </div>
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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-full blur-3xl animate-float"></div>
                <div
                    className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-full blur-3xl animate-float"
                    style={{ animationDelay: "2s" }}
                ></div>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div
                    className={`fixed top-16 right-16 z-50 px-8 py-5 rounded-xl shadow-2xl flex items-center gap-4 transition-all backdrop-blur-xl border animate-slide-down ${
                        notification.type === "success"
                            ? "bg-gradient-to-br from-emerald-900/95 via-emerald-800/95 to-emerald-900/95 border-emerald-500/50 shadow-emerald-500/30"
                            : notification.type === "info"
                            ? "bg-gradient-to-br from-blue-900/95 via-blue-800/95 to-blue-900/95 border-blue-500/50 shadow-blue-500/30"
                            : notification.type === "warning"
                            ? "bg-gradient-to-br from-yellow-900/95 via-yellow-800/95 to-yellow-900/95 border-yellow-500/50 shadow-yellow-500/30"
                            : "bg-gradient-to-br from-red-900/95 via-red-800/95 to-red-900/95 border-red-500/50 shadow-red-500/30"
                    } text-white`}
                >
                    {notification.type === "success" ? (
                        <CheckCircle className="w-6 h-6 text-emerald-300" />
                    ) : notification.type === "info" ? (
                        <Info className="w-6 h-6 text-blue-300" />
                    ) : notification.type === "warning" ? (
                        <TriangleAlert className="w-6 h-6 text-yellow-300" />
                    ) : (
                        <XCircle className="w-6 h-6 text-red-300" />
                    )}
                    <span className="font-semibold text-lg font-['Montserrat']">
                        {notification.message}
                    </span>
                </div>
            )}

            <div className="container mx-auto px-8 relative z-10">
                {/* Breadcrumb */}
                <div className="mb-8 text-sm font-['Montserrat']">
                    <Link
                        to={ROUTES.HOME}
                        className="text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500 transition-all"
                    >
                        Trang chủ
                    </Link>
                    <span className="text-gray-600 mx-2">›</span>
                    <Link
                        to={ROUTES.PRODUCT}
                        className="text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500 transition-all"
                    >
                        Sản phẩm
                    </Link>
                    <span className="text-gray-600 mx-2">›</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-semibold">
                        {product.productName}
                    </span>
                </div>

                {/* Top Section: 3 Columns Layout */}
                <div className="grid grid-cols-3 gap-8 mb-12">
                    {/* Column 1: Images */}
                    <div className="col-span-1">
                        {/* Main Image */}
                        <div className="mb-6 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-amber-500/10 backdrop-blur-xl group relative">
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <img
                                src={
                                    hoveredImage || product.mainImageUrl || null
                                }
                                alt={product.productName}
                                className="w-full h-96 object-cover transition-all duration-700 group-hover:scale-105"
                            />
                        </div>

                        {/* Thumbnail Images */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-3 gap-3">
                                {allImages.slice(1, 4).map((image, idx) => (
                                    <button
                                        key={idx}
                                        onMouseEnter={() =>
                                            setHoveredImage(image)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredImage(null)
                                        }
                                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 
                                            ${
                                                hoveredImage === image
                                                    ? "border-amber-500 shadow-lg shadow-amber-500/50 scale-105"
                                                    : "border-slate-700/50 hover:border-amber-500/50"
                                            } bg-gradient-to-br from-slate-900/90 to-slate-800/80`}
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
                    <div className="relative col-span-1 flex flex-col">
                        <div className="h-96 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 px-8 py-8 border border-slate-700/50 rounded-2xl flex flex-col backdrop-blur-xl shadow-2xl shadow-amber-500/10 relative overflow-hidden hover:shadow-amber-500/20 transition-all duration-300">
                            {/* Decorative corner elements */}
                            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-br-full"></div>
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-orange-500/10 to-transparent rounded-tl-full"></div>

                            <button
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        navigate(ROUTES.LOGIN);
                                        return;
                                    }
                                    handleClickFavoriteProduct(
                                        product.productId,
                                        !isFavorited,
                                    );
                                    setIsFavorited(!isFavorited);
                                }}
                                className="absolute top-8 right-8 text-3xl transition-all hover:scale-125 duration-500 z-50 cursor-pointer"
                            >
                                <i
                                    className={
                                        isFavorited
                                            ? "fa-solid fa-heart"
                                            : "fa-regular fa-heart"
                                    }
                                    style={{
                                        color: isFavorited
                                            ? "#fb923c"
                                            : "#94a3b8",
                                    }}
                                ></i>
                            </button>
                            <div className="mb-8 relative z-10">
                                <h1 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display'] leading-tight">
                                    {product.productName}
                                </h1>
                                <span className="inline-block bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 px-4 py-2 rounded-xl text-sm font-['Montserrat'] font-semibold border border-amber-500/30">
                                    {product.category.categoryName}
                                </span>
                            </div>
                            <div className="mb-6 relative z-10">
                                <p className="text-sm text-gray-400 mb-2 font-['Montserrat']">
                                    Giá hiện tại
                                </p>
                                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-['Montserrat']">
                                    {formatters.formatCurrency(
                                        product.currentPrice,
                                    )}
                                </p>
                            </div>
                            <div className="mb-8 relative z-10">
                                <p className="text-gray-300 mb-1 font-['Montserrat']">
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
                            <div className="flex gap-4 flex-grow items-center relative z-10">
                                <button
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            navigate(ROUTES.LOGIN);
                                            return;
                                        }
                                        if (
                                            product.buyNowPrice &&
                                            isEligible &&
                                            !isAuctionEnded
                                        ) {
                                            setShowBuyNowModal(true);
                                        }
                                    }}
                                    disabled={
                                        (!product.buyNowPrice ||
                                            !isEligible ||
                                            isAuctionEnded) &&
                                        isAuthenticated
                                    }
                                    className={`flex-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-400 text-white font-bold py-4 px-6 rounded-xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 font-['Montserrat'] border border-red-400/20 ${
                                        (!product.buyNowPrice ||
                                            !isEligible ||
                                            isAuctionEnded) &&
                                        isAuthenticated
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
                                        if (!isAuthenticated) {
                                            navigate(ROUTES.LOGIN);
                                            return;
                                        }
                                        if (
                                            connected &&
                                            isEligible &&
                                            !isAuctionEnded
                                        ) {
                                            setShowBidModal(true);
                                        }
                                    }}
                                    disabled={
                                        (!connected ||
                                            !isEligible ||
                                            isAuctionEnded) &&
                                        isAuthenticated
                                    }
                                    className={`flex-1 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-500 hover:to-orange-400 text-white font-bold py-4 px-6 rounded-xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 font-['Montserrat'] border border-amber-400/20 ${
                                        (!connected ||
                                            !isEligible ||
                                            isAuctionEnded) &&
                                        isAuthenticated
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
                        <div className="grid grid-cols-2 gap-4 flex-grow items-center">
                            <div className="text-center p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-xl border border-slate-700/50 backdrop-blur-xl shadow-lg hover:shadow-amber-500/20 transition-all duration-300">
                                <p className="text-sm text-gray-400 mb-2 font-['Montserrat']">
                                    Thời điểm đăng
                                </p>
                                <p className="text-lg font-semibold text-white font-['Montserrat']">
                                    {formatters.formatDate(product.createdAt)}
                                </p>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-xl border border-slate-700/50 backdrop-blur-xl shadow-lg hover:shadow-amber-500/20 transition-all duration-300">
                                <p className="text-sm text-gray-400 mb-2 font-['Montserrat']">
                                    Thời điểm kết thúc
                                </p>
                                <p
                                    className={`text-lg font-semibold font-['Montserrat'] ${helpers.getTimeColorClass(
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

                    {/* Column 3: Highest Bidder and Bid History Table */}
                    <div className="col-span-1 flex flex-col justify-start space-y-6 ">
                        {/* Highest Bidder Info Box */}
                        {product.highestBidder ? (
                            <div className="p-6 bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-amber-900/30 border border-amber-500/50 rounded-2xl backdrop-blur-xl shadow-lg shadow-amber-500/20">
                                <h3 className="text-lg font-bold text-amber-300 mb-4 font-['Montserrat'] flex items-center gap-2">
                                    <i
                                        className="fa-solid fa-crown"
                                        style={{ color: "#fbbf24" }}
                                    ></i>
                                    Người đặt giá cao nhất
                                </h3>
                                <p className="text-white font-semibold mb-3 text-lg font-['Montserrat']">
                                    {helpers.maskName(
                                        product.highestBidder.fullName,
                                    )}
                                </p>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <svg
                                            key={i}
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-5 w-5 ${
                                                i <
                                                helpers.getRatingStars(
                                                    product.highestBidder
                                                        .ratingScore,
                                                    product.highestBidder
                                                        .ratingCount,
                                                )
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-gray-700"
                                            }`}
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="text-sm text-gray-300 font-['Montserrat']">
                                        ({product.highestBidder.ratingCount})
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-2xl border border-slate-700/50 backdrop-blur-xl">
                                <p className="text-gray-300 font-['Montserrat']">
                                    Chưa có người đặt giá nào
                                </p>
                            </div>
                        )}
                        <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 rounded-2xl border border-slate-700/50 overflow-hidden flex flex-col backdrop-blur-xl shadow-2xl shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-300">
                            <div className="p-5 border-b border-slate-700/50 bg-gradient-to-r from-slate-900/50 to-slate-800/30">
                                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-['Playfair_Display']">
                                    Lịch sử đấu giá
                                </h3>
                            </div>
                            <div className="overflow-y-auto flex-1 max-h-[500px]">
                                <table className="w-full text-sm text-left text-gray-300 font-['Montserrat']">
                                    <thead className="text-xs text-gray-400 uppercase bg-gradient-to-r from-slate-800/80 to-slate-900/60 sticky top-0 backdrop-blur-xl">
                                        <tr>
                                            <th className="px-4 py-4">
                                                Thời gian
                                            </th>
                                            <th className="px-4 py-4">
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
                                                    className={`border-b border-slate-700/50 transition-colors duration-200 ${
                                                        index === 0
                                                            ? "animate-slide-in-up bg-amber-900/20 hover:bg-amber-900/50"
                                                            : "hover:bg-slate-700/20 "
                                                    }`}
                                                >
                                                    <td className="px-4 py-5 text-gray-300">
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
                                                        {helpers.maskName(
                                                            bid.bidder.fullName,
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-bold text-base">
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
                                                    className="px-4 py-8 text-center text-gray-400"
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
                    <div className="col-span-1 p-8 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 rounded-2xl border border-slate-700/50 backdrop-blur-xl shadow-2xl shadow-amber-500/10 relative overflow-hidden hover:shadow-amber-500/20 transition-all duration-300">
                        {/* Decorative element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full"></div>

                        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-6 font-['Playfair_Display'] flex items-center gap-2 relative z-10">
                            <i
                                className="fa-solid fa-user-tie"
                                style={{ color: "#fbbf24" }}
                            ></i>
                            Thông tin người bán
                        </h3>
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="flex-1">
                                <p className="text-2xl font-semibold text-white mb-3 font-['Montserrat']">
                                    {product.seller.fullName}
                                </p>
                                <p className="text-sm text-gray-300 mb-4 font-['Montserrat']">
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
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-gray-700"
                                            }`}
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="text-sm text-gray-300 font-['Montserrat']">
                                        ({product.seller.ratingCount} đánh giá)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="col-span-2 mb-12 p-8 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 rounded-2xl border border-slate-700/50 h-full backdrop-blur-xl shadow-2xl shadow-amber-500/10 relative overflow-hidden hover:shadow-amber-500/20 transition-all duration-300">
                        {/* Decorative element */}
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-tr-full "></div>

                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-6 font-['Playfair_Display'] flex items-center gap-2 relative z-10">
                            <i
                                className="fa-solid fa-circle-info"
                                style={{ color: "#fbbf24" }}
                            ></i>
                            Mô tả chi tiết
                        </h2>
                        <div className="text-gray-200 whitespace-pre-line leading-relaxed font-['Montserrat'] relative z-10">
                            {product.description}
                        </div>
                    </div>
                </div>

                {/* Q&A Section */}
                <div className="mb-12 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 rounded-2xl border border-slate-700/50 p-8 backdrop-blur-xl shadow-2xl shadow-amber-500/10 relative overflow-hidden">
                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full"></div>

                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-8 font-['Playfair_Display'] flex items-center gap-3 relative z-10">
                        <i
                            className="fa-solid fa-comments"
                            style={{ color: "#fbbf24" }}
                        ></i>
                        Câu hỏi
                    </h2>

                    {/* Ask Question Form - Only for authenticated users */}
                    {isAuthenticated && !isCurrentUserSeller && (
                        <div className="mb-8 p-6 border border-amber-500/30 rounded-xl bg-gradient-to-r from-amber-900/20 via-orange-900/10 to-amber-900/20 backdrop-blur-xl relative z-10">
                            <label className="flex items-center gap-2 text-amber-300 font-semibold mb-4 font-['Montserrat'] text-lg">
                                <i className="fa-solid fa-question-circle"></i>
                                Đặt câu hỏi
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={questionText}
                                    onChange={(e) =>
                                        setQuestionText(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            if (!questionText.trim()) {
                                                setNotification({
                                                    message:
                                                        "Vui lòng nhập câu hỏi",
                                                    type: "warning",
                                                });
                                            } else {
                                                try {
                                                    askQuestion(
                                                        user.userId,
                                                        productId,
                                                        questionText,
                                                    );
                                                    setQuestionText("");
                                                } catch (err) {
                                                    setNotification({
                                                        message: err.message,
                                                        type: "warning",
                                                    });
                                                }
                                            }
                                            setTimeout(
                                                () => setNotification(null),
                                                3000,
                                            );
                                        }
                                    }}
                                    placeholder="Nhập câu hỏi của bạn..."
                                    className="flex-1 px-5 py-3 bg-gradient-to-r from-slate-800/80 to-slate-900/60 text-white border border-slate-600/50 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all font-['Montserrat'] placeholder:text-gray-500"
                                />
                                <button
                                    onClick={() => {
                                        if (!questionText.trim()) {
                                            setNotification({
                                                message:
                                                    "Vui lòng nhập câu hỏi",
                                                type: "warning",
                                            });
                                        } else {
                                            try {
                                                askQuestion(
                                                    user.userId,
                                                    productId,
                                                    questionText,
                                                );
                                                setQuestionText("");
                                            } catch (err) {
                                                setNotification({
                                                    message: err.message,
                                                    type: "warning",
                                                });
                                            }
                                        }
                                        setTimeout(
                                            () => setNotification(null),
                                            3000,
                                        );
                                    }}
                                    className="px-8 py-3 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-500 hover:to-orange-400 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-amber-500/50 font-['Montserrat']"
                                >
                                    Gửi
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Q&A List */}
                    <div className="space-y-5 relative z-10">
                        {qnaData.length === 0 ? (
                            <p className="text-gray-300 text-center py-8 font-['Montserrat']">
                                Chưa có câu hỏi nào cho sản phẩm này.
                            </p>
                        ) : (
                            qnaData.map((qa) => (
                                <div
                                    key={qa.questionId}
                                    className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-xl border border-slate-700/50 backdrop-blur-xl hover:border-amber-500/30 transition-all duration-300"
                                >
                                    {/* Question */}
                                    <div className="mb-5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-sm text-amber-400 font-semibold font-['Montserrat']">
                                                {qa.questionUser.fullName}
                                            </span>
                                            <span className="text-xs text-gray-500 font-['Montserrat']">
                                                {new Date(
                                                    qa.questionAt,
                                                ).toLocaleDateString("vi-VN")}
                                            </span>
                                        </div>
                                        <p className="text-gray-200 font-['Montserrat'] leading-relaxed">
                                            {qa.questionText}
                                        </p>
                                    </div>

                                    {/* Answers */}
                                    {qa.answers && qa.answers.length > 0 && (
                                        <div className="mb-4 pl-5 border-l-2 border-emerald-500 space-y-3">
                                            {qa.answers.map((answer) => (
                                                <div
                                                    key={answer.answerId}
                                                    className="bg-gradient-to-r from-emerald-900/20 to-emerald-800/10 p-4 rounded-xl border border-emerald-500/20"
                                                >
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-sm text-emerald-400 font-semibold font-['Montserrat'] flex items-center gap-2">
                                                            <i className="fa-solid fa-check-circle"></i>
                                                            {
                                                                answer
                                                                    .answerUser
                                                                    .fullName
                                                            }
                                                        </span>
                                                        <span className="text-xs text-gray-400 font-['Montserrat']">
                                                            {new Date(
                                                                answer.answerAt,
                                                            ).toLocaleDateString(
                                                                "vi-VN",
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-200 text-sm font-['Montserrat'] leading-relaxed">
                                                        {answer.answerText}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Answer Form - Only for seller */}
                                    {isCurrentUserSeller && (
                                        <div className="pt-4 border-t border-slate-700/50">
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    value={
                                                        answerTexts[
                                                            qa.questionId
                                                        ] || ""
                                                    }
                                                    onChange={(e) =>
                                                        setAnswerTexts({
                                                            ...answerTexts,
                                                            [qa.questionId]:
                                                                e.target.value,
                                                        })
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (
                                                            e.key === "Enter" &&
                                                            !e.shiftKey
                                                        ) {
                                                            e.preventDefault();
                                                            const answerText =
                                                                answerTexts[
                                                                    qa
                                                                        .questionId
                                                                ];
                                                            if (
                                                                !answerText ||
                                                                !answerText.trim()
                                                            ) {
                                                                setNotification(
                                                                    {
                                                                        message:
                                                                            "Vui lòng nhập câu trả lời",
                                                                        type: "warning",
                                                                    },
                                                                );
                                                            } else {
                                                                try {
                                                                    answerQuestion(
                                                                        user.userId,
                                                                        productId,
                                                                        qa.questionId,
                                                                        answerText,
                                                                    );
                                                                    setAnswerTexts(
                                                                        {
                                                                            ...answerTexts,
                                                                            [qa.questionId]:
                                                                                "",
                                                                        },
                                                                    );
                                                                } catch (err) {
                                                                    setNotification(
                                                                        {
                                                                            message:
                                                                                err.message,
                                                                            type: "warning",
                                                                        },
                                                                    );
                                                                }
                                                            }
                                                            setTimeout(
                                                                () =>
                                                                    setNotification(
                                                                        null,
                                                                    ),
                                                                3000,
                                                            );
                                                        }
                                                    }}
                                                    placeholder="Nhập câu trả lời..."
                                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-slate-800/80 to-slate-900/60 text-white border border-slate-600/50 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none text-sm font-['Montserrat'] placeholder:text-gray-500 transition-all"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const answerText =
                                                            answerTexts[
                                                                qa.questionId
                                                            ];
                                                        if (
                                                            !answerText ||
                                                            !answerText.trim()
                                                        ) {
                                                            setNotification({
                                                                message:
                                                                    "Vui lòng nhập câu trả lời",
                                                                type: "warning",
                                                            });
                                                        } else {
                                                            try {
                                                                answerQuestion(
                                                                    user.userId,
                                                                    productId,
                                                                    qa.questionId,
                                                                    answerText,
                                                                );
                                                                setAnswerTexts({
                                                                    ...answerTexts,
                                                                    [qa.questionId]:
                                                                        "",
                                                                });
                                                            } catch (err) {
                                                                setNotification(
                                                                    {
                                                                        message:
                                                                            err.message,
                                                                        type: "warning",
                                                                    },
                                                                );
                                                            }
                                                        }
                                                        setTimeout(
                                                            () =>
                                                                setNotification(
                                                                    null,
                                                                ),
                                                            3000,
                                                        );
                                                    }}
                                                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-sm rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-emerald-500/50 font-['Montserrat']"
                                                >
                                                    Trả lời
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div className="relative">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-8 font-['Playfair_Display']">
                        Sản phẩm liên quan
                    </h2>
                    <div className="grid grid-cols-5 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <div key={relatedProduct.productId}>
                                <ProductCard product={relatedProduct} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Place Max Bid Modal */}
            {showBidModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
                    <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 rounded-2xl border border-slate-700/50 p-10 w-[480px] shadow-2xl shadow-amber-500/20 backdrop-blur-xl relative overflow-hidden">
                        {/* Decorative corners */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-tr-full"></div>

                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-6 font-['Playfair_Display'] relative z-10">
                            Đặt giá tối đa
                        </h2>
                        <div className="mb-8 p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-xl border border-slate-700/50 relative z-10">
                            <p className="text-gray-400 text-sm mb-2 font-['Montserrat']">
                                Sản phẩm
                            </p>
                            <p className="text-white font-semibold mb-6 text-lg font-['Montserrat']">
                                {product.productName}
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-gray-400 text-sm mb-2 font-['Montserrat']">
                                        Giá hiện tại
                                    </p>
                                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-bold text-xl font-['Montserrat']">
                                        {formatters.formatCurrency(
                                            product.currentPrice,
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-2 font-['Montserrat']">
                                        Bước giá
                                    </p>
                                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-bold text-xl font-['Montserrat']">
                                        {formatters.formatCurrency(
                                            product.priceStep,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8 relative z-[60]">
                            <label className="block text-gray-300 font-semibold mb-3 font-['Montserrat'] text-base">
                                Giá tối đa của bạn
                            </label>
                            <div className="relative" ref={bidDropdownRef}>
                                <button
                                    onClick={() =>
                                        setIsBidDropdownOpen(!isBidDropdownOpen)
                                    }
                                    className="w-full px-5 py-4 bg-gradient-to-r from-slate-800/80 to-slate-900/60 text-white border border-slate-600/50 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition font-['Montserrat'] font-semibold text-lg flex items-center justify-between cursor-pointer hover:border-amber-500/50"
                                >
                                    <span
                                        className={
                                            maxBidPrice
                                                ? "text-white"
                                                : "text-gray-500"
                                        }
                                    >
                                        {maxBidPrice
                                            ? formatters.formatCurrency(
                                                  parseFloat(maxBidPrice),
                                              )
                                            : "-- Chọn giá --"}
                                    </span>
                                    <ChevronDown
                                        className={`h-5 w-5 text-amber-400 transition-transform duration-300 ${
                                            isBidDropdownOpen
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    />
                                </button>

                                {isBidDropdownOpen && (
                                    <ul className="absolute z-[70] w-full bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-amber-500/20 overflow-hidden max-h-52 overflow-y-auto animate-slide-down">
                                        <li
                                            onClick={() => {
                                                setMaxBidPrice("");
                                                setBidError("");
                                                setIsBidDropdownOpen(false);
                                            }}
                                            className={`px-5 py-3 cursor-pointer transition-all duration-200 font-semibold font-['Montserrat'] ${
                                                maxBidPrice === ""
                                                    ? "bg-gradient-to-r from-amber-600/30 to-orange-600/30 text-amber-400 border-l-4 border-amber-500"
                                                    : "text-slate-300 hover:bg-slate-700/50 hover:text-amber-400 hover:border-l-4 hover:border-amber-500/50"
                                            }`}
                                        >
                                            -- Chọn giá --
                                        </li>
                                        {Array.from({ length: 50 }, (_, i) => {
                                            const price =
                                                product.currentPrice +
                                                (i + 1) * product.priceStep;
                                            return (
                                                <li
                                                    key={i}
                                                    onClick={() => {
                                                        setMaxBidPrice(
                                                            price.toString(),
                                                        );
                                                        setBidError("");
                                                        setIsBidDropdownOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className={`px-5 py-3 cursor-pointer transition-all duration-200 font-semibold font-['Montserrat'] ${
                                                        maxBidPrice ===
                                                        price.toString()
                                                            ? "bg-gradient-to-r from-amber-600/30 to-orange-600/30 text-amber-400 border-l-4 border-amber-500"
                                                            : "text-slate-300 hover:bg-slate-700/50 hover:text-amber-400 hover:border-l-4 hover:border-amber-500/50"
                                                    }`}
                                                >
                                                    {formatters.formatCurrency(
                                                        price,
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                            {bidError && (
                                <p className="text-red-400 text-sm mt-3 font-['Montserrat'] animate-slide-in-up">
                                    {bidError}
                                </p>
                            )}
                        </div>

                        <div className="mb-8 p-5 bg-gradient-to-r from-amber-900/30 via-orange-900/20 to-amber-900/30 border border-amber-500/50 rounded-xl relative z-[5]">
                            <p className="text-amber-200 text-sm font-['Montserrat'] flex items-start gap-2">
                                <i
                                    className="fa-solid fa-lightbulb mt-0.5"
                                    style={{ color: "#fbbf24" }}
                                ></i>
                                <span>
                                    Hệ thống sẽ tự động tăng giá theo các mức
                                    tăng để giúp bạn thắng đấu giá.
                                </span>
                            </p>
                        </div>

                        <div className="flex gap-4 relative z-[5]">
                            <button
                                onClick={() => {
                                    setShowBidModal(false);
                                    setMaxBidPrice("");
                                    setBidError("");
                                }}
                                className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-['Montserrat']"
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
                                    if (bidAmount >= product.buyNowPrice) {
                                        setShowBuyNowModal(true);
                                        setShowBidModal(false);
                                        setMaxBidPrice("");
                                        setBidError("");
                                        return;
                                    }

                                    try {
                                        wsSendBid(bidAmount);
                                        setShowBidModal(false);
                                        setMaxBidPrice("");
                                        setBidError("");
                                    } catch (err) {
                                        setBidError(
                                            err.message ||
                                                "Không thể gửi yêu cầu đấu giá",
                                        );
                                    }
                                }}
                                className="flex-1 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-500 hover:to-orange-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-amber-500/50 font-['Montserrat']"
                            >
                                Đặt giá
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Buy Now Confirmation Modal */}
            {showBuyNowModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
                    <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 rounded-2xl border border-slate-700/50 p-10 w-[480px] shadow-2xl shadow-red-500/20 backdrop-blur-xl relative overflow-hidden">
                        {/* Decorative corners */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 to-transparent rounded-bl-full"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-red-500/20 to-transparent rounded-tr-full"></div>

                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-500 mb-6 font-['Playfair_Display'] relative z-10">
                            Xác nhận mua ngay
                        </h2>
                        <div className="mb-8 p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-xl border border-slate-700/50 relative z-10">
                            <p className="text-gray-400 text-sm mb-2 font-['Montserrat']">
                                Sản phẩm
                            </p>
                            <p className="text-white font-semibold mb-6 text-lg font-['Montserrat']">
                                {product.productName}
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-gray-400 text-sm mb-2 font-['Montserrat']">
                                        Giá mua ngay
                                    </p>
                                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-500 font-bold text-xl font-['Montserrat']">
                                        {formatters.formatCurrency(
                                            product.buyNowPrice,
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-2 font-['Montserrat']">
                                        Giá hiện tại
                                    </p>
                                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-bold text-xl font-['Montserrat']">
                                        {formatters.formatCurrency(
                                            product.currentPrice,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8 p-5 bg-gradient-to-r from-red-900/30 via-orange-900/20 to-red-900/30 border border-red-500/50 rounded-xl relative z-10">
                            <p className="text-red-200 text-sm font-['Montserrat'] flex items-start gap-2">
                                <i
                                    className="fa-solid fa-exclamation-circle mt-0.5"
                                    style={{ color: "#f87171" }}
                                ></i>
                                <span>
                                    Phiên đấu giá sẽ kết thúc ngay lập tức và
                                    bạn sẽ trở thành người chiến thắng.
                                </span>
                            </p>
                        </div>

                        {buyNowError && (
                            <div className="mb-6 p-4 bg-gradient-to-r from-red-900/40 via-red-800/30 to-red-900/40 border border-red-500/50 rounded-xl animate-slide-in-up relative z-10">
                                <p className="text-red-300 text-sm font-['Montserrat']">
                                    {buyNowError}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-4 relative z-10">
                            <button
                                onClick={() => {
                                    setShowBuyNowModal(false);
                                    setBuyNowError("");
                                }}
                                disabled={buyNowLoading}
                                className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-['Montserrat']"
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
                                className="flex-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed font-['Montserrat']"
                            >
                                {buyNowLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg
                                            className="animate-spin h-5 w-5"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Đang xử lý...
                                    </span>
                                ) : (
                                    "Mua ngay"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
