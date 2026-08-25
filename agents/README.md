# Thư Mục `agents/`: Quản Lý AI Agent, Kỹ Năng Và Công Cụ

Thư mục `agents/` chứa cấu hình, nhiệm vụ, kỹ năng và công cụ của các AI Agent trong hệ thống.

```text
agents/
├── skills/               # Kỹ năng tái sử dụng (Mỗi skill chứa skill.md, examples, templates, references)
├── tools/                # Cấu hình & hướng dẫn tích hợp công cụ (Drive, Mail, Calendar, API, MCP)
├── agent-nghien-cuu/     # Agent chuyên trách nghiên cứu & tổng hợp
├── agent-bao-cao/        # Agent chuyên trách phân tích số liệu & lập báo cáo
├── agent-nhan-su/        # Agent chuyên trách nhân sự & quy chế nội bộ
└── agent-kinh-doanh/     # Agent chuyên trách phân tích kinh doanh & thẩm định giá
```

---

## 1. `skills/` - Kỹ Năng Đóng Gói (Reusable Skills)

Mỗi skill đại diện cho một năng lực có thể tái sử dụng độc lập trên nhiều Agent. Cấu trúc chuẩn của một thư mục skill gồm:

```text
skills/<ten-ky-nang>/
├── skill.md          # Mô tả toàn diện kỹ năng (Tên, Mục tiêu, Input, Quy trình, Tiêu chuẩn, Guardrails, Ví dụ)
├── examples/         # Các kết quả mẫu đạt chuẩn chất lượng cao
├── templates/        # Mẫu khung định dạng đầu ra (Markdown / JSON template)
└── references/       # Tiêu chuẩn, quy định hoặc tài liệu đối chiếu
```

---

## 2. `tools/` - Công Cụ Cho Agent

Chứa hướng dẫn và đặc tả kỹ thuật để Agent kết nối và tương tác với các công cụ:
- Tìm kiếm tài liệu nội bộ / RAG.
- Đọc dữ liệu từ Google Drive, OneDrive.
- Xử lý file Excel, CSV, Google Sheets.
- Gửi email tự động thông báo qua SMTP / Gmail API.
- Tạo lịch hẹn qua Google Calendar API.
- Truy vấn REST API / GraphQL.
- Kết nối giao thức máy chủ ngữ cảnh Model Context Protocol (MCP).

---

## 3. Các Agent Chuyên Biệt (Specialized Agents)

> [!IMPORTANT]
> **NGUYÊN TẮC THIẾT KẾ AGENT**: Mỗi Agent chỉ đảm nhận một phạm vi công việc chuyên biệt rõ ràng. Tuyệt đối **KHÔNG TẠO MỘT AGENT LÀM TẤT CẢ MỌI VIỆC** (Super Agent) vì sẽ gây xung đột ngữ cảnh, giảm chất lượng suy luận và khó kiểm soát an toàn thông tin.
