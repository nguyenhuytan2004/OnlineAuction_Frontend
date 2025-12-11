# Avatar Dropdown Menu - User Profile Navigation

## 📋 Tổng Quan

Hệ thống navigation mới với **Avatar Dropdown Menu** thay thế cho link "Hồ sơ" cũ. Menu hiển thị avatar tròn của user và dropdown với các tùy chọn profile.

## ✨ Tính Năng

### 🎨 Avatar Dropdown Component

**Component**: `src/components/AvatarDropdown.jsx`

#### Features:

-   ✅ Avatar tròn với initials từ tên user (2 chữ cái đầu)
-   ✅ Gradient background (Amber to Orange)
-   ✅ Online indicator (chấm xanh)
-   ✅ Dropdown menu với animations
-   ✅ Click outside để đóng
-   ✅ Responsive với user info

#### Dropdown Menu Items:

1. **Thông tin**

    - Icon: User
    - Route: `/profile/info`
    - Mô tả: Đang tham gia, Đã thắng
    - Color: Amber

2. **Yêu thích**

    - Icon: Heart
    - Route: `/profile/favorites`
    - Mô tả: Sản phẩm yêu thích
    - Color: Pink

3. **Tài khoản**

    - Icon: Settings
    - Route: `/profile/account`
    - Mô tả: Cập nhật thông tin
    - Color: Blue

4. **Đổi mật khẩu**

    - Icon: Lock
    - Route: `/profile/password`
    - Mô tả: Bảo mật tài khoản
    - Color: Purple

5. **Đăng xuất**
    - Icon: LogOut
    - Action: Logout
    - Color: Red

## 📁 File Structure

```
src/
├── components/
│   └── AvatarDropdown.jsx          # Avatar dropdown component
├── pages/
│   └── profile/
│       ├── UserInfo.jsx            # Thông tin (Participating & Won)
│       ├── Favorites.jsx           # Sản phẩm yêu thích
│       ├── AccountSettings.jsx     # Cập nhật thông tin tài khoản
│       └── ChangePassword.jsx      # Đổi mật khẩu
└── constants/
    └── routes.js                   # Updated với profile routes
```

## 🎨 UI/UX Design

### Avatar Button

```
┌─────────────────────────────────┐
│  [Avatar] User Name  [▼]        │
└─────────────────────────────────┘
```

-   **Avatar**: Gradient circle với initials
-   **Online indicator**: Green dot
-   **Hover effect**: Scale + background change
-   **Dropdown indicator**: Chevron với rotation

### Dropdown Menu

```
┌──────────────────────────────────┐
│  [Header: User Info]             │
├──────────────────────────────────┤
│  [Icon] Thông tin                │
│         Đang tham gia, Đã thắng  │
├──────────────────────────────────┤
│  [Icon] Yêu thích                │
│         Sản phẩm yêu thích       │
├──────────────────────────────────┤
│  [Icon] Tài khoản                │
│         Cập nhật thông tin       │
├──────────────────────────────────┤
│  [Icon] Đổi mật khẩu             │
│         Bảo mật tài khoản        │
├──────────────────────────────────┤
│  [Icon] Đăng xuất                │
│         Thoát khỏi tài khoản     │
└──────────────────────────────────┘
```

## 🚀 Các Trang Profile

### 1. User Info (`/profile/info`)

**Component**: `UserInfo.jsx`

**Tabs**:

-   **Đang tham gia**: Sản phẩm đang đấu giá
-   **Đã thắng**: Sản phẩm đã thắng đấu giá

**Features**:

-   Tab navigation với count badges
-   Product cards với status badges
-   Loading states
-   Empty states

**Gradient Header**: Amber to Orange

### 2. Favorites (`/profile/favorites`)

**Component**: `Favorites.jsx`

**Features**:

-   Danh sách sản phẩm yêu thích
-   Product cards với heart badge
-   Empty state với message

**Gradient Header**: Pink to Rose

### 3. Account Settings (`/profile/account`)

**Component**: `AccountSettings.jsx`

**Form Fields**:

-   Họ và tên (required, min 3 chars)
-   Email (required, email pattern)

**Features**:

-   React Hook Form validation
-   Success message
-   Icon inputs
-   Auto-filled với user data

**Gradient Header**: Blue

### 4. Change Password (`/profile/password`)

**Component**: `ChangePassword.jsx`

**Form Fields**:

-   Mật khẩu hiện tại (required, min 6 chars)
-   Mật khẩu mới (required, min 6 chars)
-   Xác nhận mật khẩu mới (must match)

**Features**:

-   React Hook Form validation
-   Password matching validation
-   Success message
-   Form reset sau submit

**Gradient Header**: Purple

## 🎯 Integration

