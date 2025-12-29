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

    if (ctx.type === "ORDER") {
      navigate(
        `/products/${ctx.productId}/order-completion${location.search}`,
        { replace: true, state: ctx }
      );
      return;
    }

    if (ctx.type === "UPGRADE") {
      sessionStorage.setItem("sellerUpgradePaid", "true");
      navigate("/upgrade-to-seller", { replace: true });
      return;
    }

  }, [location.search, navigate]);

  return null;
};

export default PaymentResultRedirect;
