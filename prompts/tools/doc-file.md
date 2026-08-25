# Hướng Dẫn Sử Dụng Công Cụ: Đọc File (File Reader)

## Mục đích
Đọc và phân tích nội dung từ các tập tin lưu trữ cục bộ trong hệ thống (`.txt`, `.md`, `.json`, `.csv`, `.pdf`, `.docx`).

## Khi nào sử dụng
- Khi cần nạp dữ liệu gốc từ `data/raw/` hoặc dữ liệu đã qua xử lý từ `data/processed/`.
- Khi cần xem xét các cấu hình hệ thống, bản ghi log hoặc tài liệu đặc tả dự án.

## Quy tắc sử dụng
1. **Kiểm tra định dạng và kích thước file**: Với file lớn (>10 MB), đọc theo từng đoạn (chunking/offset) hoặc sử dụng file đã được trích xuất tại `data/processed/`.
2. **Bảo tồn tính toàn vẹn**: Tuyệt đối không thay đổi nội dung file gốc trong `data/raw/`.
3. **Mã hóa ký tự**: Đảm bảo đọc đúng bảng mã UTF-8 để không bị lỗi font tiếng Việt.
4. **Trích xuất thông tin có cấu trúc**: Chuyển đổi dữ liệu thô thành các mảng JSON hoặc bảng Markdown để dễ dàng truy vấn và phân tích.
