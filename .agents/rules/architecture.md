# Quy tắc kiến trúc (Frontend)

## 1. Phân chia thư mục & Thành phần

### Base UI Components (`src/components/ui/`)
- Chỉ chứa các thành phần nguyên tử, tái sử dụng cao (Button, Card, Input, Badge, ProgressBar, v.v.).
- Không chứa logic nghiệp vụ, không kết nối API, không phụ thuộc Zustand store.
- Nhận dữ liệu và sự kiện hoàn toàn thông qua `props`.
- Bắt buộc áp dụng đúng các token Claymorphism.

### Shared Components (`src/components/shared/`)
- Chứa các component nghiệp vụ được tái sử dụng ở nhiều trang (ví dụ: `TransactionItem`, `WalletCard`, `CategoryPicker`).
- Có thể chứa logic nghiệp vụ phụ trợ hoặc gọi hooks, nhưng giữ tính độc lập cao.

### Pages (`src/pages/`)
- Mỗi chức năng nghiệp vụ nằm trong một thư mục con riêng biệt (ví dụ: `home`, `wallet`, `report`).
- Chứa màn hình hiển thị chính (`page.tsx` hoặc `index.tsx`) và các component phụ chỉ phục vụ riêng cho trang đó.
- Là nơi điều phối luồng dữ liệu, kích hoạt loading skeletons và xử lý errors.

## 2. Quản lý State & Dữ liệu

### Server State (TanStack Query)
- Mọi dữ liệu lấy từ backend (Wallets, Transactions, Reports, v.v.) phải đi qua TanStack Query.
- Viết custom hooks đặt tại `src/hooks/` hoặc trực tiếp trong thư mục module nếu chỉ dùng ở một nơi.
- Cấu hình cache time và stale time hợp lý, không gọi API vô tội vạ.

### Client State (Zustand)
- Dùng Zustand cho các trạng thái toàn cục của ứng dụng phía client (thông tin đăng nhập/token, cấu hình giao diện ẩn/hiện, cài đặt chung).
- Đặt tại thư mục `src/stores/`.
- Không lạm dụng Zustand cho các dữ liệu có thể quản lý trực tiếp bằng React state hoặc query cache.

### Form State & Validation (Zod + React Hook Form)
- Biện kiểm soát dữ liệu đầu vào: Tất cả các form thêm/sửa giao dịch, thiết lập ví, đặt ngân sách phải được validate bằng Zod schema trước khi submit.
- Định nghĩa schema rõ ràng trong file component hoặc `<feature>.validation.ts`.
