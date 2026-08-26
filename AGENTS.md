# Loichoi Frontend Developer & Agent Guide

Tài liệu này là cẩm nang hướng dẫn bắt buộc cho mọi phiên làm việc của AI Agent và Nhà phát triển trong repository Frontend (`loichoi-fe`). Hệ thống được xây dựng trên nền tảng **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **TanStack Query**, **Zustand** và áp dụng phong cách thiết kế **Cute Kawaii Web Design** lấy cảm hứng từ nhân vật Sanrio (**Cinnamoroll**).

---

## 1. Phong Cách Thiết Kế Dự Án: Cute Kawaii Web Design (Cinnamoroll Style)

Xu hướng thiết kế web hiện đại phong cách dễ thương (Cute Kawaii Web Design) lấy cảm hứng từ các nhân vật Sanrio như **Cinnamoroll** được nâng cấp bằng tư duy UI/UX hiện đại: **tối giản, mượt mà và tối ưu trải nghiệm người dùng**, vừa mang nét đáng yêu của chú cún Cinnamoroll, vừa giữ được sự chuyên nghiệp, gọn gàng.

### 1.1. Bảng màu chủ đạo (Color Palette)
- **Trắng kem (`#FFFFFF` / `#F9F9F9`)**: Màu lông của Cinnamoroll, dùng làm nền chủ đạo (Background) để tạo cảm giác sạch sẽ, thoáng đãng.
- **Xanh pastel / Xanh baby (`#CDE4FE` / `#A2CFFE`)**: Màu của bầu trời và đôi mắt Cinnamoroll, dùng cho các nút bấm hành động chính (CTA), đường viền hoặc vùng highlight.
- **Hồng má hồng (`#FFD1DC` / `#FFB7C5`)**: Dùng điểm xuyết cho các hiệu ứng hover, badge, tag hoặc icon nhỏ để tăng vẻ ngọt ngào.
- **Nâu mocha sữa (`#6F4E37` / `#8B5A2B`)**: **TUYỆT ĐỐI KHÔNG dùng màu đen thuần (`#000000`)** cho chữ; thay vào đó sử dụng màu nâu mocha ấm nhẹ để văn bản mềm mại, không bị thô cứng.

### 1.2. Kiểu dáng & Giao diện (UI Elements)
- **Góc bo tròn cực đại (Rounded Corners)**: Các khối hộp (card), nút bấm, thanh tìm kiếm, input và modal đều phải bo tròn mạnh (`border-radius: 20px - 50px` tương đương `rounded-2xl`, `rounded-3xl`, `rounded-full`) tạo cảm giác mềm mại như những đám mây bồng bềnh.
- **Đường viền dạng vẽ tay (Soft Borders)**: Sử dụng nét viền mảnh, màu pastel nhẹ (`border-[#CDE4FE]` hoặc `border-[#FFD1DC]`).
- **Đổ bóng dạng khối mềm (Neumorphism / Soft Cloud Shadows)**: Đổ bóng mờ, xốp và rộng (`shadow-[0_10px_30px_rgba(162,207,254,0.25)]`) để các phần tử như đang bồng bềnh trên mặt nước hoặc bầu trời mây.

### 1.3. Quy Tắc Icon & Biểu Tượng (Icon System - BẮT BUỘC: KHÔNG DÙNG EMOJI)
- **TUYỆT ĐỐI KHÔNG SỬ DỤNG EMOJI** trong mã nguồn, văn bản UI, nhãn nút, tiêu đề, mô tả hay thông báo.
- **CHỈ SỬ DỤNG ICON** từ thư viện **Lucide React** (`lucide-react`) hoặc SVG vector chuẩn.
- **Mẫu Icon Bubble Kawaii (Icon Container)**:
  - Bọc icon trong khối tròn hoặc bo góc `rounded-2xl` / `rounded-full` với nền pastel (`bg-kawaii-sky/30`, `bg-kawaii-blush/40`, `bg-kawaii-cloud`).
  - Màu nét icon: dùng màu thương hiệu nâu mocha (`text-kawaii-mocha`), xanh baby (`text-kawaii-babyblue`), hoặc hồng phấn (`text-kawaii-pink`).
  - Ví dụ:
    ```tsx
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-kawaii-sky/30 text-kawaii-mocha shadow-inner">
      <Cloud className="h-5 w-5 text-kawaii-mocha" />
    </div>
    ```

