# Hướng Dẫn Sử Dụng Công Cụ: Gọi API (API Caller)

## Mục đích
Giao tiếp với các dịch vụ bên ngoài hoặc backend API thông qua giao thức HTTP/REST hoặc GraphQL.

## Khi nào sử dụng
- Khi cần tích hợp dữ liệu với hệ thống ERP, CRM, Cổng thanh toán, AI model bên thứ ba.
- Khi cần kích hoạt các webhook hoặc tác vụ tự động hóa từ xa.

## Quy tắc sử dụng
1. **Kiểm tra Phương thức & Endpoint**: Xác định đúng HTTP Method (`GET`, `POST`, `PUT`, `DELETE`) và URL endpoint.
2. **Xác thực bảo mật**: Truyền Token/API Key qua HTTP Header (`Authorization: Bearer <token>`), không bao giờ đưa key vào query parameter công khai.
3. **Xử lý Timeout & Retry**: Thiết lập timeout hợp lý (5-15 giây), có cơ chế thử lại (exponential backoff) với mã lỗi tạm thời (502, 503, 504, 429).
4. **Kiểm tra mã trạng thái**: Kiểm tra `response.status === 200/201` và cấu trúc trường `success` trước khi phân tích payload dữ liệu.
