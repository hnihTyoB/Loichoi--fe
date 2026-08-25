# Hướng Dẫn Sử Dụng Công Cụ: Xử Lý File Excel & Bảng Tính (Spreadsheet Parser)

## Mục đích
Đọc, trích xuất cấu trúc bảng biểu, tính toán công thức và tổng hợp dữ liệu từ các file bảng tính (`.xlsx`, `.xls`, `.csv`).

## Khi nào sử dụng
- Khi xử lý báo cáo tài chính, danh sách bán hàng, bảng chấm công, bảng theo dõi kho hoặc dữ liệu khảo sát.
- Khi cần tính toán các đại lượng thống kê (Sum, Average, Variance) trên dữ liệu dạng lưới.

## Quy tắc sử dụng
1. **Nhận diện Sheet và Header**: Xác định đúng tên Sheet cần phân tích và dòng chứa tiêu đề cột (Header Row).
2. **Kiểm tra kiểu dữ liệu từng cột**: Phân biệt rõ số tiền (Currency), tỷ lệ (Percentage), ngày tháng (Date/Time), và chuỗi văn bản (String).
3. **Xử lý giá trị trống / lỗi công thức**: Phát hiện các ô `#N/A`, `#VALUE!`, ô trống để xử lý thích hợp (điền 0, gán trung bình hoặc loại trừ).
4. **Chuẩn hóa sang JSON/CSV**: Chuyển đổi dữ liệu đã làm sạch vào thư mục `data/processed/` để AI Agent có thể truy cập nhanh trong các tác vụ tiếp theo.
