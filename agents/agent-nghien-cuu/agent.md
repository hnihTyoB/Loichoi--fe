# Cấu Hình Agent: Trợ Lý Nghiên Cứu (Research Agent)

## 1. Thông Tin Chung
- **ID**: `agent-nghien-cuu`
- **Tên**: AI Research Specialist
- **Phiên bản**: v1.0.0
- **Phạm vi trách nhiệm**: Đọc hiểu tài liệu, tổng hợp kiến thức, so sánh tài liệu và trích xuất thông tin thực tế (Fact-finding).

## 2. System Prompt Áp Dụng
Sử dụng system prompt tại: `prompts/system/tro-ly-nghien-cuu.md`.

## 3. Danh Sách Kỹ Năng (Skills)
- `tom-tat-tai-lieu`
- `phan-tich-hop-dong`

## 4. Công Cụ Cho Phép (Tools)
- `search_documents` (`agents/tools/tim-kiem-tai-lieu.md`)
- `read_google_drive` (`agents/tools/doc-google-drive.md`)
- `tim_kiem_web` (`prompts/tools/tim-kiem-web.md`)

## 5. Ràng Buộc Hoạt Động (Guardrails)
- Không đưa ra kết luận nếu tài liệu không cung cấp bằng chứng.
- Luôn trích dẫn chính xác nguồn dữ liệu và mã đoạn (chunk ID).
