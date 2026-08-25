# Quy ước kỹ thuật mặc định (Frontend)

## 1. TypeScript & Code Style
- Bắt buộc khai báo kiểu đầy đủ cho props, state, và dữ liệu API. Không dùng `any`.
- Các file React Component dùng đuôi `.tsx`.
- Viết component dạng Functional Component (`const Component: React.FC<Props> = ...` hoặc `function Component(props: Props)...`).
- Định nghĩa rõ ràng kiểu dữ liệu của API response khớp với Backend DTO (đặt trong `src/types/`).

## 2. Quy tắc styling với Tailwind CSS
- Sử dụng các lớp tiện ích được cấu hình sẵn theo Claymorphism:
  - Màu nền: `bg-clay-bg`, `bg-clay-surface`.
  - Màu nhấn: `bg-clay-primary` (tím periwinkle), `bg-clay-primary-dark`.
  - Màu trạng thái: `bg-clay-income` (xanh mint), `bg-clay-expense` (hồng coral), `bg-clay-warning` (vàng nắng), `bg-clay-info` (xanh dương nhạt).
  - Màu văn bản: `text-clay-text` (tím than đậm), `text-clay-text-muted` (tím xám nhạt).
  - Bo góc: `rounded-clay-sm` (16px), `rounded-clay` (24px), `rounded-clay-lg` (32px), `rounded-full` (cho pill).
  - Bóng đổ: `shadow-clay-raised`, `shadow-clay-hover`, `shadow-clay-pressed`.
- Mọi hiệu ứng chuyển trạng thái (hover, active, focus) bắt buộc phải cấu hình `transition-all duration-200 ease-in-out` để đảm bảo độ mượt mà của đất sét nặn.

## 3. Tương tác với Backend API
- Mọi request sử dụng instance `apiClient` từ `src/lib/api-client.ts`.
- Gắn token tự động qua `Authorization: Bearer <access_token>` header.
- Xử lý refresh token khi gặp lỗi 401 tự động trong interceptor của Axios.
- Luôn kiểm tra thuộc tính `success` của response trước khi xử lý tiếp dữ liệu.

## 4. Tương tác với Zalo SDK (`zmp-sdk`)
- Sử dụng các API an toàn từ `zmp-sdk` (ví dụ: `getUserInfo`, `login`, `openCamera`).
- Luôn bọc các hàm gọi SDK trong khối `try...catch` để đề phòng trường hợp chạy trên trình duyệt thường ngoài ứng dụng Zalo.
