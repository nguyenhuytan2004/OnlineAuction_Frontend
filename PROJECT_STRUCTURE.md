# Cấu Trúc Dự Án OnlineAuction_Frontend (Phạm vi Custom)

Tài liệu này chỉ mô tả các thư mục/file bạn đã tự xây dựng trong dự án.
Các thành phần mặc định từ create vite không nằm trong phạm vi chi tiết ở đây.

---

## 1. Tệp/Thư mục gốc do dự án bổ sung

| Tệp/Thư mục             | Vai trò                                                   |
| :---------------------- | :-------------------------------------------------------- |
| `AVATAR_DROPDOWN.md`    | Tài liệu mô tả thiết kế/hành vi dropdown avatar.          |
| `PROJECT_STRUCTURE.md`  | Tài liệu cấu trúc dự án (file hiện tại).                  |
| `README.md`             | Tài liệu tổng quan và hướng dẫn chạy dự án.               |
| `.vscode/settings.json` | Thiết lập riêng cho workspace khi làm việc trong VS Code. |
| `public/assets/`        | Vùng chứa asset tĩnh của dự án (fonts/icons/images).      |

Lưu ý:

- `public/assets/fonts/` và `public/assets/icons/` đã được tạo thư mục (đang để sẵn cho mở rộng).
- `public/assets/images/` hiện có logo dự án.

---

## 2. Cây cấu trúc custom chính

```text
public/
	assets/
		fonts/
		icons/
		images/
			logo-transparent.png
			logo.png

src/
	components/
		admin/
		buttons/
		common/
			BackgroundDecoration.jsx
			CustomDropdown.jsx
			Tooltip.jsx
		inputs/
			SearchBar.jsx
		orderCompletion/
			ConfirmationStep.jsx
			OrderStepper.jsx
			PaymentStep.jsx
			ShippingAddressStep.jsx
			ShippingInfoStep.jsx
		profile/
			AddDescriptionModal.jsx
			BuyerRatingModal.jsx
			CancelTransactionModal.jsx
			CreateProductModal.jsx
		AvatarDropdown.jsx
		BackgroundDecoration.jsx
		ChatFloatingButton.jsx
		ChatModal.jsx
		ConversationListModal.jsx
		ProductCard.jsx
		ProductCard_LessInfo.jsx

	constants/
		api.js
		routes.js

	hooks/
		useAuction.js
		useAuth.js
		useBid.js
		useChat.js
		usePrivateNotification.js
		useQnA.js
		useTokenStatus.js
		useUpgradeSeller.js
		useWebSocket.js

	layouts/
		AdminLayout.jsx
		AuthLayout.jsx
		UserLayout.jsx

	pages/
		admin/
			AdminCategoryManagement.jsx
			AdminDashboard.jsx
			AdminProductManagement.jsx
			AdminUpgradeAccountReview.jsx
			AdminUserManagement.jsx
		auth/
			EmailVerification.jsx
			ForgotPassword.jsx
			Login.jsx
			Register.jsx
			ResetPassword.jsx
		user/
			profile/
				AccountSettings.jsx
				Activity.jsx
				ChangePassword.jsx
				Favorites.jsx
				ProductManagement.jsx
				Ratings.jsx
			Home.jsx
			OrderCompletion.jsx
			PaymentResultRedirect.jsx
			ProductDetail.jsx
			ProductList.jsx
			UpgradeToSellerRequest.jsx
		NotFound.jsx

	routes/
		AdminRouter.jsx
		AuthRouter.jsx
		UserRouter.jsx

	services/
		adminDashboardService.js
		adminSellerUpgradeService.js
		adminUserService.js
		auctionService.js
		authService.js
		bidService.js
		categoryService.js
		chatService.js
		favouriteService.js
		orderService.js
		paymentService.js
		productService.js
		ratingService.js
		userProfileService.js
		userService.js
		websocketService.js

	utils/
		apiClient.js
		formatters.js
		helpers.js
		toast.js
		tokenUtils.js
		validators.js
```

---

## 3. Vai trò theo module trong src

### 3.1 components/

- Chứa UI tái sử dụng và modal theo nghiệp vụ.
- `common/`: nhóm component nền tảng dùng lại ở nhiều trang (`CustomDropdown`, `Tooltip`, ...).
- `orderCompletion/`: từng step cho quy trình hoàn tất đơn hàng.
- `profile/`: modal phục vụ quản lý hồ sơ, đánh giá, hủy giao dịch, tạo sản phẩm.
- `admin/`, `buttons/`: thư mục đã được tạo để tách domain, hiện chưa có file.

### 3.2 constants/

- `api.js`: tập trung endpoint/key liên quan API.
- `routes.js`: định nghĩa path/route constant để tránh hard-code.

### 3.3 hooks/

- Tập trung custom hook theo từng domain nghiệp vụ: auth, auction, bid, chat, notification, websocket, nâng cấp seller...
- Mục tiêu: gom logic state + side effects ra khỏi component trang.

### 3.4 layouts/

- Chia layout theo vai trò người dùng (`AdminLayout`, `AuthLayout`, `UserLayout`).
- Dùng để giữ cấu trúc giao diện thống nhất giữa các nhóm trang.

### 3.5 pages/

- `admin/`: trang quản trị danh mục, sản phẩm, tài khoản, dashboard.
- `auth/`: luồng xác thực và khôi phục mật khẩu.
- `user/`: trang người dùng cuối (home, product list/detail, order completion, upgrade seller, ...).
- `user/profile/`: cụm trang quản lý tài khoản cá nhân và hoạt động.

### 3.6 routes/

- Tách router theo domain truy cập: admin, auth, user.
- Giúp App-level routing rõ ràng và dễ bảo trì hơn.

### 3.7 services/

- Mỗi service đại diện một nhóm API nghiệp vụ riêng (auth, auction, bid, order, payment, chat, rating, admin...).
- Giảm phụ thuộc trực tiếp giữa UI và lớp gọi API.

### 3.8 utils/

- Nhóm hàm dùng chung không phụ thuộc UI: client API base, formatter, helper, toast, token, validator.

---

## 4. Ghi chú đồng bộ tài liệu

Khi thêm module mới, nên cập nhật theo thứ tự:

1. Thêm vào cây thư mục ở mục 2.
2. Cập nhật mô tả module ở mục 3.
3. Nếu có domain mới lớn (ví dụ notifications, realtime dashboard), tách thêm một subsection riêng để tránh file tài liệu bị mơ hồ.
