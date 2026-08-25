# Thư Mục `prompts/`: Quản Lý Toàn Bộ Câu Lệnh

Thư mục `prompts/` chứa các prompt được sử dụng trong dự án. Thay vì viết prompt trực tiếp trong cửa sổ chat hoặc lưu rải rác trong tài liệu, hãy lưu mỗi prompt thành một file riêng.

Lợi ích lớn nhất của `prompts/` là prompt được quản lý giống như mã nguồn: có thể cập nhật phiên bản, kiểm tra thay đổi (git diff) và tái sử dụng trong nhiều dự án.

---

## Cấu trúc thư mục

```text
prompts/
├── system/     # System prompt / bộ hướng dẫn nền tảng
├── tasks/      # Prompt dành cho từng nhiệm vụ cụ thể
└── tools/      # Hướng dẫn sử dụng công cụ
```

---

## 1. `system/` - Bộ Hướng Dẫn Nền Tảng

Quy định vai trò, nguyên tắc và cách AI phải làm việc. Một system prompt chuẩn thường bao gồm 6 mục:
1. **Vai trò của AI**: AI là ai, chuyên môn gì.
2. **Mục tiêu công việc**: Kết quả cốt lõi cần đạt được.
3. **Quy trình xử lý**: Trình tự phân tích và suy luận.
4. **Nguyên tắc trích dẫn**: Cách dẫn nguồn dữ liệu từ ngữ cảnh.
5. **Định dạng đầu ra**: Cấu trúc phản hồi (Markdown, JSON, bảng).
6. **Những việc AI không được thực hiện (Guardrails)**: Giới hạn an toàn, từ chối giả định/bịa đặt.

---

## 2. `tasks/` - Nhiệm Vụ Cụ Thể

Chứa prompt dành cho từng tác vụ riêng biệt. Mọi task prompt nên tuân thủ mẫu chuẩn 5 mục:
- **Mục tiêu**: Tuyên bố ngắn gọn về kết quả cần hoàn thành.
- **Dữ liệu đầu vào**: Danh sách các tài liệu, biến số hoặc tham số đầu vào.
- **Các bước thực hiện**: Hướng dẫn chi tiết từng bước cho AI.
- **Tiêu chí kiểm tra**: Điều kiện để đánh giá kết quả đạt hay chưa đạt.
- **Định dạng đầu ra**: Mẫu định dạng phản hồi chuẩn.

---

## 3. `tools/` - Hướng Dẫn Khai Thác Công Cụ

Chứa hướng dẫn rõ ràng để AI biết khi nào và làm thế nào để sử dụng các công cụ như tìm kiếm web, đọc file, xử lý Excel, truy vấn cơ sở dữ liệu hoặc gọi API.
