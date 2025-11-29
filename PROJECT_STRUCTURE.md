# 🌟 Cấu Trúc Dự Án OnlineAuction_Frontend (React + Vite + TypeScript/JSX)

Cấu trúc này được xây dựng dựa trên nguyên tắc **Tách biệt Mối quan tâm (Separation of Concerns)**, giúp tăng cường khả năng mở rộng, dễ bảo trì và dễ dàng cho các nhà phát triển mới tiếp cận dự án.

---

## 🛠️ I. Các Tệp Cấu hình & Gốc

| Tệp/Thư mục          | Chức năng Cốt lõi                     | Giải thích chi tiết                                                                                                                                                       | Ví dụ Cụ thể trong Dự án Đấu giá                                                                                        |
| :------------------- | :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------- |
| `index.html`         | **HTML Gốc (Entry HTML)**             | Tệp HTML duy nhất được trình duyệt tải. Nó chứa thẻ `<div id="root">` nơi ứng dụng React được gắn vào.                                                                    | Chứa `<div id="root"></div>` và liên kết với file JavaScript chính.                                                     |
| `package.json`       | **Quản lý Phụ thuộc**                 | Định nghĩa các thư viện cần thiết (`dependencies`), các công cụ cho quá trình phát triển (`devDependencies`), và các lệnh script (`scripts`) để chạy, build, và kiểm thử. | Lệnh chạy: `"dev": "vite"`. Phụ thuộc: `"react"`, `"tailwindcss"`, `"axios"`.                                           |
| `vite.config.js`     | **Cấu hình Build Tool**               | Thiết lập các tùy chỉnh cho Vite. Chủ yếu dùng để cấu hình plugins (như `@vitejs/plugin-react`), và thiết lập Alias đường dẫn (ví dụ: `@/src`).                           | Thiết lập Alias: `alias: {'@/': path.resolve(__dirname, './src/')}`.                                                    |
| `tailwind.config.js` | **Cấu hình Tailwind**                 | Tùy chỉnh theme mặc định của Tailwind (màu sắc, phông chữ, breakpoints). Quan trọng nhất là định nghĩa `content` để Tailwind chỉ tạo ra CSS cần thiết.                    | `content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]`. Thêm màu tùy chỉnh: `colors: { 'primary-blue': '#1DA1F2' }`. |
| `eslint.config.js`   | **Kiểm tra Chất lượng Code (Linter)** | Xác định các quy tắc code style, cú pháp, và các biện pháp phòng ngừa lỗi. Giúp duy trì tính nhất quán và chất lượng code cao trong đội ngũ.                              | Quy tắc: `semi: ['error', 'always']` (luôn dùng dấu chấm phẩy), cấm sử dụng `console.log` trong production.             |
| `public/`            | **Tài sản Tĩnh**                      | Chứa các file mà bạn muốn được sao chép trực tiếp vào thư mục build mà không thông qua quá trình xử lý của Vite (transpilation/bundling).                                 | `favicon.ico`, logo công ty, file `manifest.json`.                                                                      |

---

## 🧱 II. Thư mục `src/` (Code Nguồn)

### 1. **Giao Diện Người Dùng (UI/Views)**

