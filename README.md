# Loichoi Frontend (Next.js App Router)

Ứng dụng Frontend chính thức của hệ sinh thái **Loichoi** - Nền tảng quản trị và tùy biến bàn phím cơ thông minh, tích hợp Discord OAuth và phân quyền động (Dynamic RBAC).

---

## 1. Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router) + TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI Primitives](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/) (Chuẩn Icon hệ thống - Không dùng emoji)
- **Internationalization**: Song ngữ Anh - Việt qua Zustand & i18n Dictionary
- **Theme**: Sáng / Tối / Theo hệ thống qua next-themes & ThemeToggle
- **Data Fetching & Cache**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Form & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Global State**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Animation**: [Motion / Framer Motion](https://motion.dev/)
- **Image Optimization**: [Next/Image](https://nextjs.org/docs/app/api-reference/components/image)
- **Notifications & Toasts**: [Sonner](https://sonner.emilkowal.ski/)
- **Authentication**: Backend Session (HTTP-only Cookies) + Discord OAuth redirect flow

---

## 2. Cấu Trúc Dự Án (Project Structure)

```text
loichoi-fe/
├── AGENTS.md                 # Hướng dẫn chi tiết dành cho AI Agent & Developer
├── package.json              # Quản lý dependencies & scripts
├── tsconfig.json             # Cấu hình TypeScript với path aliases (@/*)
├── next.config.ts            # Cấu hình Next.js (Proxy API rewrites & Remote image patterns)
├── tailwind.config.ts        # Cấu hình giao diện Tailwind CSS (HSL variables)
├── components.json           # Cấu hình shadcn/ui
├── public/                   # Static assets (images, icons)
└── src/
    ├── app/                  # Next.js App Router
    │   ├── (auth)/           # Route Group cho luồng đăng nhập, đăng ký, Discord callback
    │   ├── (dashboard)/      # Route Group cho giao diện quản trị (Keyboards, Users, Roles...)
    │   ├── api/              # Route Handlers
    │   ├── layout.tsx        # Root Layout với Providers (QueryClient, Theme, Sonner)
    │   ├── page.tsx          # Landing page
    │   ├── loading.tsx       # Suspense Loading Skeleton
    │   ├── error.tsx         # Client Error Boundary
    │   └── not-found.tsx     # 404 Not Found UI
    ├── components/
    │   ├── ui/               # shadcn/ui base primitives (button, card, dialog, dropdown-menu...)
    │   ├── shared/           # Header, Sidebar, ThemeToggle, LanguageToggle, PermissionGate...
    │   └── providers/        # QueryProvider, ThemeProvider...
    ├── hooks/                # Custom React hooks (useAuth, usePermissions, useTranslation...)
    ├── lib/                  # Tiện ích chung (utils.ts, api-client.ts, constants.ts, i18n...)
    ├── services/             # API services kết nối Backend (/api/v1)
    ├── stores/               # Zustand global state (auth-store.ts, ui-store.ts, language-store.ts)
    └── types/                # TypeScript type definitions
```

---

## 3. Khởi Chạy Dự Án

### 1. Cài đặt dependencies

```bash
pnpm install
# hoặc
npm install
```

### 2. Cấu hình biến môi trường

Sao chép `.env.example` thành `.env.local`:

```bash
cp .env.example .env.local
```

### 3. Chạy môi trường phát triển

```bash
pnpm dev
# hoặc
npm run dev
```

Truy cập ứng dụng tại `http://localhost:3000`.
