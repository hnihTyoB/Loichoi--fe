# Kỹ Năng: Tóm Tắt Tài Liệu (Document Summarization Skill)

## 1. Tên kỹ năng
`tom-tat-tai-lieu` (Document Summarization)

## 2. Mục tiêu
Rút gọn văn bản dài thành bản tóm tắt súc tích, giữ nguyên 100% các luận điểm trọng yếu, số liệu then chốt và các kết luận cốt lõi mà không làm biến dạng ngữ nghĩa gốc.

## 3. Khi nào sử dụng
- Khi người dùng cung cấp văn bản dài (>500 từ) và yêu cầu nắm bắt nhanh nội dung.
- Khi cần tổng hợp tài liệu phục vụ cho cuộc họp lãnh đạo hoặc báo cáo nhanh.
- Khi cần chuẩn bị tóm tắt điều hành (Executive Summary) cho tài liệu kỹ thuật/kinh doanh.

## 4. Dữ liệu đầu vào
- Văn bản nguồn (Markdown, Plain Text, PDF text).
- Tham số cấu hình: Độ dài tối đa (số từ/đoạn), Ngôn ngữ đầu ra (`vi`/`en`), Trọng tâm cần nhấn mạnh.

## 5. Quy trình thực hiện
1. **Phân tích văn bản**: Quét tài liệu để xác định cấu trúc phân cấp (tiêu đề, đoạn văn, danh sách).
2. **Trích xuất thông tin then chốt**: Thu thập các câu chủ đề (Topic Sentences), số liệu thống kê và quyết định quan trọng.
3. **Loại bỏ thông tin dư thừa**: Cắt bỏ các ví dụ minh họa rườm rà, các câu chuyển tiếp không mang giá trị thông tin mới.
4. **Cấu trúc hóa đầu ra**: Áp dụng mẫu tại `templates/summary-template.md`.
5. **Kiểm tra chéo**: Soát lại số liệu đối chiếu với `references/guidelines.md`.

## 6. Tiêu chuẩn đầu ra
- **Độ chính xác**: 100% số liệu và tên riêng khớp với văn bản nguồn.
- **Tính đầy đủ**: Đầy đủ 3 phần: Tóm tắt tổng quan, Các điểm chính, Hành động tiếp theo.
- **Định dạng**: Markdown sạch, có phân cấp rõ ràng.

## 7. Tình huống KHÔNG ĐƯỢC sử dụng
- Khi tài liệu bị thiếu trang hoặc đứt đoạn làm mất ngữ cảnh cơ bản.
- Khi văn bản có tính chất mật chưa được khử PII tại `data/processed/`.
- Khi người dùng yêu cầu phân tích sâu hoặc đưa ra quyết định pháp lý thay cho chuyên gia.

## 8. Ví dụ mẫu
Tham khảo file mẫu đạt chuẩn tại `examples/sample-summary.md`.
