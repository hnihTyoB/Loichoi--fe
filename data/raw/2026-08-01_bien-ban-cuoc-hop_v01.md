# BIÊN BẢN CUỘC HỌP ĐỊNH HƯỚNG SẢN PHẨM AI & TỰ ĐỘNG HÓA
**Thời gian**: 09:00 - 11:30, Ngày 01/08/2026  
**Địa điểm**: Phòng Họp Chiến Lược A1 & Trực tuyến qua Google Meet  
**Chủ trì**: Giám đốc Kỹ thuật (CTO) - Nguyễn Văn An  
**Thư ký**: Trợ lý Kỹ thuật - Lê Thị Bích  
**Thành phần tham dự**: Đại diện các phòng ban Kỹ thuật, AI R&D, Sản phẩm (Product), Kinh doanh (Sales) và Pháp chế.

---

## 1. Mục Đích Cuộc Họp
- Đánh giá hiện trạng triển khai các công cụ AI trong quý 2/2026.
- Thống nhất kiến trúc 4 thư mục (`prompts`, `data`, `agents`, `evals`) cho toàn bộ các dự án AI nội bộ.
- Đặt mục tiêu nâng cao độ chính xác của AI Agent từ 75% lên trên 85% dựa trên hệ thống Scorecard kiểm thử định lượng.

## 2. Nội Dung Thảo Luận & Phát Biểu
1. **Ông Nguyễn Văn An (CTO)**:
   - Việc lưu prompt và test rải rác đang gây khó khăn khi onboarding thành viên mới và không đo lường được chất lượng AI sau khi đổi model.
   - Yêu cầu bắt buộc mọi module AI phải có bộ kiểm thử tại `evals/tests/` và lưu lại trace để phân tích nguyên nhân lỗi.

2. **Bà Trần Thu Hà (Trưởng phòng Pháp chế)**:
   - Các dữ liệu đầu vào chứa thông tin khách hàng phải được khử PII tại `data/processed/` trước khi gửi lên API của mô hình ngôn ngữ lớn (LLM).
   - Tuyệt đối giữ nguyên dữ liệu gốc tại `data/raw/` để phục vụ công tác kiểm toán nội bộ.

3. **Ông Phạm Minh Đức (Product Manager)**:
   - Đề xuất bổ sung 4 Agent chuyên biệt phục vụ vận hành: Nghiên cứu, Báo cáo, Nhân sự và Kinh doanh.
   - Mỗi Agent cần có bộ công cụ và giới hạn trách nhiệm rõ ràng, tránh làm một Agent đa năng quá tải.

## 3. Kết Luận & Phân Công Nhiệm Vụ
| STT | Nhiệm vụ | Người phụ trách | Thời hạn hoàn thành |
| :--- | :--- | :--- | :--- |
| 1 | Chuẩn hóa cấu trúc 4 thư mục và ban hành tài liệu hướng dẫn | Nguyễn Văn An | 15/08/2026 |
| 2 | Xây dựng bộ test cases và scorecard đánh giá 100 điểm | Lê Thị Bích | 20/08/2026 |
| 3 | Triển khai pipeline làm sạch dữ liệu và khử PII tự động | Đội Data Engineering | 25/08/2026 |
| 4 | Thử nghiệm 4 AI Agent chuyên biệt | Đội AI R&D | 30/08/2026 |