### 1.4. Phông chữ (Typography)
- Chọn font chữ tròn trịa, mập mạp và dễ đọc: **Quicksand**, **Nunito**, **Fredoka**, hoặc **Comfortaa**.
- **Quy tắc**: Tránh dùng các font quá góc cạnh, sắc nhọn như Serif cổ điển hoặc Roboto cứng nhắc.

### 1.5. Hiệu ứng chuyển động (Micro-interactions & Animation)
- **Hiệu ứng bồng bềnh (Floating Animation)**: Các icon đám mây, badge chuyển động lên xuống nhẹ nhàng nhờ CSS Animation / Framer Motion.
- **Hiệu ứng nảy (Bouncy Hover)**: Khi người dùng di chuột vào nút bấm, nút sẽ phồng nhẹ lên hoặc nảy nhẹ như bánh bông lan (`transform: scale(1.05)` kết hợp `transition: cubic-bezier(0.34, 1.56, 0.64, 1)`).

### 1.6. Bố cục & Hình ảnh minh họa (Layout & Illustrations)
- **Chủ nghĩa tối giản dễ thương (Cute Minimalism)**: Giữ không gian trắng (white space) rộng rãi, thoáng mắt. Đáng yêu nhưng tinh tế, không nhồi nhét chi tiết.
- **Hình vẽ Vector / 3D Clay**: Sử dụng hình minh họa vector nét liền hoặc các khối 3D mềm mại như đất sét nặn (Claymorphism).

### 1.7. Ý tưởng bố cục chuẩn cho các màn hình
| Phần (Section) | Ý tưởng thiết kế Kawaii Cinnamoroll |
| :--- | :--- |
| **Header** | Thanh menu màu trắng kem bo góc lớn, logo icon đám mây mềm mại, bộ chuyển ngôn ngữ & giao diện pastel. |
| **Hero Section** | Tiêu đề lớn màu nâu mocha ấm, nút bấm màu xanh baby bồng bềnh, họa tiết đám mây vector chìm. |
| **Features / Cards** | Khung chứa nội dung bo tròn như bánh quy (`rounded-3xl`), nền pastel siêu nhạt, đổ bóng mây xốp. |
| **Footer** | Thiết kế đường cong uốn lượn lồi lõm như những đám mây nối đuôi nhau thay vì đường kẻ thẳng tắp. |

---

## 2. Tech Stack Chuẩn Hóa

