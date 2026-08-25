# TRANSCRIPT CHI TIẾT CUỘC HỌP ĐỊNH HƯỚNG SẢN PHẨM AI
*Dữ liệu đã được bóc tách từ file ghi âm và khử PII (làm sạch)*

- **[09:00:15 - 09:15:30] Mở đầu & Tuyên bố lý do (CTO)**:
  "Chào các anh chị. Trong quý 2 vừa qua chúng ta nhận thấy việc lưu trữ prompt tùy tiện dẫn đến việc chất lượng output của LLM biến động khó kiểm soát. Khi chuyển model từ Claude 3.5 Sonnet sang Gemini 1.5 Pro hay GPT-4o, một số task bị vỡ định dạng. Hôm nay chúng ta thống nhất áp dụng chuẩn 4 thư mục: `prompts/`, `data/`, `agents/`, `evals/`."

- **[09:15:31 - 09:40:00] Ý kiến đại diện Pháp chế**:
  "Bên pháp chế hoàn toàn ủng hộ. Tuy nhiên nhấn mạnh rằng thư mục `data/raw/` phải là thư mục chỉ đọc (read-only), không ai được sửa chữa dữ liệu gốc của khách hàng. Tất cả dữ liệu đưa vào LLM phải nằm ở `data/processed/` sau khi đã xóa bỏ số điện thoại, CMND/CCCD và email cá nhân."

- **[09:40:01 - 10:30:00] Thảo luận về kiến trúc 4 Agent chuyên biệt (PM & AI Team)**:
  "Thay vì dùng một Agent khổng lồ làm tất cả, chúng ta phân tách 4 Agent độc lập:
  1. `agent-nghien-cuu`: Đọc tài liệu, so sánh văn bản, trích xuất facts.
  2. `agent-bao-cao`: Tổng hợp số liệu từ database/excel, sinh báo cáo tuần/tháng.
  3. `agent-nhan-su`: Hỗ trợ quy chế, tra cứu phúc lợi, lọc CV.
  4. `agent-kinh-doanh`: Phân tích thị trường, chuẩn bị kịch bản tư vấn, thẩm tra báo giá."

- **[10:30:01 - 11:30:00] Tiêu chuẩn kiểm thử & Đánh giá (QA / Eval Team)**:
  "Mỗi Agent bắt buộc phải vượt qua ngưỡng $\ge 80/100$ điểm trên Scorecard tiêu chuẩn trước khi được đưa vào production."
