# Project Memory (Frontend)

## Date/time architecture (2026-08-16)

- `Asia/Ho_Chi_Minh` is the single business/display timezone.
- Transaction, Budget, and Saving Goal calendar dates are sent unchanged as `YYYY-MM-DD`, without parsing through the device timezone.
- Datetime-local inputs such as transfers and contributions represent Vietnamese wall time and are converted to offset-aware UTC ISO strings before sending.
- Timestamp display uses `Intl` with `Asia/Ho_Chi_Minh`; report requests never send the device offset.
- Vietnamese date display, including date and datetime-local controls, uses `DD/MM/YYYY` and
  `DD/MM/YYYY HH:mm`; control values and API payloads remain in their existing ISO formats.

File này lưu trữ các quyết định thiết kế dài hạn và trạng thái hiện tại của dự án để đảm bảo tính nhất quán qua các phiên làm việc của Agent.

## Quyết định đang có hiệu lực

- **Design System Claymorphism**: Sử dụng phong cách đất sét nặn 3D vui tươi, mềm mại:
  - Bóng đổ kép (dual-tone soft shadow) được định nghĩa qua các token: `shadow-clay-raised`, `shadow-clay-hover`, `shadow-clay-pressed`.
  - Sử dụng hai phông chữ: `Baloo 2` (Heading & Số tiền) và `Nunito` (Nội dung chính).
  - Bo góc tối thiểu 16px (`rounded-clay-sm`), tiêu chuẩn 24px (`rounded-clay`), và lớn 32px (`rounded-clay-lg`).