| Hạng mục | Stack Chuẩn | Quy ước & Hướng dẫn sử dụng |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15+ + TypeScript** | App Router (`src/app`), Server & Client Components tách biệt rõ ràng (`use client`). |
| **Styling** | **Tailwind CSS** | Bảng màu Cinnamoroll Pastel + HSL CSS variables, Dark Mode class-based (Sáng / Tối / Theo hệ thống). |
| **UI Components** | **shadcn/ui + Radix UI** | Primitives tại `src/components/ui/` với góc bo `rounded-2xl`/`rounded-3xl` và bóng mây. |
| **Icon System** | **Lucide React** | **Bắt buộc**: Icons nét bo tròn, phối màu pastel dịu mắt. Tuyệt đối không dùng emoji. |
| **Internationalization (i18n)** | **Zustand + i18n Dictionary** | Chuyển đổi ngôn ngữ Anh - Việt linh hoạt qua `useTranslation` và `LanguageToggle`. |
| **Data Fetching** | **TanStack Query v5** | Quản lý Server State, caching, revalidation; kết nối qua `src/services/` và custom hooks. |
| **Form & Validation** | **React Hook Form + Zod** | Khai báo schema Zod rõ ràng, tích hợp `@hookform/resolvers/zod`. |
| **State Global** | **Zustand** | Chỉ dùng cho Client State thực sự cần thiết (Auth, UI toggles, i18n) tại `src/stores/`. |
| **Animation** | **Motion / Framer Motion** | Hiệu ứng Bouncy, Floating và Spring Transitions mềm mại. |
| **Image** | **Next/Image** | Tối ưu hình ảnh tự động, cấu hình `remotePatterns` trong `next.config.ts`. |
| **Toast Notifications** | **Sonner** | Thông báo toast bo tròn dễ thương qua `toast.success()`, `toast.error()`. |
| **Auth FE** | **Session từ BE / Discord OAuth** | Cookie HTTP-only tự động gửi qua Axios `withCredentials: true`; hỗ trợ Discord OAuth redirect. |

---

## 3. Cấu Trúc Thư Mục Next.js Chuẩn (Project Structure & Organization)

Dự án tuân thủ đầy đủ các quy ước chính thức của Next.js App Router (sử dụng thư mục nguồn `src/`):

```text
loichoi-fe/
├── AGENTS.md                                 # Hướng dẫn quy chuẩn cho Agent (file này)
├── README.md                                 # Tài liệu dự án
├── package.json                              # Dependencies & scripts
├── tsconfig.json                             # Cấu hình TypeScript & path alias (@/*)
├── next.config.ts                            # Cấu hình Next.js (rewrites, remotePatterns)
├── tailwind.config.ts                        # Cấu hình Tailwind CSS, Cinnamoroll colors & tokens
├── postcss.config.mjs                        # Cấu hình PostCSS
├── components.json                           # Cấu hình shadcn/ui
├── eslint.config.mjs                         # Cấu hình ESLint
├── .gitignore                                # Git ignore
├── .env.example                              # Biến môi trường mẫu
│
├── public/                                   # Tài nguyên tĩnh (Static assets, stickers, icons)
│   ├── images/
│   └── icons/
│
└── src/                                      # Thư mục mã nguồn ứng dụng
    ├── app/                                  # Next.js App Router
    │   ├── globals.css                       # Global styles, Cinnamoroll palette & animations
    │   ├── layout.tsx                        # Root Layout (bọc QueryProvider, ThemeProvider, Toaster)
    │   ├── page.tsx                          # Trang chủ / Landing page (Public route `/`)
    │   ├── loading.tsx                       # Root Loading UI (Cloud Suspense Boundary)
    │   ├── not-found.tsx                     # 404 Not Found UI
    │   ├── error.tsx                         # Client Error Boundary
    │   ├── global-error.tsx                  # Global Root Error Boundary (chứa <html> và <body>)
    │   ├── robots.ts                         # SEO Robots generator
    │   ├── sitemap.ts                        # SEO Sitemap generator
    │   │
    │   ├── (auth)/                           # Route Group: Xác thực (không đổi URL path)
    │   │   ├── layout.tsx                    # Shared Layout cho nhóm auth
    │   │   ├── login/page.tsx                # Trang đăng nhập `/login` (+ Discord OAuth)
    │   │   ├── register/page.tsx             # Trang đăng ký `/register`
    │   │   ├── forgot-password/page.tsx      # Quên mật khẩu `/forgot-password`
    │   │   ├── reset-password/page.tsx       # Đặt lại mật khẩu `/reset-password`
    │   │   └── callback/discord/page.tsx     # Xử lý Discord OAuth redirect `/callback/discord`
    │   │
    │   ├── (dashboard)/                      # Route Group: Bảng điều khiển ứng dụng chính
    │   │   ├── layout.tsx                    # Dashboard Shell Layout (Sidebar + Header + Guard)
    │   │   ├── dashboard/page.tsx            # Trang Dashboard tổng quan `/dashboard`
    │   │   ├── profile/page.tsx              # Trang hồ sơ cá nhân `/profile`
    │   │   ├── users/                        # Quản lý người dùng `/users`
    │   │   │   ├── page.tsx                  # Danh sách người dùng
    │   │   │   ├── loading.tsx               # Skeleton loading riêng cho module users
    │   │   │   └── [id]/page.tsx             # Chi tiết người dùng động `/users/:id`
    │   │   ├── roles/                        # Phân quyền động RBAC `/roles`
    │   │   │   ├── page.tsx                  # Danh sách Roles & Permissions matrix
    │   │   │   └── [id]/page.tsx             # Chi tiết Role `/roles/:id`
    │   │   ├── keyboards/                    # Quản lý Bàn phím cơ `/keyboards`
    │   │   │   ├── page.tsx                  # Danh sách bàn phím
    │   │   │   └── [id]/page.tsx             # Chi tiết bàn phím `/keyboards/:id`
    │   │   ├── categories/page.tsx           # Quản lý danh mục `/categories`
    │   │   ├── notifications/page.tsx        # Trung tâm thông báo `/notifications`
    │   │   └── settings/                     # Cài đặt hệ thống `/settings`
    │   │       ├── page.tsx
    │   │       ├── integrations/page.tsx     # Tích hợp Discord & API keys
    │   │       └── system/page.tsx           # Cấu hình hệ thống runtime
    │   │
    │   └── api/                              # Next.js Route Handlers (API Endpoints)
    │       ├── auth/session/route.ts         # Proxy lấy session
    │       └── health/route.ts               # Healthcheck endpoint
    │
    ├── components/                           # Các React Components
    │   ├── ui/                               # shadcn/ui base primitives bo tròn mềm mại
    │   ├── shared/                           # Components tái sử dụng (Header, Sidebar, ThemeToggle, LanguageToggle...)
    │   ├── forms/                            # Form components kết hợp React Hook Form + Zod
    │   └── providers/                        # Providers (QueryProvider, ThemeProvider...)
    │
    ├── hooks/                                # Custom React hooks (useAuth, usePermissions, useTranslation...)
    ├── lib/                                  # Utilities, constants, i18n dictionaries
    ├── services/                             # API Services kết nối Backend (/api/v1)
    ├── stores/                               # Zustand stores (auth-store.ts, ui-store.ts, language-store.ts)
    └── types/                                # TypeScript type definitions
```

