# BIÊN BẢN CUỘC HỌP ĐỊNH HƯỚNG SẢN PHẨM AI (01/08/2026)

## 📌 Tóm Tắt Điều Hành (Executive Summary)
> Cuộc họp do CTO Nguyễn Văn An chủ trì đã chính thức thống nhất chuẩn hóa kiến trúc 4 thư mục (`prompts`, `data`, `agents`, `evals`) cho toàn bộ dự án AI nội bộ, với mục tiêu nâng cao độ chính xác từ 75% lên trên 85% và đáp ứng tiêu chuẩn bảo mật dữ liệu khách hàng.

## 🎯 Các Điểm Trọng Yếu & Số Liệu Then Chốt
- **Kiến trúc chuẩn 4 thư mục**: Bắt buộc triển khai trên toàn bộ hệ thống để quản lý prompt như mã nguồn và bảo toàn dữ liệu gốc.
- **Bảo mật & Phân vùng dữ liệu**: Thư mục `data/raw/` được thiết lập bất biến (chỉ đọc); toàn bộ dữ liệu nạp vào LLM phải được khử PII tại `data/processed/`.
- **Phát triển 4 Agent chuyên biệt**: Phân tách rõ ràng trách nhiệm giữa Agent Nghiên cứu, Báo cáo, Nhân sự và Kinh doanh.
- **Tiêu chuẩn kiểm thử định lượng**: Thiết lập Scorecard 100 điểm với ngưỡng đạt tối thiểu là **80/100 điểm**.

## 🚀 Quyết Định / Hành Động Tiếp Theo
1. **15/08/2026**: Hoàn thành tài liệu hướng dẫn và cấu trúc 4 thư mục (Nguyễn Văn An).
2. **20/08/2026**: Hoàn thiện bộ test cases và scorecard đánh giá (Lê Thị Bích).
3. **25/08/2026**: Đưa vào vận hành pipeline làm sạch dữ liệu tự động (Đội Data Engineering).
4. **30/08/2026**: Thử nghiệm và đánh giá chất lượng 4 AI Agent chuyên biệt (Đội AI R&D).