- **Vùng an toàn cho bóng button**: `shadow-clay-raised` lan ra ngoài button khoảng 8–16px. Khi đặt button trong modal, vùng `overflow` hoặc nhóm nhiều button, phải chừa padding quanh mép và gap đủ lớn để bóng không bị cắt hoặc chồng lên nhau. Không khai báo lại `shadow-clay-raised` trong `className` khi base `Button` đã cung cấp bóng theo variant; vùng nút cuối nội dung cuộn cần có padding đáy riêng.
- **Nguồn tài nguyên Fonts**: Load thông qua thẻ `<link>` của Google Fonts trực tiếp trong `index.html` để tối ưu thời gian tải trang.
- **Phong cách Icon**: Tự thiết kế các inline SVG dạng blob dày, tròn trịa, nhiều màu sắc pastel thay vì dùng icon nét mảnh phẳng thông thường.
- **Hệ thống Light/Dark Theme**: Màu nền, surface, chữ, border, trạng thái và bóng Claymorphism phải đi qua semantic CSS variables được ánh xạ trong `tailwind.config.js`; không gắn màu light-only trực tiếp trong component. Lựa chọn `light`/`dark` được lưu cục bộ bằng Zustand, áp dụng `data-theme` lên `<html>` và đồng bộ `zaui-theme` lên cả `<html>` lẫn `<body>` vì stylesheet của ZaUI dùng selector `body[zaui-theme]`; đồng thời mọi màn hình dùng toggle chung để chuyển đổi nhất quán.
- **Đa ngôn ngữ frontend**: UI hỗ trợ `vi` và `en` qua `src/i18n/`, lưu lựa chọn bằng khóa `finwise.locale` và dùng `Intl` với `vi-VN`/`en-US` cho tiền tệ, số và ngày. Chỉ dịch text hiển thị; enum, mã tiền tệ, ID và payload API giữ nguyên. Khi thêm locale mới, thêm resource/config locale và translation key tương ứng, không đưa text hiển thị trực tiếp vào component.
- **Nhập liệu số tiền**: Mọi ô nhập số tiền trong ứng dụng (gồm số dư ví, số tiền giao dịch trong form, và số tiền tối thiểu/tối đa trong bộ lọc giao dịch) đều được định dạng số tự động (ngăn cách hàng nghìn cục bộ và tối đa 2 chữ số thập phân), đảm bảo trải nghiệm nhập liệu tài chính thống nhất và đồng bộ.
- **Điều khiển tiến độ tương tác**: Các thanh tiến độ cho phép người dùng điều chỉnh phải dùng cùng cấu trúc `−`/slider/`+` từ base component, hiển thị giá trị hiện tại rõ ràng và giữ label liên kết với slider. Hai nút dùng bề mặt, bóng đổ và transition Claymorphism; nút giảm/tăng phải disabled khi giá trị chạm giới hạn tương ứng. Quy tắc này không áp dụng cho `ProgressBar` chỉ dùng để hiển thị trạng thái.
- **Quản lý Routing**: Sử dụng cấu hình router của ZMP UI / React Router tích hợp bên trong template để dẫn hướng giữa các màn hình nghiệp vụ và `/style-guide`.
- **Hiển thị Category**: Trang quản lý danh mục tại `/categories` dùng `GET /categories/tree` làm nguồn hiển thị chính, giữ cấu trúc cha/con và sắp xếp đệ quy ở client vì tree endpoint không nhận tham số sort. Danh mục hệ thống là chỉ đọc và tên hiển thị được ánh xạ theo locale mà không thay đổi payload API; danh mục cá nhân giữ nguyên tên người dùng nhập và hỗ trợ tạo/sửa, archive cả nhánh, restore. Parent picker chỉ cho chọn danh mục đang hoạt động, cùng loại giao dịch và loại trừ chính node cùng toàn bộ hậu duệ để tránh chu trình.
- **Quản lý Budget**: Trang `/budgets` và `/budgets/:id` dùng trực tiếp usage do Budget API tính (`spentAmount`, `remainingAmount`, `usagePercentage`, `timeStatus`, `status`) để giữ một nguồn sự thật chung cho UI, báo cáo, thông báo và AI. `DELETE /budgets/:id` là archive/xóa mềm nhằm bảo toàn lịch sử; ngân sách đã archive chỉ đọc đến khi restore. Mọi mutation giao dịch phải invalidate cache `budgets` vì số tiền đã chi phụ thuộc giao dịch EXPENSE.
- **Quản lý Saving Goal**: Trang `/saving-goals` và `/saving-goals/:id` dùng trực tiếp progress do Saving Goal API tính (`savedAmount`, `remainingAmount`, `progressPercentage`, `daysRemaining`, `isOverdue`) để giữ một nguồn sự thật chung cho UI, báo cáo và AI. `DELETE /saving-goals/:id` là archive/xóa mềm nhằm bảo toàn lịch sử; mục tiêu archive chỉ đọc đến khi restore. Contribution được quản lý riêng và mọi mutation contribution phải làm mới cả detail, list goal và lịch sử contribution.
- **Báo cáo tài chính**: Trang `/reports` dùng trực tiếp bốn Report API (`overview`, `cash-flow`, `spending-by-category`, `budget-performance`) qua TanStack Query và luôn giữ số liệu tách theo tiền tệ; không cộng gộp các loại tiền tệ khác nhau. Bộ lọc khoảng ngày tùy chọn gửi mốc kết thúc dạng exclusive sang Backend nhưng hiển thị ngày kết thúc dạng inclusive cho người dùng. Biểu đồ dùng SVG/CSS với semantic Clay tokens, không phụ thuộc thư viện chart. Thẻ Tổng quan ngân sách phải thể hiện số liệu tổng hợp (đã chi, còn lại, hạn mức và số lượng theo trạng thái), còn Hiệu suất ngân sách trình bày từng ngân sách; tổng quan chỉ ưu tiên summary `OVERALL` khi `budgetCount > 0`, nếu không fallback sang `CATEGORY`, và hiển thị `—` thay vì `0%` khi không có ngân sách hợp lệ. Khối AI tại báo cáo phải hiển thị trọn bản tóm tắt cùng tối đa ba điểm đáng chú ý, sau đó mới dẫn sang Trợ lý AI để phân tích sâu; khi điều hướng phải giữ `dateFrom`/`dateTo`/`currency` của kỳ báo cáo và nút quay lại phải trở về báo cáo.
- **Thông báo & nhắc nhở**: Trang `/notifications` là trung tâm chung cho inbox thông báo, lịch nhắc và tùy chọn cảnh báo. Unread count dùng query key riêng và được hiển thị bằng badge chuông toàn cục sau đăng nhập; danh sách/count/reminder polling mỗi 30 giây khi đang hoạt động, refetch khi focus và mọi mutation invalidate namespace liên quan. Reminder datetime luôn dùng Vietnamese wall time rồi chuyển sang UTC ISO bằng helper business-time. Với cảnh báo tự động do Backend hiện tạo bằng tiếng Anh, frontend nhận diện đúng mẫu theo `type`, dùng metadata để dựng title/message theo locale; nội dung người dùng nhập, legacy không khớp mẫu và AI tương lai được giữ nguyên. Notification `data` giữ kiểu mở `Record<string, unknown>` để tiếp nhận metadata cảnh báo/AI mà UI không phụ thuộc cấu trúc riêng. Điều hướng từ nút xem chi tiết gắn `fromNotifications` trong route state; các trang đích hệ thống dùng history back khi có marker này và giữ fallback back cố định cho luồng truy cập trực tiếp.
- **Giao dịch tự động định kỳ**: Trang `/recurring-transactions` quản lý lịch thu/chi tự động qua
  TanStack Query, gồm tạo/sửa, pause/resume, xóa mềm, preview ngày chạy và lịch sử occurrence.
  Trên trang chủ, đây là một mục thuộc **Danh mục Nghiệp vụ**, đặt cạnh giao dịch thường; không xếp trong
  **Tính năng Nâng cao** dù được phát triển trong Upgrade 6.
  Màn subscription yêu cầu người dùng chọn ví và xác nhận rõ trước khi chuyển một gợi ý thành lịch
  tự động; UI luôn nêu rõ tính năng chỉ ghi sổ FinWise, không thực hiện thanh toán ngân hàng.
