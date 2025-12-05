// Decode JWT token
export const decodeToken = (token) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(
                    (c) =>
                        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2),
                )
                .join(""),
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

// Kiểm tra token có hết hạn không
export const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
        return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
};

// Lấy thời gian còn lại của token (tính bằng giây)
export const getTokenExpiresIn = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
        return 0;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const secondsLeft = decoded.exp - currentTime;
    return Math.max(0, secondsLeft);
};

// Format thời gian còn lại thành chuỗi dễ đọc
export const formatTokenExpiration = (token) => {
    const secondsLeft = getTokenExpiresIn(token);

    if (secondsLeft <= 0) {
        return "Hết hạn";
    }

    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m còn lại`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s còn lại`;
    } else {
        return `${seconds}s còn lại`;
    }
};

// Lấy tất cả thông tin token
export const getTokenInfo = (token) => {
    const decoded = decodeToken(token);
    if (!decoded) {
        return null;
    }

    const expiresIn = getTokenExpiresIn(token);
    const isExpired = isTokenExpired(token);

    return {
        ...decoded,
        expiresIn,
        isExpired,
        formattedExpiration: formatTokenExpiration(token),
    };
};
