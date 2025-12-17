const formatters = {
  // Format currency
  formatCurrency: (amount, currency = "VND") => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
    }).format(amount);
  },

  // Format date
  formatDate: (date, format = "vi-VN") => {
    return new Intl.DateTimeFormat(format, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  },

  // Format datetime
  formatDateTime: (date, format = "vi-VN") => {
    return new Intl.DateTimeFormat(format, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  },

  // Calculate time left details
  getRemainingTimeDetails: (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  },

  // Calculate time left
  getRemainingTime: (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff < 0) return "Đã kết thúc";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    if (days > 0) return `${days} ngày`;
    if (hours > 0) return `${hours} giờ`;
    return `${minutes} phút`;
  },

  // Calculate relative time (for < 3 days)
  getRelativeTime: (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff < 0) return "Đã kết thúc";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    let endTimeFormatted;
    if (days > 3) {
      endTimeFormatted = formatters.formatDate(endTime);
    } else {
      if (days > 0) {
        endTimeFormatted = `${days} ngày`;
      } else if (hours > 0) {
        endTimeFormatted = `${hours} giờ`;
      } else if (minutes >= 0) {
        if (minutes === 0) {
          return "Dưới 1 phút nữa";
        }
        endTimeFormatted = `${minutes} phút`;
      }
      endTimeFormatted += " nữa";
    }

    return endTimeFormatted;
  },

  // Viết hàm lấy ra thời gian tương đối từ thời gian tin nhắn cuối cùng được gửi tới hiện tại
  // Dưới 1 ngày: hiển thị giờ:phút
  // Dưới 1 tuần: hiển thị thứ
  // Còn lại hiển thị ngày tháng (dd thg mm)
  getRelativeTimeFromNow: (pastTime) => {
    const now = new Date();
    const past = new Date(pastTime);
    const diff = now - past;
    const oneDay = 1000 * 60 * 60 * 24;
    const oneWeek = oneDay * 7;

    if (diff < oneDay) {
      return past.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (diff < oneWeek) {
      return past.toLocaleDateString("vi-VN", { weekday: "long" });
    }
    return past.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  },
};

export default formatters;