- **Tiêu đề trang**: Mỗi route cập nhật `document.title` theo mẫu `<Tên trang> | FinWise` thông qua component dùng chung trong router; route chưa nhận diện dùng tiêu đề mô tả sản phẩm mặc định.
- **Khoảng trống và nút điều khiển trên header hệ thống**: Zalo Mini App mặc định hiển thị `zaui-header` ở phía trên. Mọi page/layout phải chừa đủ khoảng cách phía trên (tính cả safe area khi cần) để nội dung và phần tử tương tác không bị header che khuất. Cụm điều khiển riêng của app (hiện gồm theme và ngôn ngữ) phải nằm trong `.finwise-header-controls`, đặt về bên trái vùng native `right-buttons` rộng 96px; đồng thời `zaui-header` phải dành đủ `padding-right` cho cả `right-buttons` và cụm này. Không đặt từng nút bằng offset `right` rời rạc vì có thể làm switch ngôn ngữ bị che khuất.
- **Cấu hình API**: Base URL mặc định là `http://localhost:7777/api/v1` (tương tác trực tiếp với port 7777 của Backend).
- **API Key & Webhook Callback**: Trang `/admin/integrations` thuộc Trung tâm quản trị và quản lý API key/webhook theo permission động. Raw API key và webhook signing secret chỉ được giữ trong state của modal tạo mới, xóa khỏi mutation cache ngay sau khi nhận và không lưu vào browser storage; UI luôn yêu cầu API key mới có ít nhất một scope để tránh cấp toàn quyền ngầm.
- **Vite/ZMP entry**: Giữ `index.html` tại root repository và không cấu hình Vite `root: "./src"`. ZMP CLI khởi chạy dev server với project root; cấu hình khác sẽ khiến iframe app trả 404. Build output chuẩn là `www/` tại root.
- **Luồng xác thực**: Khi app mount, `AuthInitializer` gọi `/auth/me`; `AuthGuard` chỉ render private route sau khi khởi tạo xong và chuyển người dùng chưa đăng nhập tới `/login`. Cookie HTTP-only là cơ chế xác thực ưu tiên.
- **Upload file**: Browser tải file trực tiếp lên Cloudflare R2 bằng presigned PUT URL do backend
  cấp; không proxy binary qua API và không đưa R2 credentials vào frontend. Hiện luồng này chỉ áp
  dụng cho avatar JPEG/PNG/WebP tối đa 5 MB; chỉ cập nhật profile sau khi PUT thành công.
