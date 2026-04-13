import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Info,
  TriangleAlert,
  XCircle,
  ChevronDown,
  XIcon,
} from "lucide-react";
import { ROUTES } from "../../constants/routes";
import helpers from "../../utils/helpers";
import formatters from "../../utils/formatters";
import ProductCard from "../../components/ProductCard_LessInfo";
import { X } from "lucide-react";
import productService from "../../services/productService";
import bidService from "../../services/bidService";
import favouriteService from "../../services/favouriteService";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useAuction } from "../../hooks/useAuction";
import { useBid } from "../../hooks/useBid";
import { useQnA } from "../../hooks/useQnA";
import { useAuth } from "../../hooks/useAuth";
import { usePrivateNotification } from "../../hooks/usePrivateNotification";
import auctionService from "../../services/auctionService";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [qnaData, setQnaData] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [hoveredImage, setHoveredImage] = useState({
    idx: null,
    image: null,
  });
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
  const [questionText, setQuestionText] = useState("");
  const [answerTexts, setAnswerTexts] = useState({});
  const [showBidderDetailModal, setShowBidderDetailModal] = useState(false);
  const [selectedBidder, setSelectedBidder] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  const [blockLoading, setBlockLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showBlockedNotificationModal, setShowBlockedNotificationModal] =
    useState(false);
  const [blockedReason, setBlockedReason] = useState("");
  const [isBidDropdownOpen, setIsBidDropdownOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isDescriptionClamped, setIsDescriptionClamped] = useState(false);
  const [isFloatNotificationVisible, setIsFloatNotificationVisible] =
    useState(true);

  const bidDropdownRef = useRef(null);
  const descriptionRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useAuth();

  const isCurrentUserSeller = useMemo(
    () => isAuthenticated && user.userId === product?.seller?.userId,
    [isAuthenticated, user, product],
  );
  const isCurrentUserWinner = useMemo(
    () =>
      isAuthenticated &&
      !product?.isActive &&
      product?.highestBidder?.userId === user.userId,
    [isAuthenticated, user, product],
  );

  const handleBuyNowAction = async () => {
    setTimeout(async () => {
      try {
        await productService.buyNowProduct(productId);
        setShowBuyNowModal(false);

        // Reload product info
        const updatedProduct = await productService.getProductById(productId);
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

  // Handle click on bid history row to show bidder details
  const handleBidderClick = (bidder) => {
    if (!isCurrentUserSeller) return;
    setSelectedBidder(bidder);
    setBlockReason("");
    setShowBidderDetailModal(true);
  };

  // Handle block bidder
  const handleBlockBidder = async () => {
    if (!selectedBidder) {
      return;
    }

    setBlockLoading(true);
    try {
      await auctionService.blockBidder(
        productId,
        selectedBidder.userId,
        blockReason,
      );

      // Refresh product data
      const updatedProduct = await productService.getProductById(productId);
      setProduct(updatedProduct);
      console.log("Updated product after blocking bidder:", updatedProduct);

      // Refresh bid history
      const history = await productService.getBidHistory(productId);
      setBidHistory(history);

      setNotification({
        message: `Đã chặn bidder ${selectedBidder.fullName} thành công`,
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);

      setShowBidderDetailModal(false);
      setSelectedBidder(null);
      setBlockReason("");
    } catch (error) {
      console.error("Failed to block bidder:", error);
      setNotification({
        message: error.message || "Không thể chặn bidder. Vui lòng thử lại.",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setBlockLoading(false);
    }
  };

  // Check eligibility to place bid
  useEffect(() => {
    const fetchEligibility = async () => {
      if (!isAuthenticated || !product || product.allowUnderratedBidder) return;

      try {
        const isEligible = await productService.checkBiddingEligibility(
          product.productId,
        );
        setIsEligible(isEligible);
      } catch (error) {
        console.error("Failed to check bidding eligibility:", error);
      }
    };

    fetchEligibility();
  }, [isAuthenticated, product]);

  // Check if description is clamped
  useEffect(() => {
    if (descriptionRef.current && product) {
      const maxHeight = 3 * 24;
      const actualHeight = descriptionRef.current.scrollHeight;
      setIsDescriptionClamped(actualHeight > maxHeight + 10);
    }
  }, [product]);

  // Check if current user is blocked from bidding
  useEffect(() => {
    const checkBlockingStatus = async () => {
      if (!isAuthenticated || !productId || isCurrentUserSeller) return;

      try {
        const blocked = await auctionService.checkBlocking(productId);
        setIsBlocked(blocked);
      } catch (error) {
        console.error("Failed to check blocking status:", error);
      }
    };

    checkBlockingStatus();
  }, [isAuthenticated, productId, isCurrentUserSeller]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // WebSocket connection
  const { connected, unsubscribeFromProduct } = useWebSocket();

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

  const handleBlockedNotification = useCallback(
    (reason) => {
      setBlockedReason(reason);
      setIsBlocked(true);
      setShowBlockedNotificationModal(true);

      const fetchUpdatedData = async () => {
        // Wait backend to commit transaction
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
          // Refresh product data
          const updatedProduct = await productService.getProductById(productId);
          setProduct(updatedProduct);
          console.log(
            "Updated product after blocked notification:",
            updatedProduct,
          );

          // Refresh bid history
          const history = await productService.getBidHistory(productId);
          setBidHistory(history);
        } catch (error) {
          console.error("Failed to fetch updated data:", error);
        }
      };
      fetchUpdatedData();
    },
    [productId],
  );

  // Private notification hook
  usePrivateNotification(connected, user?.userId, handleBlockedNotification);

  // Fetch product details
  useEffect(() => {
    setIsFloatNotificationVisible(true);
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productData, bidsData, qnaData, relatedProductsData] =
          await Promise.all([
            productService.getProductById(productId),
            productService.getBidHistory(productId),
            productService.getProductQnA(productId),
            productService.getRelatedProducts(productId),
          ]);
        setProduct(productData);
        setIsAuctionEnded(!productData.isActive);
        setBidHistory(Array.isArray(bidsData) ? bidsData : []);
        setQnaData(Array.isArray(qnaData) ? qnaData : []);
        setRelatedProducts(
          Array.isArray(relatedProductsData) ? relatedProductsData : [],
        );
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Không thể tải chi tiết sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    const fetchFavoritedStatus = async () => {
      if (isAuthenticated) {
        try {
          const isFavorited = await favouriteService.isInFavourites(productId);
          setIsFavorited(isFavorited);
        } catch (err) {
          console.error("Failed to fetch favorited status:", err);
        }
      }
    };

    fetchProduct();
    fetchFavoritedStatus();

    return () => {
      unsubscribeFromProduct(productId);
    };
  }, [isAuthenticated, productId, unsubscribeFromProduct]);

  const [, setTimerTick] = useState(0);

  // Re-render to update remaining time every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimerTick((prev) => prev + 1);
    }, 30000);
    return () => clearInterval(intervalId);
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
    ...(Array.isArray(product.auxiliaryImages)
      ? product.auxiliaryImages.map((img) => img?.imageUrl).filter(Boolean)
      : []),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-12">
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

      {/* Auction Ended - Floating Notification (Seller or Winner Only) */}
      {isAuctionEnded && (isCurrentUserSeller || isCurrentUserWinner) && (
        <div
          className={`fixed top-26 right-16 z-40 ${
            isFloatNotificationVisible
              ? "animate-slide-down"
              : "animate-slide-down-reverse pointer-events-none"
          }`}
        >
          <div className="floating-notification bg-gradient-to-br from-amber-950/90 via-orange-950/80 to-amber-950/90 border-2 border-amber-800 glow-border rounded-2xl p-6 backdrop-blur-xl shadow-2xl max-w-sm w-80 relative overflow-hidden">
            {/* Decorative gradient background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-bl-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-500/15 to-transparent rounded-tr-full pointer-events-none"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header with icon */}
              <div className="flex items-center gap-3 mb-4">
                <p className="text-sm font-black text-amber-200 font-['Montserrat'] tracking-wide">
                  ĐẤU GIÁ ĐÃ KẾT THÚC
                </p>
                <XIcon
                  className="absolute top-0 right-0 w-6 h-6 text-amber-300 cursor-pointer"
                  onClick={() => setIsFloatNotificationVisible(false)}
                />
              </div>

              {/* Message */}
              <p className="text-slate-200 text-sm mb-6 font-['Montserrat'] leading-relaxed">
                {isCurrentUserWinner
                  ? "Bạn là người thắng cuộc! Hãy hoàn tất đơn hàng để kết thúc giao dịch."
                  : "Sản phẩm đã kết thúc. Hãy hoàn tất đơn hàng để kết thúc giao dịch."}
              </p>

              {/* Action Button */}
              <button
                onClick={() =>
                  navigate(
                    `${ROUTES.PRODUCT}/${product.productId}/order-completion`,
                    {
                      state: {
                        productId: product.productId,
                        productName: product.productName,
                        price: product.currentPrice,
                        userRole: isCurrentUserWinner ? "buyer" : "seller",
                      },
                    },
                  )
                }
                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:via-orange-400 hover:to-amber-400 text-white font-bold py-3 px-4 rounded-xl shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-all duration-300 hover:scale-105 border border-amber-300/30 font-['Montserrat'] text-sm tracking-wide flex items-center justify-center gap-2"
              >
                Hoàn Tất Đơn Hàng
              </button>
            </div>
          </div>
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
                src={hoveredImage?.image || product.mainImageUrl || null}
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
                    onMouseEnter={() => setHoveredImage({ idx, image })}
                    onMouseLeave={() => setHoveredImage(null)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 
                                            ${
                                              hoveredImage?.idx === idx
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
            <div className=" bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 px-8 py-8 border border-slate-700/50 rounded-2xl flex flex-col backdrop-blur-xl shadow-2xl shadow-amber-500/10 relative overflow-hidden hover:shadow-amber-500/20 transition-all duration-300">
              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-br-full"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-orange-500/10 to-transparent rounded-tl-full"></div>

              {!isCurrentUserSeller && (
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate(ROUTES.LOGIN, {
                        state: {
                          returnUrl: location.pathname + location.search,
                        },
                      });
                      return;
                    }
                    handleClickFavoriteProduct(product.productId, !isFavorited);
                    setIsFavorited(!isFavorited);
                  }}
                  className="absolute top-8 right-8 text-3xl transition-all hover:scale-125 duration-500 z-50 cursor-pointer"
                >
                  <i
                    className={
                      isFavorited ? "fa-solid fa-heart" : "fa-regular fa-heart"
                    }
                    style={{
                      color: isFavorited ? "#fb923c" : "#94a3b8",
                    }}
                  ></i>
                </button>
              )}

              <div className="mb-8 pr-16 relative z-10">
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
                  {formatters.formatCurrency(product.currentPrice)}
                </p>
              </div>
              <div className="mb-8 relative z-10">
                <p className="text-gray-300 mb-1 font-['Montserrat']">
                  Giá mua ngay:{" "}
                  <span className="font-bold text-red-400">
                    {product.buyNowPrice ? (
                      formatters.formatCurrency(product.buyNowPrice)
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
                {!isAuthenticated ? (
                  <>
                    <Link
                      to={ROUTES.LOGIN}
                      state={{ returnUrl: location.pathname + location.search }}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 px-6 rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 font-['Montserrat'] border border-blue-400/20 mx-auto"
                    >
                      Đăng nhập để đặt giá
                    </Link>
                  </>
                ) : isBlocked ? (
                  <div className="flex-1 p-4 bg-gradient-to-r from-red-900/30 via-orange-900/20 to-red-900/30 border border-red-500/50 rounded-xl">
                    <p className="text-red-200 font-semibold font-['Montserrat'] flex justify-center text-center gap-2">
                      Bạn không thể đấu giá sản phẩm này
                    </p>
                  </div>
                ) : isCurrentUserSeller ? (
                  <div className="flex-1 p-4 bg-gradient-to-r from-slate-900/80 to-slate-800/60 border border-slate-700/50 rounded-xl">
                    <p className="text-gray-400 font-semibold font-['Montserrat'] flex justify-center text-center gap-2">
                      Bạn là người bán sản phẩm này
                    </p>
                  </div>
                ) : !isEligible ? (
                  <div className="flex-1 p-4 bg-gradient-to-r from-amber-900/30 via-orange-600/20 to-amber-900/30 border border-amber-500/50 rounded-xl">
                    <p className="text-amber-200 font-semibold font-['Montserrat'] flex justify-center text-center gap-2">
                      Bạn không đủ điều kiện để đặt giá
                    </p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        if (product.buyNowPrice && isEligible) {
                          setShowBuyNowModal(true);
                        }
                      }}
                      disabled={
                        (!product.buyNowPrice || !isEligible) && isAuthenticated
                      }
                      className={`flex-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-400 text-white font-bold py-4 px-6 rounded-xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 font-['Montserrat'] border border-red-400/20 ${
                        (!product.buyNowPrice || !isEligible) && isAuthenticated
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
                        if (connected && isEligible) {
                          setShowBidModal(true);
                        }
                      }}
                      disabled={(!connected || !isEligible) && isAuthenticated}
                      className={`flex-1 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-500 hover:to-orange-400 text-white font-bold py-4 px-6 rounded-xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 font-['Montserrat'] border border-amber-400/20 ${
                        (!connected || !isEligible) && isAuthenticated
                          ? "opacity-40 cursor-not-allowed grayscale"
                          : ""
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        Đặt giá tối đa
                      </span>
                    </button>
                  </>
                )}
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
                  {formatters.getRelativeTime(product.endTime)}
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
                  {helpers.maskName(product.highestBidder.fullName)}
                </p>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${
                        i <
                        helpers.getRatingStars(
                          product.highestBidder.ratingScore,
                          product.highestBidder.ratingCount,
                        )
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-700"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span>•</span>
                  <span className="text-sm text-amber-400 font-semibold">
                    {product.highestBidder.ratingScore}
                  </span>
                  <span className="text-sm text-gray-300 font-['Montserrat']">
                    ({product.highestBidder.ratingCount} đánh giá)
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
                      <th className="px-4 py-4">Thời gian</th>
                      <th className="px-4 py-4">Người ra giá</th>
                      <th className="px-11">Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bidHistory.length > 0 ? (
                      bidHistory.map((bid, index) => (
                        <tr
                          key={index}
                          onClick={() => handleBidderClick(bid.bidder)}
                          className={`border-b border-slate-700/50 transition-colors duration-200 ${
                            index === 0
                              ? "animate-slide-in-up bg-amber-900/20 hover:bg-amber-900/50"
                              : "hover:bg-slate-700/20"
                          } ${isCurrentUserSeller ? "cursor-pointer" : ""}`}
                        >
                          <td className="px-4 py-5 text-gray-300">
                            {new Date(bid.bidAt).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="px-4 py-3 font-medium text-white">
                            {helpers.maskName(bid.bidder.fullName)}
                          </td>
                          <td className="px-4 py-3 text-right text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-bold text-base">
                            {formatters.formatCurrency(bid.bidPrice)}
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
                  <span>•</span>
                  <span className="text-sm text-amber-400 font-semibold">
                    {product.seller.ratingScore}
                  </span>
                  <Link
                    to={`${ROUTES.PROFILE}/rating`}
                    state={{
                      userId: product.seller.userId,
                      fullName: product.seller.fullName,
                    }}
                    className="text-sm text-gray-300 font-['Montserrat'] gap-1 flex items-center"
                  >
                    <span>(</span>
                    <span className="underline hover:text-amber-400 transition-all duration-300">
                      {product.seller.ratingCount} đánh giá
                    </span>
                    <span>)</span>
                  </Link>
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
            <div
              ref={descriptionRef}
              className="text-gray-200 whitespace-pre-line leading-relaxed font-['Montserrat'] relative z-10 prose prose-sm prose-invert max-w-none line-clamp-3"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
            {isDescriptionClamped && (
              <div className="mt-4 flex items-center gap-2 relative z-10">
                <button
                  onClick={() => setIsDescriptionModalOpen(true)}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors duration-200 text-sm"
                >
                  Xem thêm
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description Modal */}
        {isDescriptionModalOpen && product && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl w-full max-w-xl max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-700">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-10 py-6 flex items-center justify-between sticky top-0 z-10">
                <h3 className="text-2xl font-bold text-white">
                  Mô tả chi tiết
                </h3>
                <button
                  onClick={() => setIsDescriptionModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-10 overflow-y-auto max-h-[calc(80vh-80px)] relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-tr-full"></div>
                <div
                  className="prose prose-sm prose-invert max-w-none text-gray-200 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>
          </div>
        )}

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
                  onChange={(e) => setQuestionText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!questionText.trim()) {
                        setNotification({
                          message: "Vui lòng nhập câu hỏi",
                          type: "warning",
                        });
                      } else {
                        try {
                          askQuestion(user.userId, productId, questionText);
                          setQuestionText("");
                        } catch (err) {
                          setNotification({
                            message: err.message,
                            type: "warning",
                          });
                        }
                      }
                      setTimeout(() => setNotification(null), 3000);
                    }
                  }}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-slate-800/80 to-slate-900/60 text-white border border-slate-600/50 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all font-['Montserrat'] placeholder:text-gray-500"
                />
                <button
                  onClick={() => {
                    if (!questionText.trim()) {
                      setNotification({
                        message: "Vui lòng nhập câu hỏi",
                        type: "warning",
                      });
                    } else {
                      try {
                        askQuestion(user.userId, productId, questionText);
                        setQuestionText("");
                      } catch (err) {
                        setNotification({
                          message: err.message,
                          type: "warning",
                        });
                      }
                    }
                    setTimeout(() => setNotification(null), 3000);
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
                        {new Date(qa.questionAt).toLocaleDateString("vi-VN")}
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
                              {answer.answerUser.fullName}
                            </span>
                            <span className="text-xs text-gray-400 font-['Montserrat']">
                              {new Date(answer.answerAt).toLocaleDateString(
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
                          value={answerTexts[qa.questionId] || ""}
                          onChange={(e) =>
                            setAnswerTexts({
                              ...answerTexts,
                              [qa.questionId]: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              const answerText = answerTexts[qa.questionId];
                              if (!answerText || !answerText.trim()) {
                                setNotification({
                                  message: "Vui lòng nhập câu trả lời",
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
                                    [qa.questionId]: "",
                                  });
                                } catch (err) {
                                  setNotification({
                                    message: err.message,
                                    type: "warning",
                                  });
                                }
                              }
                              setTimeout(() => setNotification(null), 3000);
                            }
                          }}
                          placeholder="Nhập câu trả lời..."
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-slate-800/80 to-slate-900/60 text-white border border-slate-600/50 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none text-sm font-['Montserrat'] placeholder:text-gray-500 transition-all"
                        />
                        <button
                          onClick={() => {
                            const answerText = answerTexts[qa.questionId];
                            if (!answerText || !answerText.trim()) {
                              setNotification({
                                message: "Vui lòng nhập câu trả lời",
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
                                  [qa.questionId]: "",
                                });
                              } catch (err) {
                                setNotification({
                                  message: err.message,
                                  type: "warning",
                                });
                              }
                            }
                            setTimeout(() => setNotification(null), 3000);
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
                    {formatters.formatCurrency(product.currentPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2 font-['Montserrat']">
                    Bước giá
                  </p>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-bold text-xl font-['Montserrat']">
                    {formatters.formatCurrency(product.priceStep)}
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
                  onClick={() => setIsBidDropdownOpen(!isBidDropdownOpen)}
                  className="w-full px-5 py-4 bg-gradient-to-r from-slate-800/80 to-slate-900/60 text-white border border-slate-600/50 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition font-['Montserrat'] font-semibold text-lg flex items-center justify-between cursor-pointer hover:border-amber-500/50"
                >
                  <span
                    className={maxBidPrice ? "text-white" : "text-gray-500"}
                  >
                    {maxBidPrice
                      ? formatters.formatCurrency(parseFloat(maxBidPrice))
                      : "-- Chọn giá --"}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-amber-400 transition-transform duration-300 ${
                      isBidDropdownOpen ? "rotate-180" : ""
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
                        product.currentPrice + (i + 1) * product.priceStep;
                      return (
                        <li
                          key={i}
                          onClick={() => {
                            setMaxBidPrice(price.toString());
                            setBidError("");
                            setIsBidDropdownOpen(false);
                          }}
                          className={`px-5 py-3 cursor-pointer transition-all duration-200 font-semibold font-['Montserrat'] ${
                            maxBidPrice === price.toString()
                              ? "bg-gradient-to-r from-amber-600/30 to-orange-600/30 text-amber-400 border-l-4 border-amber-500"
                              : "text-slate-300 hover:bg-slate-700/50 hover:text-amber-400 hover:border-l-4 hover:border-amber-500/50"
                          }`}
                        >
                          {formatters.formatCurrency(price)}
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
                <span>
                  Hệ thống sẽ tự động tăng giá theo các mức tăng để giúp bạn
                  thắng đấu giá.
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
                  if (product.buyNowPrice && bidAmount >= product.buyNowPrice) {
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
                    setBidError(err.message || "Không thể gửi yêu cầu đấu giá");
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
            {/* Background Decoration */}
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
                    {formatters.formatCurrency(product.buyNowPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2 font-['Montserrat']">
                    Giá hiện tại
                  </p>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-bold text-xl font-['Montserrat']">
                    {formatters.formatCurrency(product.currentPrice)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 p-5 bg-gradient-to-r from-red-900/30 via-orange-900/20 to-red-900/30 border border-red-500/50 rounded-xl relative z-10">
              <p className="text-red-200 text-sm font-['Montserrat'] flex items-start gap-2">
                <span>
                  Phiên đấu giá sẽ kết thúc ngay lập tức và bạn sẽ trở thành
                  người chiến thắng.
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
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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

      {/* Bidder Detail Modal (for Seller) */}
      {showBidderDetailModal && selectedBidder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 rounded-3xl p-10 max-w-lg w-full mx-4 border border-slate-700/50 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-tr-full"></div>

            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-6 font-['Playfair_Display'] relative z-10">
              Thông tin người ra giá
            </h2>

            <div className="mb-6 p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-xl border border-slate-700/50 relative z-10">
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2 font-['Montserrat']">
                  Họ và tên
                </p>
                <p className="text-white font-semibold text-lg font-['Montserrat']">
                  {selectedBidder.fullName}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2 font-['Montserrat']">
                  Email
                </p>
                <p className="text-white font-semibold text-lg font-['Montserrat']">
                  {selectedBidder.email}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider font-['Montserrat']">
                    Đánh giá
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${
                          i <
                          helpers.getRatingStars(
                            selectedBidder.ratingScore,
                            selectedBidder.ratingCount,
                          )
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-700"
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-amber-400 font-bold font-['Montserrat']">
                      {selectedBidder.ratingScore}
                    </span>
                    <Link
                      to={`${ROUTES.PROFILE}/rating`}
                      state={{
                        userId: selectedBidder.userId,
                        fullName: selectedBidder.fullName,
                      }}
                      className="text-sm text-gray-400 font-['Montserrat'] gap-1 flex items-center"
                    >
                      <span>(</span>
                      <span className="underline hover:text-amber-400 transition-all duration-300">
                        {selectedBidder.ratingCount} đánh giá
                      </span>
                      <span>)</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4 relative z-10">
              <label
                htmlFor="blockReason"
                className="block text-slate-300 text-sm font-bold mb-2 uppercase tracking-wider"
              >
                Lý do chặn
              </label>
              <textarea
                id="blockReason"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Nhập lý do chặn người dùng này..."
                rows="3"
                className="w-full px-4 py-3 bg-slate-800/50 text-slate-100 font-semibold border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 placeholder-slate-500 backdrop-blur-sm resize-none"
              />
            </div>

            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-900/30 via-orange-900/20 to-yellow-900/30 border border-yellow-500/50 rounded-xl relative z-10">
              <p className="text-sm text-amber-300 font-semibold">
                Lưu ý: Người dùng này sẽ không được phép đấu giá sản phẩm này
                nữa. Nếu đây là người đặt giá cao nhất, sản phẩm sẽ chuyển cho
                người có giá cao thứ hai.
              </p>
            </div>

            <div className="flex gap-4 relative z-10">
              <button
                onClick={() => {
                  setShowBidderDetailModal(false);
                  setSelectedBidder(null);
                  setBlockReason("");
                }}
                disabled={blockLoading}
                className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-['Montserrat']"
              >
                Hủy
              </button>
              <button
                onClick={handleBlockBidder}
                disabled={blockLoading}
                className="flex-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed font-['Montserrat']"
              >
                {blockLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                  "Chặn người dùng"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blocked Notification Modal (for Bidder) */}
      {showBlockedNotificationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 rounded-3xl p-10 max-w-lg w-full mx-4 border border-red-700/50 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-red-500/20 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-tr-full"></div>

            <div className="text-center mb-6 relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-full mb-4 shadow-lg shadow-red-500/50">
                <i
                  className="fa-solid fa-ban text-white text-3xl"
                  style={{ color: "#ffffff" }}
                ></i>
              </div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 mb-3 font-['Playfair_Display']">
                Bạn đã bị chặn
              </h2>
              <p className="text-gray-300 font-['Montserrat']">
                Bạn không thể đấu giá sản phẩm này nữa
              </p>
            </div>

            {blockedReason && (
              <div className="mb-6 p-6 bg-gradient-to-br from-red-900/30 to-orange-900/20 rounded-xl border border-red-500/50 relative z-10">
                <p className="text-gray-400 text-sm mb-2 font-['Montserrat']">
                  Lý do
                </p>
                <p className="text-red-200 font-semibold text-base font-['Montserrat']">
                  {blockedReason}
                </p>
              </div>
            )}

            <button
              onClick={() => {
                setShowBlockedNotificationModal(false);
                setBlockedReason("");
              }}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-['Montserrat']"
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
