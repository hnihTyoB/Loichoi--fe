# Hướng Dẫn Sử Dụng Công Cụ: Truy Vấn Cơ Sở Dữ Liệu (Database Query)

## Mục đích
Thực thi các câu lệnh truy vấn có cấu trúc (SQL / NoSQL) để trích xuất dữ liệu trực tiếp từ hệ thống cơ sở dữ liệu.

## Khi nào sử dụng
- Khi cần lấy số liệu cập nhật mới nhất từ database sản phẩm/giao dịch/người dùng.
- Khi cần thực hiện các phép gom nhóm (Aggregation: `GROUP BY`, `JOIN`, `COUNT`, `SUM`) trên lượng dữ liệu lớn.

## Quy tắc an toàn & Sử dụng
1. **Chế độ CHỈ ĐỌC (Read-Only)**: Tuyệt đối chỉ thực hiện các câu lệnh `SELECT`. Nghiêm cấm các câu lệnh sửa đổi dữ liệu (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`).
2. **Luôn giới hạn số lượng bản ghi**: Sử dụng mệnh đề `LIMIT` (ví dụ `LIMIT 100`) để tránh gây nghẽn tài nguyên cơ sở dữ liệu.
3. **Sử dụng Index & Tối ưu hóa**: Tránh quét toàn bộ bảng (Full Table Scan), ưu tiên lọc theo các trường có đánh chỉ mục (Index) như `id`, `created_at`, `status`.
4. **Không đưa dữ liệu nhạy cảm vào log**: Ẩn các trường mật khẩu, token, thông tin thẻ tín dụng khi trích xuất.
