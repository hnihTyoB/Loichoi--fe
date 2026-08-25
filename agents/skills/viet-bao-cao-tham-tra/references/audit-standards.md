# Tiêu Chuẩn & Khung Thẩm Tra Đánh Giá Hệ Thống

## 1. Ma Trận Đánh Giá Mức Độ Rủi Ro
| Mức độ | Khả năng xảy ra | Mức độ tác động | Yêu cầu xử lý |
| :--- | :--- | :--- | :--- |
| 🔴 **Critical (Nghiêm trọng)** | Cao | Rất lớn (Dừng hệ thống / Rò rỉ dữ liệu) | Khắc phục ngay lập tức trong 24h |
| 🟠 **High (Cao)** | Trung bình - Cao | Lớn (Sai lệch số liệu tài chính) | Khắc phục trong vòng 3 ngày |
| 🟡 **Medium (Trung bình)** | Trung bình | Vừa phải (Lỗi định dạng, thiếu sót nhỏ) | Đưa vào kế hoạch sprint tới |
| 🟢 **Low (Thấp)** | Thấp | Nhỏ (Cải tiến giao diện, tối ưu câu chữ) | Xem xét cải tiến khi thuận tiện |

## 2. Nguyên Tắc Thẩm Tra Độc Lập
- Luôn dựa trên bằng chứng kiểm tra thực tế (Facts & Traces), không dựa trên cảm tính.
- Đảm bảo tính nhất quán giữa các kỳ đánh giá.
