import toast from "react-hot-toast";

const toastStyles = {
  success: {
    background: "#064E3B",
    color: "#D1FAE5",
    border: "1px solid #10B981",
    padding: "12px 16px",
    maxWidth: "800px",
  },
  error: {
    background: "#7F1D1D",
    color: "#FEE2E2",
    border: "1px solid #EF4444",
    padding: "12px 16px",
    maxWidth: "800px",
  },
};

export const notify = {
  success: (message, duration = 2000) => {
    toast.success(message, {
      duration,
      style: toastStyles.success,
    });
  },
  error: (message, duration = 3000) => {
    toast.error(message, {
      duration,
      style: toastStyles.error,
    });
  },
};
