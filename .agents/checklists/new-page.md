# Checklist thêm trang mới

- [ ] Tạo thư mục trang tương ứng dưới `src/pages/<tên-trang>/`.
- [ ] Khai báo Component trang chính (ví dụ: `index.tsx`).
- [ ] Đăng ký tuyến đường (route) mới trong layout gốc hoặc hệ thống router chính của Zalo Mini App.
- [ ] Thiết kế giao diện sử dụng 100% components có sẵn từ `src/components/ui/` (Button, Card, Input, v.v.).
- [ ] Định nghĩa các Zod schema nếu trang có chứa form thu thập dữ liệu và tích hợp với React Hook Form.
- [ ] Tạo services và endpoints tương tác tương ứng trong `src/services/` nếu trang cần kết nối backend.
- [ ] Viết custom React Query hook để thực hiện query/mutation dữ liệu.
- [ ] Xử lý các trạng thái: Loading (sử dụng Skeleton bo tròn), Error (nổi bật đất sét), và Empty (thông báo thân thiện).
- [ ] Đảm bảo thiết kế responsive đầy đủ cho mọi kích thước màn hình điện thoại di động.
- [ ] Chạy build kiểm tra lỗi TypeScript: `npm run build`.
