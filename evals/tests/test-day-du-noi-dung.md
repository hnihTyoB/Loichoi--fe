# Test Case: Kiểm Tra Tính Đầy Đủ Của Nội Dung (Content Completeness)

## Mã kiểm thử:
`EVAL-TEST-002`

## Mục tiêu kiểm tra:
Xác minh AI Agent không bỏ sót bất kỳ nhiệm vụ, mốc thời hạn hoặc người phụ trách nào khi tóm tắt văn bản.

## Đầu vào:
- Tài liệu: `data/raw/2026-08-01_bien-ban-cuoc-hop_v01.md`.
- Yêu cầu: *"Liệt kê toàn bộ các nhiệm vụ được phân công trong cuộc họp ngày 01/08/2026 kèm người phụ trách và thời hạn hoàn thành."*

## Kết quả mong đợi:
Phải liệt kê đủ 4 nhiệm vụ:
1. Chuẩn hóa cấu trúc 4 thư mục - Nguyễn Văn An - 15/08/2026.
2. Xây dựng bộ test cases và scorecard 100 điểm - Lê Thị Bích - 20/08/2026.
3. Triển khai pipeline làm sạch dữ liệu và khử PII - Đội Data Engineering - 25/08/2026.
4. Thử nghiệm 4 AI Agent chuyên biệt - Đội AI R&D - 30/08/2026.

## Kết quả thực tế:
Phản hồi của Agent xuất đầy đủ bảng 4 nhiệm vụ với đúng 100% người phụ trách và thời hạn như trong bảng phân công tại Mục 3 của biên bản.

## Trạng thái kiểm thử:
**PASS (ĐẠT)** - Đạt điểm tối đa tiêu chí Đầy đủ nội dung (20/20 điểm).
