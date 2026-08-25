# Bản đồ dự án FinWise Frontend

## Mục đích

Ứng dụng quản lý tài chính cá nhân dành cho người dùng Zalo ("Sổ tay Chi tiêu & Báo cáo Tài chính"). Giúp theo dõi thu nhập/chi tiêu, quản lý ví, lập ngân sách, tiết kiệm và hỗ trợ bằng AI Assistant.

## Công nghệ

- **Framework**: ZMP CLI (Zalo Mini Program) - React 18 + Vite 5 + TypeScript
- **UI Kit**: `zmp-ui` cho các thành phần bắt buộc (Page, Sheet container, Navigation) + Claymorphism Base Components làm nền hiển thị chính.
- **Native SDK**: `zmp-sdk` để lấy thông tin Zalo user, đăng nhập, chụp ảnh hóa đơn OCR.
- **Styling**: Tailwind CSS v3 với cấu hình tokens Claymorphism.
- **Data Fetching / Cache**: TanStack Query (React Query) v5.
- **State Management**: Zustand cho state toàn cục (auth, ui settings).
- **Form Validation**: Zod + React Hook Form.

## Cấu trúc thư mục hiện tại

```text
├── index.html              # HTML entry ở root; ZMP CLI yêu cầu vị trí này khi chạy dev
├── app-config.json         # Cấu hình khung hiển thị Zalo Mini App
├── vite.config.mts         # Vite config; không đổi root sang ./src
├── www/                    # Build output được sinh bởi `npm run build`
└── src/
    ├── app.ts              # React entry, mount vào #app
    ├── components/
    │   ├── ui/             # Base components Claymorphism
    │   └── shared/         # AuthGuard và component nghiệp vụ dùng chung
    ├── pages/
    │   ├── auth/           # Đăng nhập, đăng ký, quên/đặt lại mật khẩu
    │   ├── profile/        # Trang hồ sơ người dùng
    │   ├── index.tsx       # Trang chủ sau đăng nhập
    │   └── style-guide.tsx # Trang kiểm thử Design System
    ├── css/                # Tailwind directives và style bổ sung
    ├── lib/                # Axios client và React Query client
    ├── services/           # Module gọi API, hiện có auth.service.ts
    ├── stores/             # Zustand stores, hiện có auth-store.ts
    └── types/              # Kiểu dữ liệu dùng chung với backend
```

Các module ví, giao dịch, ngân sách, mục tiêu tiết kiệm, báo cáo và AI Assistant là phạm vi sản phẩm dự kiến, chưa có page trong code hiện tại.

## Luồng API & Dữ liệu

```text
Component / Page
  -> React Hook Form / Zod (Validation phía Client)
  -> TanStack Query (Hooks sử dụng Services)
  -> services/ (Gọi API qua api-client)
  -> Backend API (/api/v1)
```

- **Base URL (Development)**: `http://localhost:7777/api/v1` (Port 7777 khớp với Backend `.env`).
- **Khởi tạo đăng nhập**: `AuthInitializer` gọi `GET /auth/me`; route riêng tư đi qua `AuthGuard` và chuyển về `/login` khi chưa xác thực.
- **Token**: Ưu tiên cookie HTTP-only; Axios vẫn hỗ trợ Bearer token từ auth store cho luồng tương thích hiện có.
- **Response Format**:
  ```json
  {
    "success": boolean,
    "message": string,
    "data": <dữ liệu trả về>,
    "errors": [] | null
  }
  ```

## Dev server và build

- `npm run start` chạy ZMP CLI: khung mô phỏng ở `http://localhost:13580`, nội dung app ở `http://localhost:13579`.
- `index.html` phải nằm ở root repository. Nếu đặt trong `src/`, iframe nội dung sẽ trả 404 và giao diện có thể chỉ hiện màn hình đen.
- `npm run build` phải sinh output tại `www/` ở root repository, không phải `src/www/`.