- **Preview file local**: CSP của Mini App cho phép scheme `blob:` vì ảnh/PDF người dùng vừa chọn
  và hóa đơn tải qua API được hiển thị bằng object URL. Mọi object URL do component tạo phải được
  revoke khi file thay đổi hoặc component unmount.
- **Crop avatar**: Trang hồ sơ mở trình chỉnh avatar khi chạm trực tiếp vào ảnh; điểm lấy nét X/Y
  được lưu trên profile và dùng nhất quán ở mọi nơi hiển thị avatar.
  Badge cây viết là lớp phủ không nhận pointer nằm ngoài button; vùng focus/active của button phải
  cố định đúng hình tròn avatar, không được nới rộng theo badge.
  Hai điều khiển Ngang/Dọc dùng cùng spacing và cùng cấu trúc nút
  `−`/slider/`+`. Nút giảm hoặc tăng phải disabled khi giá trị đã chạm giới hạn tương ứng;
  toàn bộ điều khiển disabled khi chưa có ảnh hoặc đang lưu. Dựa trên kích thước thật của ảnh
  khóa cả dòng Ngang/Dọc kèm biểu tượng khóa nếu tỷ lệ ảnh không có vùng dư
  để dịch theo chiều đó.

## Trạng thái đã biết

- Đã cấu hình React 18, Vite 5, ZMP SDK/UI, Tailwind và bộ base components Claymorphism.
- Đã có các màn hình đăng nhập, đăng ký, quên mật khẩu, đặt lại mật khẩu, trang chủ, hồ sơ và Style Guide.
- Đã kết nối frontend với API xác thực, React Query và Zustand auth store.
- Dev server dùng cổng 13579 cho nội dung app và cổng 13580 cho khung mô phỏng; `index.html` tiếp tục nằm ở root để tránh iframe trả 404 hoặc màn hình đen.
- Module quản lý ví đã có frontend tại `/wallets`, kết nối đầy đủ Wallet API qua TanStack Query, gồm danh sách/chi tiết, tạo/sửa, đặt mặc định, lưu trữ/khôi phục, tìm kiếm, sắp xếp và phân trang. `DELETE /wallets/:id` được thể hiện trong UI là lưu trữ mềm, đúng quy tắc Backend bảo toàn lịch sử.
- Module quản lý danh mục đã có frontend tại `/categories`, kết nối Category API qua TanStack Query, gồm cây cha/con, tạo/sửa, tìm kiếm, lọc loại/nguồn/trạng thái, sắp xếp, lưu trữ và khôi phục; toàn bộ nội dung có bản dịch Việt/Anh.
- Module quản lý giao dịch đã có frontend tại `/transactions`, kết nối Transaction API qua TanStack Query, gồm danh sách lịch sử theo ngày, xem/tạo/sửa/xóa giao dịch, lọc nâng cao, sắp xếp, phân trang và đính kèm hóa đơn.
- Module quản lý chuyển tiền đã có frontend tại `/transfers`, dùng contract `GET/POST /transfers` và `DELETE /transfers/:id` qua TanStack Query; gồm form chọn ví nguồn/đích, validation số dư và hai ví khác nhau, xác nhận trước khi chuyển/xóa, lịch sử có tìm kiếm/lọc/sắp xếp/phân trang và đầy đủ loading/error/empty state. Sau thao tác tạo hoặc xóa, frontend làm mới cache transfer, wallet và transaction để lấy lại số dư do Backend tính toán.
- Module quản lý ngân sách đã có frontend tại `/budgets` và `/budgets/:id`, kết nối Budget API qua TanStack Query, gồm danh sách/chi tiết, tạo/sửa, archive/restore, tìm kiếm, lọc loại/chu kỳ/danh mục/thời điểm, sắp xếp, phân trang và cảnh báo trực quan theo tỷ lệ sử dụng; đầy đủ validation, loading/error/empty/confirmation và bản dịch Việt/Anh.
- Module mục tiêu tiết kiệm đã có frontend tại `/saving-goals` và `/saving-goals/:id`, kết nối Saving Goal API qua TanStack Query, gồm danh sách/chi tiết, tạo/sửa, pause/resume, archive/restore, tìm kiếm, lọc trạng thái/thời hạn, sắp xếp, phân trang và quản lý đầy đủ tạo/sửa/xóa lịch sử đóng góp; có validation, loading/error/empty/confirmation và bản dịch Việt/Anh.
- Module báo cáo tài chính đã có frontend tại `/reports`, kết nối đầy đủ Report API qua TanStack Query, gồm lọc ngày/tuần/tháng/năm/khoảng tùy chọn, ví và tiền tệ; KPI tổng quan, dòng tiền, cơ cấu chi tiêu, hiệu suất ngân sách, mục tiêu tiết kiệm, loading/error/empty state, responsive và bản dịch Việt/Anh. Khối tóm tắt AI đã tích hợp AI Insights, hiển thị nhận định cùng các điểm nổi bật và điều hướng sang phân tích chi tiết với phạm vi báo cáo được giữ nguyên.
- Module thông báo và nhắc nhở đã có frontend tại `/notifications`, kết nối Notification/Reminder API qua TanStack Query, gồm badge chưa đọc toàn cục, danh sách/lọc/phân trang, đánh dấu đọc một/tất cả, xóa, điều hướng tới nguồn, CRUD và bật/tắt lịch nhắc, tùy chọn loại cảnh báo/kênh nhận; có polling gần thời gian thực, loading/error/empty state, xác nhận thao tác và bản dịch Việt/Anh.
- Module dự báo dòng tiền và ngân sách (Upgrade 1) đã có frontend tại `/forecast`, kết nối Forecast API (`/forecast/runway`, `/forecast/budget-depletion`) qua TanStack Query; gồm chọn khoảng dự báo (14, 30, 60, 90 ngày), số dư dự kiến cuối khoảng và chênh lệch so với hiện tại, thước đo số ngày an toàn tài chính (runway) với exponential burn velocity ($\lambda=0.04$), phân tích nguy cơ vỡ ngân sách, hạn mức chi tối đa mỗi ngày, Claymorphism skeleton loading, error/retry state, và bản dịch Việt/Anh.
- Module mô phỏng kịch bản tài chính What-if (Upgrade 2) đã có frontend tại `/simulations`, kết nối Simulation API (`/simulations/presets`, `/simulations/run`) qua TanStack Query; gồm áp dụng kịch bản mẫu có sẵn, thanh trượt thời gian 3-36 tháng đúng contract Backend, cấu hình biến động dòng tiền tùy chỉnh (tăng/giảm thu nhập, chi tiêu), bảng so sánh số dư baseline/simulated, cảnh báo nguy cơ thâm hụt, tác động đến mục tiêu tiết kiệm, diễn biến trajectory từng tháng, skeleton loading và bản dịch Việt/Anh.
- Module phát hiện chi tiêu bất thường (Upgrade 3) đã có frontend tại `/anomalies`, kết nối Anomaly API (`/anomalies/recent`, `/anomalies/evaluate`) qua TanStack Query; gồm công cụ kiểm tra nhanh giao dịch trước khi chi (Pre-Purchase Evaluator) dựa trên Modified Z-Score & MAD, danh sách lịch sử giao dịch bị gắn cờ với mức độ nghiêm trọng và mã lý do, skeleton loading và bản dịch Việt/Anh.
- Module tự động nhận diện dịch vụ định kỳ (Upgrade 4) đã có frontend tại `/subscriptions`, kết nối Subscription API (`/subscriptions/discover`, `/subscriptions/convert-to-reminder`) qua TanStack Query; gồm danh sách các gói cước định kỳ phát hiện được với chu kỳ và độ chắc chắn, cảnh báo tăng giá cước (price drift), nút 1-click chuyển đổi thành nhắc nhở tự động, skeleton loading và bản dịch Việt/Anh.
- Module truy vấn thông minh DSL (Upgrade 5) đã có frontend tại `/query`, kết nối Query API (`/query/parse`, `/query/execute`) qua TanStack Query; gồm thanh nhập liệu ngôn ngữ tự nhiên, chip câu hỏi gợi ý nhanh, bộ kiểm tra cây cú pháp trừu tượng AST, thẻ tổng hợp số liệu thống kê trực tiếp từ DB, phân tích theo nhóm (GroupBy) và danh sách giao dịch chi tiết, skeleton loading và bản dịch Việt/Anh.
- Module giao dịch tự động định kỳ (Upgrade 6) có frontend tại `/recurring-transactions`, kết nối
  CRUD, pause/resume, preview và history API; hỗ trợ tạo lịch trực tiếp hoặc chuyển từ subscription,
  có loading/error/empty state và bản dịch Việt/Anh.
