import { useState, useCallback, useMemo } from "react";
import bidService from "../services/bidService";

/**
 * Hook quản lý luồng nâng cấp Seller
 * - Không sử dụng sessionStorage
 * - State machine: LOADING → IDLE → PAYMENT → SUCCESS
 */
const useUpgradeSeller = () => {
  // State chính
  const [state, setState] = useState("LOADING");
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [error, setError] = useState(null);
  const [upgradeStatus, setUpgradeStatus] = useState("NONE");

  // Lưu payment data trong memory (không sessionStorage)
  const [paymentData, setPaymentData] = useState(null);

  // Plans định nghĩa
  const plans = useMemo(() => {
    return {
      basic: {
        name: "Gói Cơ Bản",
        price: 99000,
        duration: 7,
        features: [
          "Quyền đăng 10 sản phẩm mỗi tuần",
          "Hỗ trợ khách hàng 24/7",
          "Huy hiệu Seller",
          "Rating và review từ khách hàng",
        ],
      },
      premium: {
        name: "Gói Premium",
        price: 199000,
        duration: 30,
        features: [
          "Quyền đăng 50 sản phẩm mỗi tuần",
          "Hỗ trợ ưu tiên 24/7",
          "Huy hiệu Seller Premier",
          "Analytics bán hàng chi tiết",
          "Công cụ quản lý hàng loạt",
        ],
      },
    };
  }, []);

  /**
   * Fetch trạng thái upgrade hiện tại từ backend
   */
  const fetchUpgradeStatus = useCallback(async () => {
    try {
      const res = await bidService.getSellerUpgradeStatus();
      setUpgradeStatus(res.status); // PENDING | APPROVED | REJECTED
      return res.status;
    } catch (err) {
      if (err?.status === 404) {
        setUpgradeStatus("NONE");
        return "NONE";
      }
      console.error("Check upgrade status failed", err);
      throw err;
    }
  }, []);

  /**
   * Khởi tạo - kiểm tra trạng thái upgrade hiện tại
   */
  const initialize = useCallback(async () => {
    try {
      setState("LOADING");
      await fetchUpgradeStatus();
      setState("IDLE");
    } catch (err) {
      console.error("Initialize upgrade status failed", err);
      setError("Không thể kiểm tra trạng thái nâng cấp");
      setState("IDLE");
    }
  }, [fetchUpgradeStatus]);

  /**
   * Chọn plan
   */
  const handleSelectPlan = useCallback((plan) => {
    setSelectedPlan(plan);
  }, []);

  /**
   * User chọn gói và nhấn "Thanh toán"
   * -> Lưu payment data và chuyển sang state PAYMENT
   */
  const startPayment = useCallback(
    (plan) => {
      const currentPlan = plans[plan];
      const payload = {
        type: "UPGRADE",
        plan,
        price: currentPlan.price,
        name: currentPlan.name,
        createdAt: new Date().toISOString(),
      };

      setSelectedPlan(plan);
      setPaymentData(payload);
      setState("PAYMENT");
    },
    [plans],
  );

  /**
   * MoMo callback về
   * -> Kiểm tra params từ URL (resultCode=0 = thanh toán thành công)
   * -> Tạo upgrade request
   */
  const handlePaymentSuccess = useCallback(async () => {
    if (!paymentData) {
      setError("Không tìm thấy thông tin thanh toán");
      setState("IDLE");
      return;
    }

    try {
      setError(null);

      // Tạo seller upgrade request trên backend
      await bidService.createSellerUpgradeRequest();

      // Fetch lại trạng thái - sẽ thay đổi từ NONE → PENDING
      const status = await fetchUpgradeStatus();

      // Nếu thành công, chuyển sang SUCCESS
      setState("SUCCESS");
      setPaymentData(null);

      return status;
    } catch (err) {
      console.error("Create upgrade request failed", err);
      setError(err?.message || "Không thể tạo yêu cầu nâng cấp");
      setState("IDLE");
      throw err;
    }
  }, [paymentData, fetchUpgradeStatus]);

  /**
   * Xử lý khi thanh toán bị từ chối hoặc lỗi
   */
  const handlePaymentError = useCallback((errorMessage) => {
    setError(errorMessage);
    setState("IDLE");
    setPaymentData(null);
  }, []);

  /**
   * Quay lại IDLE state (user cancel)
   */
  const reset = useCallback(() => {
    setState("IDLE");
    setError(null);
    setPaymentData(null);
  }, []);

  /**
   * Gửi lại yêu cầu (trong trường hợp bị REJECTED)
   */
  const retryRequest = useCallback(() => {
    setUpgradeStatus("NONE");
    setState("IDLE");
    setError(null);
  }, []);

  return {
    state, // LOADING | IDLE | PAYMENT | SUCCESS
    selectedPlan,
    upgradeStatus, // NONE | PENDING | APPROVED | REJECTED
    error,
    paymentData,
    plans,
    currentPlan: plans[selectedPlan],

    // Methods
    initialize,
    handleSelectPlan,
    startPayment, // Bắt đầu thanh toán
    handlePaymentSuccess, // Callback khi MoMo thanh toán thành công
    handlePaymentError,
    reset,
    retryRequest,
    fetchUpgradeStatus,
  };
};

export default useUpgradeSeller;