| Thư mục/Tệp           | Chức năng Cốt lõi              | Giải thích chi tiết                                                                                                               | Ví dụ Cụ thể trong Dự án Đấu giá                                                                                             |
| :-------------------- | :----------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| `pages/`              | **Components Cấp cao (Views)** | Đại diện cho một trang hoặc một route cụ thể. Chúng là nơi chứa logic nghiệp vụ chính của trang, gọi hooks và components nhỏ hơn. | `pages/AuctionDetail.tsx`: Chịu trách nhiệm lấy dữ liệu chi tiết phiên đấu giá, hiển thị thông tin sản phẩm và form đặt giá. |
| `pages/auth/`         | **Trang Xác thực**             | Gom nhóm các trang liên quan đến việc xác thực người dùng.                                                                        | `Login.tsx` (Trang đăng nhập), `Register.tsx` (Trang đăng ký).                                                               |
| `layouts/`            | **Components Bố cục**          | Components bao bọc (wrapper) xác định cấu trúc chung của ứng dụng (Header, Footer, Sidebar). Chúng đảm bảo UI thống nhất.         | `MainLayout.tsx`: Bọc các trang, chứa component `<Navbar />` và `<Footer />` cố định.                                        |
| `components/`         | **Components Tái sử dụng**     | Các thành phần nhỏ, độc lập, có thể được sử dụng lại ở nhiều nơi.                                                                 | `Card.tsx`, `Badge.tsx`, `Pagination.tsx`.                                                                                   |
| `components/buttons/` | **Components Nút bấm**         | Các biến thể của nút bấm được định nghĩa rõ ràng về style và hành vi cơ bản (ví dụ: loading state).                               | `PrimaryButton.tsx`, `BidButton.tsx` (Chỉ lo về UI, không lo logic đặt giá).                                                 |
| `App.jsx`             | **Root Component & Routing**   | Component gốc (Root Component). Nơi thiết lập React Router và các Providers cần thiết.                                            | Định tuyến: `<Route path="/" element={<HomePage />} />`, `<Route path="/auctions/:id" element={<AuctionDetail />} />`.       |
| `main.jsx`            | **Entry Point (Khởi động)**    | Nơi React được render vào DOM. Thường dùng để bọc ứng dụng bằng các Provider toàn cục (Router, Context, Redux Store).             | `ReactDOM.createRoot(document.getElementById('root')).render(<App />)`.                                                      |

### 2. **Logic & API**

| Thư mục/Tệp    | Chức năng Cốt lõi          | Giải thích chi tiết                                                                                                                         | Ví dụ Cụ thể trong Dự án Đấu giá                                                            |
| :------------- | :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------ |
| `services/`    | **Logic Tương tác API**    | Chứa các hàm giao tiếp với Backend API, được tách biệt theo tính năng (ví dụ: tất cả API liên quan đến người dùng nằm trong `authService`). | `auctionService.ts` có hàm: `const getAuctions = () => apiClient.get('/auctions');`.        |
| `utils/`       | **Hàm Tiện ích (Helpers)** | Chứa các hàm hỗ trợ chung, không có sự phụ thuộc vào React hoặc nghiệp vụ cụ thể.                                                           | `formatters.ts` có hàm: `formatCurrency(amount)`.                                           |
| `apiClient.js` | **Client API Cơ sở**       | Cấu hình instance Axios/Fetch duy nhất, xử lý việc gắn **Authorization Token** vào tất cả các yêu cầu và xử lý các lỗi HTTP chung.          | Cấu hình Axios: `axios.create({ baseURL: 'https://api.daugiatructuyen.com/v1' })`.          |
| `constants/`   | **Hằng số Dữ liệu**        | Chứa các giá trị cố định, không thay đổi, giúp tránh hardcoding.                                                                            | `routes.js`: Định nghĩa `const HOME_ROUTE = '/'`, `const AUCTION_DETAIL = '/auctions/:id'`. |

### 3. **Trạng thái & Kiểu dữ liệu (TypeScript)**

| Thư mục/Tệp             | Chức năng Cốt lõi                              | Giải thích chi tiết                                                                                                                      | Ví dụ Cụ thể trong Dự án Đấu giá                                                                                     |
| :---------------------- | :--------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| `hooks/`                | **Custom React Hooks**                         | Logic tái sử dụng được viết dưới dạng hàm bắt đầu bằng `use...`. Chức năng là tách biệt logic trạng thái/side effects khỏi Component UI. | `useFetch.ts` (quản lý trạng thái loading/error khi gọi API), `useAuth.ts` (lấy dữ liệu người dùng từ Auth Context). |
| `context/`              | **Quản lý Trạng thái Global**                  | Sử dụng Context API của React để quản lý trạng thái chung cần thiết ở nhiều component (thay vì Prop Drilling).                           | `AuthContext.jsx`: Cung cấp hàm `login`, `logout` và trạng thái `currentUser` cho toàn bộ ứng dụng.                  |
| `types/` **(Nên thêm)** | **Định nghĩa Kiểu dữ liệu (Interfaces/Types)** | **Rất quan trọng với TypeScript.** Chứa các định nghĩa kiểu cho các đối tượng dữ liệu, Props của Component, và cấu trúc phản hồi API.    | `interface AuctionItem { id: string; title: string; currentPrice: number; }`.                                        |
