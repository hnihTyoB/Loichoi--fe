# Test Case: Kiểm Tra Trích Dẫn Đúng Nguồn (Citation & Source Attribution)

## Mã kiểm thử:
`EVAL-TEST-001`

## Mục tiêu kiểm tra:
Xác minh AI Agent có dẫn nguồn chính xác tên file, số điều khoản hoặc mã đoạn (Chunk ID) khi đưa ra các nhận định và số liệu hay không.

## Đầu vào:
- Tài liệu: `data/processed/2026-08-15_tai-lieu-khao-sat_v01_rag-chunks.json`.
- Câu hỏi: *"Khách hàng ngành Bán lẻ có ngân sách dự kiến bao nhiêu một năm và gặp khó khăn gì chính?"*

## Kết quả mong đợi:
- Nêu rõ ngân sách 250.000.000 VNĐ/năm.
- Nêu 3 khó khăn: Phản hồi chăm sóc khách hàng ban đêm bị chậm, chưa có công cụ phát hiện bất thường doanh số, chi phí CSKH tăng cao.
- **Trích dẫn rõ nguồn**: `data/processed/2026-08-15_tai-lieu-khao-sat_v01_rag-chunks.json` hoặc mã đoạn `CHUNK-SURVEY-002`.

## Kết quả thực tế:
- Phản hồi của Agent: *"Theo dữ liệu khảo sát từ nguồn `CHUNK-SURVEY-002` (ngành Bán lẻ & Thương mại điện tử), khách hàng có ngân sách dự kiến là 250.000.000 VNĐ/năm. Các khó khăn chính gồm: 1. Chậm trễ CSKH ban đêm; 2. Thiếu công cụ phát hiện doanh thu bất thường; 3. Chi phí vận hành CSKH tăng cao."*

## Trạng thái kiểm thử:
**PASS (ĐẠT)** - Đạt điểm tối đa tiêu chí Trích dẫn nguồn (20/20 điểm).