---

## 4. Quy Ước Routing & File Conventions Trong Next.js App Router

### 4.1. Các Tệp Tin Routing Đặc Biệt (Special Routing Files)
- `page.tsx`: Định nghĩa UI của một route có thể truy cập công khai.
- `layout.tsx`: Giao diện dùng chung cho một phân đoạn và các cấp con của nó. Không bị re-render khi chuyển trang con.
- `loading.tsx`: Tự động bọc `page.tsx` trong React Suspense Boundary và hiển thị Skeleton UI trong khi dữ liệu đang được nạp.
- `error.tsx`: React Error Boundary bọc quanh route segment để bắt và xử lý lỗi phía Client mà không làm sập toàn bộ ứng dụng.
- `global-error.tsx`: Xử lý lỗi nghiêm trọng tại Root Layout, bắt buộc chứa thẻ `<html>` và `<body>`.
- `not-found.tsx`: Giao diện hiển thị khi một route không tìm thấy hoặc hàm `notFound()` được gọi.
- `route.ts`: API endpoint phía máy chủ (Server-side Route Handler).

### 4.2. Thứ Tự Phân Cấp Render (Component Hierarchy)
```text
layout.tsx
  └── template.tsx (nếu có)
        └── error.tsx (React error boundary)
              └── loading.tsx (React suspense boundary)
                    └── not-found.tsx (React error boundary cho 404)
                          └── page.tsx (hoặc nested layout.tsx của cấp con)
```

