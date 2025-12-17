import { useEffect, useState } from "react";
import { getTokenExpiresIn, isTokenExpired } from "../utils/tokenUtils";

/**
 * Custom hook để theo dõi tình trạng token
 * @param {number} updateInterval - Khoảng thời gian cập nhật (ms), mặc định 5000ms
 * @returns {Object} - { isExpired, expiresIn, token }
 */
export const useTokenStatus = (updateInterval = 60000) => {
  const [tokenStatus, setTokenStatus] = useState(() => {
    const token = localStorage.getItem("accessToken");
    return {
      isExpired: token ? isTokenExpired(token) : true,
      expiresIn: token ? getTokenExpiresIn(token) : 0,
      token,
    };
  });

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const newStatus = {
          isExpired: token ? isTokenExpired(token) : true,
          expiresIn: token ? getTokenExpiresIn(token) : 0,
          token,
        };
        if (newStatus.isExpired !== tokenStatus.isExpired) {
          setTokenStatus(newStatus);
        }
      } else {
        setTokenStatus({
          isExpired: true,
          expiresIn: 0,
          token: null,
        });
      }
    };

    // Kiểm tra ngay lần đầu
    checkToken();

    // Thiết lập interval để kiểm tra định kỳ
    const interval = setInterval(checkToken, updateInterval);

    // Listener để lắng nghe thay đổi localStorage
    window.addEventListener("storage", checkToken);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkToken);
    };
  }, [tokenStatus.isExpired, updateInterval]);

  return tokenStatus;
};
