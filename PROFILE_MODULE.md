# Quản Lý Hồ Sơ Cá Nhân - User Profile Management

## 📋 Tổng Quan

Module quản lý hồ sơ cá nhân với UI hiện đại, đẹp mắt, sử dụng React Hook Form để xử lý form và validation.

## ✨ Tính Năng

### 1. **Sản Phẩm Đang Tham Gia Đấu Giá**

-   Xem danh sách sản phẩm đang tham gia
-   Hiển thị thông tin chi tiết: giá hiện tại, người đấu giá cao nhất, thời gian kết thúc
-   Click vào sản phẩm để xem chi tiết

**Endpoint**: `GET /api/user-profile/participating-products`

### 2. **Sản Phẩm Đã Thắng**

-   Xem danh sách sản phẩm đã thắng đấu giá
-   **Đánh giá người bán** với:
    -   Chọn số sao (1-5)
    -   Viết nhận xét (tối đa 1000 ký tự)
    -   Validation đầy đủ với react-hook-form

**Endpoints**:

-   `GET /api/user-profile/won-products`
-   `POST /api/user-profile/rating` - Đánh giá người bán

### 3. **Danh Sách Yêu Thích**

-   Xem sản phẩm đã lưu vào watchlist
-   Theo dõi các sản phẩm quan tâm

**Endpoint**: `GET /api/user-profile/watch-list`

### 4. **Đánh Giá Nhận Được**

-   Xem chi tiết các lượt đánh giá từ người khác
-   Hiển thị:
    -   Thông tin người đánh giá
    -   Số sao và nhận xét
    -   Sản phẩm liên quan
    -   Thời gian đánh giá

**Endpoint**: `GET /api/user-profile/rating`

### 5. **Cập Nhật Thông Tin Cá Nhân**

-   Đổi họ tên
-   Đổi email
-   Form validation đầy đủ

**Endpoint**: `PUT /api/user-profile/update` _(API chưa có, UI đã sẵn sàng)_

### 6. **Đổi Mật Khẩu**

-   Yêu cầu nhập mật khẩu cũ
-   Nhập mật khẩu mới
-   Xác nhận mật khẩu mới
-   Validation với react-hook-form

**Endpoint**: `PUT /api/user-profile/change-password` _(API chưa có, UI đã sẵn sàng)_

## 🎨 UI/UX Features

### Design System

-   **Gradient Colors**: Amber/Orange cho primary actions
-   **Shadows**: Soft shadows với hover effects
-   **Animations**: Smooth transitions, hover scales, fade-ins
-   **Responsive**: Mobile-first design với Tailwind CSS

### Components Highlights

1. **ProductCard** - Card sản phẩm với:

    - Badge trạng thái (Đang tham gia, Đã thắng, Yêu thích)
    - Hover effects với zoom hình ảnh
    - Gradient overlays
    - Thông tin đầy đủ về sản phẩm

2. **RatingCard** - Card đánh giá với:

    - Avatar người đánh giá
    - Rating stars component
    - Product info badge
    - Timeline với icons

3. **RatingModal** - Modal đánh giá với:

    - Interactive star rating (hover effects)
    - Real-time character count
    - Form validation với react-hook-form
    - Smooth animations

4. **ProfileEditForm** - Form cập nhật thông tin:
    - Input với icons
    - Real-time validation
    - Error messages
    - Loading states

## 📦 File Structure

```
src/
├── components/
│   ├── RatingStars.jsx              # Component hiển thị rating stars
│   └── profile/
│       ├── ProductCard.jsx          # Card hiển thị sản phẩm
│       ├── RatingCard.jsx           # Card hiển thị rating
│       ├── RatingModal.jsx          # Modal đánh giá người bán
│       └── ProfileEditForm.jsx      # Forms cập nhật profile & password
├── pages/
│   └── Profile.jsx                  # Trang profile chính
├── services/
│   └── userProfileService.js        # API service cho profile
└── constants/
    └── api.js                       # API endpoints
```

## 🚀 Sử Dụng

### 1. Truy cập trang Profile

```javascript
// Navigate to profile page
import { ROUTES } from "./constants/routes";

<Link to={ROUTES.PROFILE}>Hồ sơ của tôi</Link>;
```

### 2. Các Tab trong Profile

```javascript
// Tabs tự động load data khi switch
const tabs = [
    { id: "participating", label: "Đang tham gia" },
    { id: "won", label: "Đã thắng" },
    { id: "watchlist", label: "Yêu thích" },
    { id: "ratings", label: "Đánh giá" },
    { id: "settings", label: "Cài đặt" },
];
```