### 4.3. Route Groups `(groupName)`
- Thư mục được đặt trong dấu ngoặc đơn: `(auth)`, `(dashboard)`.
- **Mục đích**: Nhóm các route logic hoặc áp dụng layout riêng mà **KHÔNG ẢNH HƯỞNG ĐẾN ĐƯỜNG DẪN URL** (ví dụ: `app/(auth)/login/page.tsx` ánh xạ đến URL `/login`).

### 4.4. Private Folders `_folderName`
- Thư mục có tiền tố gạch dưới `_components`, `_lib` được Next.js loại trừ khỏi routing system để Colocation an toàn.

---

## 5. Nguyên Tắc Phát Triển Bắt Buộc Dành Cho Agent

1. **Tuyệt Đối KHÔNG Dùng Emoji - Chỉ Dùng Icon (Lucide React)**:
   - Nghiêm cấm dùng bất kỳ ký tự emoji Unicode nào trong giao diện, mã nguồn, thông báo toast hoặc nút bấm.
   - Luôn sử dụng icon từ `lucide-react` và bọc trong container bo tròn mềm mại (`rounded-2xl`, `bg-kawaii-sky/30`, `text-kawaii-mocha`).
2. **Tuân Thủ Phong Cách Cute Kawaii (Cinnamoroll Style)**:
   - Sử dụng đúng bảng màu pastel: Nền kem `#FDFDFD`, Xanh baby `#CDE4FE`/`#A2CFFE`, Hồng má `#FFD1DC`, Chữ nâu mocha `#6F4E37`.
   - **Tuyệt đối KHÔNG dùng màu đen thuần `#000000`** cho text hay viền.
   - Luôn bo góc mạnh (`rounded-2xl`, `rounded-3xl`, `rounded-full`) cho button, card, input, dropdown.
   - Thêm hiệu ứng hover bouncy (`hover:scale-105 transition-transform duration-200 ease-out`).
3. **Chuyển Đổi Giao Diện & Ngôn Ngữ**:
   - Hỗ trợ đầy đủ 3 chế độ giao diện: Sáng (Light), Tối (Dark), Theo hệ thống (System) qua `ThemeToggle`.
   - Hỗ trợ chuyển đổi song ngữ Anh - Việt qua `LanguageToggle` và `useTranslation`.
4. **Phân biệt Server Component và Client Component**:
   - Mặc định mọi component trong App Router là **Server Component**.
   - Chỉ gắn directive `"use client";` ở đầu file khi component cần State, Effect, Query hoặc Event Listener.
5. **Quản lý Dữ liệu & State (TanStack Query + Zustand)**:
   - Dữ liệu từ Backend API (`/api/v1`) bắt buộc đi qua TanStack Query hooks kết hợp `src/services/`.
   - Chỉ dùng Zustand cho Client State toàn cục (Auth state, Sidebar collapse, Language state, Modal state).
6. **Form & Validation (React Hook Form + Zod)**:
   - Mọi form thu thập dữ liệu phải có schema Zod được định nghĩa rõ ràng.
7. **Phân Quyền Động (Dynamic RBAC)**:
   - Sử dụng `<PermissionGate permission={PERMISSIONS.USER_READ} fallback={<AccessDenied />}>` để bảo vệ giao diện; import permissions từ `@/lib/constants`.
8. **Xác thực & Discord OAuth**:
   - Axios instance gửi kèm HTTP-only cookie (`withCredentials: true`). Đăng nhập Discord qua `/api/v1/auth/discord` và callback tại `/callback/discord`.
9. **Bảo toàn Backend (`loichoi-be`)**:
   - Tuyệt đối KHÔNG ĐƯỢC sửa đổi bất kỳ file nào trong thư mục `loichoi-be/` trừ khi có yêu cầu rõ ràng.