### UserLayout Update

```jsx
// Old
{isAuthenticated ? (
  <>
    <Link to={ROUTES.PROFILE}>Hồ sơ</Link>
    <button onClick={logout}>Đăng Xuất</button>
  </>
) : (...)}

// New
{isAuthenticated ? (
  <AvatarDropdown />
) : (...)}
```

### Routes Added

```javascript
ROUTES = {
    PROFILE_INFO: "/profile/info",
    PROFILE_FAVORITES: "/profile/favorites",
    PROFILE_ACCOUNT: "/profile/account",
    PROFILE_PASSWORD: "/profile/password",
};
```

## 💡 Component Props

### AvatarDropdown

No props required - uses `useAuthContext()` internally

```jsx
<AvatarDropdown />
```

### UserInfo, Favorites, AccountSettings, ChangePassword

No props required - standalone pages

## 🎨 Design Consistency

### Gradient Headers

-   **User Info**: Amber → Orange (matches brand)
-   **Favorites**: Pink → Rose (love/heart theme)
-   **Account**: Blue → Blue (professional)
-   **Password**: Purple → Purple (security)

### Card Components

-   Rounded corners: `rounded-2xl` / `rounded-3xl`
-   Shadows: `shadow-lg` / `shadow-2xl`
-   Borders: `border border-slate-200`
-   Hover effects: Scale, shadow, color transitions

### Form Design

-   Icon inputs (User, Mail, Lock)
-   Border colors match section theme
-   Focus rings với color matching
-   Error states in red
-   Success messages in green

### Animations

-   Fade in: `animate-in fade-in`
-   Slide in: `slide-in-from-top-2`
-   Hover scales: `hover:scale-105`
-   Transitions: `transition-all duration-300`

## 📱 Responsive Design

-   **Desktop**: Full dropdown với user name visible
-   **Mobile**: Avatar only, dropdown adapts
-   Grid layouts: `md:grid-cols-2 lg:grid-cols-3`

## 🔒 Authentication

Tất cả profile pages yêu cầu authentication:

-   Use `useAuthContext()` để check `isAuthenticated`
-   Redirect về login nếu chưa đăng nhập

## 🐛 Error Handling

-   API errors: Alert messages
-   Loading states: Spinners
-   Empty states: Friendly messages
-   Form validation: Real-time với react-hook-form

## 📝 Validation Rules

### Account Settings

```javascript
fullName: {
  required: "Họ tên là bắt buộc",
  minLength: { value: 3, message: "..." },
  maxLength: { value: 100, message: "..." }
}

email: {
  required: "Email là bắt buộc",
  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "..." }
}
```

### Change Password

```javascript
oldPassword: {
  required: "Vui lòng nhập mật khẩu hiện tại",
  minLength: { value: 6, message: "..." }
}

newPassword: {
  required: "Vui lòng nhập mật khẩu mới",
  minLength: { value: 6, message: "..." }
}

confirmPassword: {
  required: "Vui lòng xác nhận mật khẩu mới",
  validate: (value) => value === newPassword || "Mật khẩu không khớp"
}
```

## 🎯 Usage Examples

### Navigate to User Info

```jsx
<Link to="/profile/info">Thông tin</Link>
```

### Access from Dropdown

```jsx
// Click avatar → Click "Thông tin" menu item
// Auto navigates to /profile/info
```

### Programmatic Navigation

```jsx
import { useNavigate } from "react-router-dom";
import { ROUTES } from "./constants/routes";

const navigate = useNavigate();
navigate(ROUTES.PROFILE_INFO);
```

## 🚀 Demo

1. **Login** vào hệ thống
2. **Click avatar** ở header (góc phải)
3. **Hover** để xem dropdown menu
4. **Click** vào bất kỳ menu item nào
5. **Navigate** giữa các trang profile

## 🎨 Color Palette

```css
/* Brand Colors */
Amber: #F59E0B → Orange: #F97316

/* Section Colors */
Pink: #EC4899 → Rose: #F43F5E
Blue: #3B82F6 → Blue: #2563EB
Purple: #A855F7 → Purple: #9333EA

/* Neutral */
Slate: #1E293B, #334155, #64748B
White: #FFFFFF
```

## ✅ Checklist

-   [x] AvatarDropdown component
-   [x] User Info page (Participating & Won)
-   [x] Favorites page (Watch List)
-   [x] Account Settings page
-   [x] Change Password page
-   [x] Routes configuration
-   [x] UserLayout integration
-   [x] React Hook Form validation
-   [x] Responsive design
-   [x] Animations & transitions
-   [x] Error handling
-   [x] Loading states
-   [x] Empty states

---

**Made with ❤️ - Modern, Beautiful, Consistent UI**
