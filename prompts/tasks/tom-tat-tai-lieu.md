# Task Prompt: Tóm Tắt Tài Liệu (Document Summarization)

## Mục tiêu:
Trích xuất và tóm tắt những luận điểm quan trọng, số liệu then chốt và kết luận cốt lõi từ tài liệu đầu vào một cách cô đọng, chính xác, tiết kiệm thời gian đọc hiểu cho người dùng.

## Dữ liệu đầu vào:
- **Tài liệu gốc**: Đoạn văn bản, file PDF/Word/Markdown hoặc nội dung đã được xử lý tại `data/processed/`.
- **Độ dài mong muốn**: Ngắn gọn (1-2 đoạn), Trung bình (1 trang tóm tắt) hoặc Chi tiết theo từng đề mục.
- **Đối tượng độc giả**: Ban lãnh đạo, Chuyên viên kỹ thuật hoặc Khách hàng đại chúng.

## Các bước thực hiện:
1. Đọc lướt toàn bộ tài liệu để nắm bắt chủ đề và thông điệp chính.
2. Xác định cấu trúc văn bản: Phần giới thiệu, các phát hiện/luận điểm chính, số liệu chứng minh, và kết luận/hành động tiếp theo.
3. Trích xuất các ý chính theo nguyên tắc MECE (Mutually Exclusive, Collectively Exhaustive - Không trùng lặp, Không bỏ sót).
4. Soạn thảo bản tóm tắt theo cấu trúc 3 phần:
   - **Tóm tắt điều hành (Executive Summary)**: 2-3 câu nêu bật bức tranh toàn cảnh.
   - **Điểm nổi bật then chốt (Key Takeaways)**: 3-5 gạch đầu dòng chứa số liệu và phát hiện quan trọng.
   - **Hành động đề xuất (Action Items / Next Steps)**: Các việc cần làm tiếp theo (nếu có).
5. Rà soát lại bản tóm tắt đối chiếu với tài liệu gốc để đảm bảo không sai lệch số liệu và không tự tạo thông tin.

## Tiêu chí kiểm tra:
- [ ] Không bỏ sót bất kỳ luận điểm hay số liệu cốt lõi nào trong tài liệu gốc.
- [ ] Độ dài không vượt quá 20% dung lượng văn bản gốc.
- [ ] Mọi số liệu nêu ra đều có thể truy nguyên từ tài liệu đầu vào.
- [ ] Tuyệt đối không chứa thông tin bịa đặt (0% Hallucination).

## Định dạng đầu ra:
```markdown
# [TÊN TÀI LIỆU ĐƯỢC TÓM TẮT]

## 📌 Tóm Tắt Điều Hành (Executive Summary)
> [Đoạn văn ngắn gọn 2-3 câu mô tả thông điệp cốt lõi]

## 🎯 Các Phát Hiện & Số Liệu Then Chốt
- **[Chủ đề 1]**: [Mô tả chi tiết kèm số liệu cụ thể, ví dụ: tăng trưởng 25%...]
- **[Chủ đề 2]**: [Mô tả chi tiết...]
- **[Chủ đề 3]**: [Mô tả chi tiết...]

## 🚀 Đề Xuất & Hành Động Tiếp Theo
1. [Hành động 1 - Người phụ trách/Thời hạn nếu có]
2. [Hành động 2]
```
