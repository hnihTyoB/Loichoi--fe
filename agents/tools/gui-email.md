# Công Cụ Agent: Gửi Email Tự Động (Email Notification Tool)

## Cấu hình
- **Tool Name**: `send_email`
- **Protocol**: SMTP / Gmail API / Resend
- **Mode**: Draft / Direct Send

## Tham số đầu vào
```json
{
  "to": ["recipient@domain.com"],
  "subject": "string (tiêu đề email)",
  "body_html": "string (nội dung email định dạng HTML)",
  "attachments": ["data/processed/report.pdf"]
}
```

## Hướng dẫn an toàn cho Agent
1. **Chế độ kiểm duyệt (Approval Guard)**: Với các email gửi cho khách hàng bên ngoài hoặc lãnh đạo cấp cao, Agent phải tạo bản nháp (Draft) và yêu cầu người dùng xác nhận trước khi gửi.
2. Kiểm tra danh sách địa chỉ người nhận, không gửi nhầm sang người không có thẩm quyền.