### 3. Đánh giá người bán

```javascript
// Click button "Đánh giá" trên sản phẩm đã thắng
// Modal sẽ hiện ra với form đánh giá

const handleRatingSubmit = async (ratingData) => {
    await userProfileService.createRating({
        productId: product.productId,
        ratingValue: 5, // 1-5
        comment: "Người bán tuyệt vời!",
    });
};
```

### 4. Cập nhật thông tin

```javascript
// Trong tab "Cài đặt"
const handleProfileUpdate = async (data) => {
    await userProfileService.updateProfile({
        fullName: data.fullName,
        email: data.email,
    });
};
```

## 🔧 React Hook Form Validation

### Profile Edit Form

```javascript
{
  fullName: {
    required: "Họ tên là bắt buộc",
    minLength: { value: 3, message: "Họ tên phải có ít nhất 3 ký tự" },
    maxLength: { value: 100, message: "Họ tên không được quá 100 ký tự" }
  },
  email: {
    required: "Email là bắt buộc",
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email không hợp lệ" }
  }
}
```

### Password Change Form

```javascript
{
  oldPassword: {
    required: "Vui lòng nhập mật khẩu hiện tại",
    minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
  },
  newPassword: {
    required: "Vui lòng nhập mật khẩu mới",
    minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
  },
  confirmPassword: {
    required: "Vui lòng xác nhận mật khẩu mới",
    validate: (value) => value === newPassword || "Mật khẩu xác nhận không khớp"
  }
}
```

### Rating Form

```javascript
{
  ratingValue: {
    required: "Vui lòng chọn số sao đánh giá",
    min: { value: 1, message: "Vui lòng chọn ít nhất 1 sao" }
  },
  comment: {
    maxLength: { value: 1000, message: "Nhận xét không được quá 1000 ký tự" }
  }
}
```

## 🎯 API Response Examples

### Participating/Won/WatchList Products

```json
[
    {
        "productId": 101,
        "productName": "iPhone 14 Pro Max",
        "mainImageUrl": "https://cdn.example.com/image.jpg",
        "category": { "categoryId": 2, "categoryName": "Điện thoại" },
        "seller": {
            "userId": 5,
            "fullName": "Nguyễn Văn A",
            "ratingScore": 98
        },
        "currentPrice": 18500000,
        "buyNowPrice": 22000000,
        "highestBidder": { "fullName": "Trần Thị B" },
        "endTime": "2024-07-05T18:30:00",
        "bidCount": 7
    }
]
```

### Ratings

```json
[
    {
        "ratingId": 1001,
        "product": { "productId": 200, "productName": "MacBook Pro" },
        "reviewer": {
            "fullName": "Phạm Văn C",
            "ratingScore": 95
        },
        "ratingValue": 5,
        "comment": "Khách hàng uy tín",
        "createdAt": "2024-06-29T14:30:00"
    }
]
```

## 🔐 Authentication

Tất cả endpoints yêu cầu JWT token trong header:

```javascript
Authorization: Bearer <access_token>
```

Service tự động thêm token vào request thông qua `apiClient.js`

## 💡 Tips

1. **Loading States**: Tất cả components đều có loading states
2. **Error Handling**: Error messages hiển thị user-friendly
3. **Empty States**: UI đẹp cho trường hợp không có data
4. **Responsive**: Test trên mobile, tablet, desktop
5. **Accessibility**: Form labels, aria-labels, keyboard navigation

## 🐛 Troubleshooting

### Modal không đóng sau submit

```javascript
// Đảm bảo gọi handleClose() sau khi submit thành công
await onSubmit(data);
handleClose(); // Reset form và đóng modal
```

### Form validation không hoạt động

```javascript
// Kiểm tra xem đã wrap form trong <form> tag
// và sử dụng handleSubmit từ useForm
<form onSubmit={handleSubmit(onSubmitForm)}>
```

## 📝 TODO

-   [ ] Thêm API thực tế cho update profile
-   [ ] Thêm API thực tế cho change password
-   [ ] Thêm upload avatar
-   [ ] Thêm pagination cho danh sách sản phẩm
-   [ ] Thêm filter và search
-   [ ] Thêm export ratings to PDF

## 🎉 Demo

Truy cập: `http://localhost:5173/profile` sau khi đăng nhập

---

**Made with ❤️ using React, Tailwind CSS, and React Hook Form**
