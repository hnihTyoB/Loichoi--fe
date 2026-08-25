# Quy trình làm việc (Frontend)

## 1. Trước khi sửa đổi
- Kiểm tra trạng thái git: Chạy `git status` để xem các tập tin đang thay đổi. Tránh ghi đè hoặc commit nhầm code không liên quan của người dùng.
- Tìm hiểu cấu trúc trang hoặc thành phần chuẩn bị chỉnh sửa.

## 2. Khi triển khai
- Tập trung vào tính năng được yêu cầu; không refactor lan man.
- Sử dụng các UI component có sẵn trong `src/components/ui/`, không tự tạo phong cách thiết kế khác.
- Khi thêm một trang mới, phải cập nhật router/navigation trong layout gốc để người dùng có thể điều hướng được.

## 3. Xác minh & Kiểm thử (Verification)
- Luôn chạy build để kiểm tra lỗi biên dịch TypeScript và đóng gói tài nguyên:
  ```bash
  npm run build
  ```
- Khởi động môi trường dev cục bộ để kiểm tra giao diện trực quan:
  ```bash
  npm run start
  ```
- Xác nhận khung mô phỏng `http://localhost:13580` và iframe app `http://localhost:13579` đều phản hồi. Cổng 13579 trả 404 thường có nghĩa `index.html` không còn ở root hoặc Vite `root` bị cấu hình sai.
- Xác nhận build output nằm trong `www/` ở root repository; không chấp nhận output nhầm tại `src/www/`.
- Kiểm tra độ tương thích responsive trên các kích thước màn hình thiết bị di động (tối thiểu là tỷ lệ màn hình 375x812 tiêu chuẩn).

## 4. Trước khi bàn giao
- Xem lại git diff để đảm bảo không có API key nhạy cảm, log thử nghiệm hoặc file thừa.
- Viết báo cáo ngắn gọn mô tả các thay đổi chính, cách kiểm thử thủ công và các ảnh chụp màn hình/video demo (nếu có thay đổi UI).
