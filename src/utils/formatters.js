// Format currency
export const formatCurrency = (amount, currency = "VND") => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency,
    }).format(amount);
};

// Format date
export const formatDate = (date, format = "vi-VN") => {
    return new Intl.DateTimeFormat(format, {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(date));
};

// Format datetime
export const formatDateTime = (date, format = "vi-VN") => {
    return new Intl.DateTimeFormat(format, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
};

// Calculate time remaining
export const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};
