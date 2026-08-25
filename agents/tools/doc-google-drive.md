# Công Cụ Agent: Đọc Dữ Liệu Google Drive (Google Drive Reader Tool)

## Cấu hình
- **Tool Name**: `read_google_drive`
- **Authentication**: OAuth 2.0 / Service Account
- **Supported Formats**: Google Docs, Google Sheets, Google Slides, PDF

## Tham số đầu vào
```json
{
  "file_id": "string (ID của file trên Google Drive)",
  "export_format": "text/markdown | application/json",
  "max_pages": 20
}
```

## Hướng dẫn cho Agent
1. Kiểm tra quyền truy cập file trước khi thực hiện trích xuất.
2. Với file Google Sheets, chỉ định rõ tên Sheet cần đọc để tối ưu token.
3. Không chia sẻ liên kết file chứa dữ liệu nhạy cảm ra ngoài tổ chức.
