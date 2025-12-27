import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentResultRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = JSON.parse(
      sessionStorage.getItem("paymentContext") || "null"
    );

    if (!ctx) {
      navigate("/user/profile", { replace: true });
      return;
    }

    sessionStorage.setItem("sellerUpgradePaid", "true");

    navigate("/upgrade-to-seller", { replace: true });
    
  }, [location.search, navigate]);

  return null;
};

export default PaymentResultRedirect;