- Module tích hợp hệ thống thuộc Trung tâm quản trị tại `/admin/integrations`, kết nối API Key và Webhook API qua TanStack Query; gồm tạo/thu hồi key, giới hạn scope/IP/hết hạn, tạo/sửa/tắt/xóa/test webhook, xem lịch sử delivery và phát lại delivery lỗi, với secret một lần, loading/error/empty state và bản dịch Việt/Anh.
- **Dynamic RBAC & Phân quyền Frontend (Upgrade 7)**:
  - Phân quyền dựa trên danh sách `user.permissions` động từ API `/auth/me` và JWT token.
  - Sử dụng `<PermissionGate permission={PERMISSIONS.*} fallback={<AccessDenied />}>` để bảo vệ routes và ẩn/hiện action buttons trên UI.
  - QUY TẮC BẮT BUỘC: Tất cả tên quyền (Permission names) PHẢI được import từ `@/common/constants/permission.constant.ts` (hoặc `@/common/constants`), TUYỆT ĐỐI KHÔNG hardcode chuỗi string permission rải rác trong code.
  - Các vai trò hệ thống mặc định/bất biến được định nghĩa tập trung qua `SYSTEM_ROLES` trong `src/common/constants/system-role.constant.ts`.
  - Màn hình quản lý phân quyền Claymorphism tại `/roles` và `/admin/roles` gồm: Danh sách Roles, Ma trận phân quyền theo Resource/Action, Thêm/Sửa/Xóa vai trò tùy chỉnh và Nhật ký kiểm toán (Audit Logs).
  - Admin Control Center tại `/admin` dùng TanStack Query và permission động, gồm dashboard KPI/hoạt động gần đây, danh sách người dùng có tìm kiếm-lọc-phân trang, tạo/đổi trạng thái/xóa mềm, chi tiết người dùng có đổi vai trò/khôi phục và lịch sử kiểm toán, cùng audit viewer lọc theo khoảng ngày Việt Nam/action/target và so sánh JSON trước-sau. Trang chủ chỉ hiện lối vào khi có `USER_READ`.
  - Contract Backend hiện chưa cho list hoặc đọc user đã soft-delete (`GET /users` và `GET /users/:id` đều loại `deletedAt != null`), nên nút restore trên detail đã sẵn sàng theo type/permission nhưng chỉ khả dụng khi Backend trả được bản ghi đã xóa.

## Khi cập nhật file này

- Ghi lại các quyết định lâu dài mới về UI/UX hoặc cấu trúc frontend.
- Cập nhật danh sách thư viện hoặc thay đổi lớn trong phương thức kết nối API.
