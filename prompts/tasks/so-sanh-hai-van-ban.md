# Task Prompt: So Sánh Hai Văn Bản (Document Comparison & Diff Analysis)

## Mục tiêu:
So sánh đối chiếu chi tiết hai phiên bản văn bản, hợp đồng hoặc tài liệu kỹ thuật để chỉ ra điểm giống nhau, điểm khác biệt, những nội dung mới thêm vào, bị xóa bỏ hoặc chỉnh sửa, kèm đánh giá mức độ tác động.

## Dữ liệu đầu vào:
- **Văn bản A (Gốc / Phiên bản cũ)**: Đường dẫn file hoặc nội dung văn bản nguồn.
- **Văn bản B (Mới / Phiên bản sửa đổi)**: Đường dẫn file hoặc nội dung văn bản đích.
- **Tiêu chí so sánh**: Toàn văn, Điều khoản thương mại, Rủi ro pháp lý, Thông số kỹ thuật.

## Các bước thực hiện:
1. Phân tách cấu trúc hai văn bản thành các đề mục, điều khoản tương ứng.
2. Đối chiếu từng phần để xác định:
   - Các điểm **Giữ nguyên (Unchanged)**.
   - Các điểm **Thêm mới (Added)**.
   - Các điểm **Xóa bỏ (Deleted)**.
   - Các điểm **Thay đổi nội dung (Modified)**.
3. Đánh giá tác động của từng sự thay đổi (Tích cực, Tiêu cực, Rủi ro tăng lên hay giảm đi).
4. Tổng hợp thành bảng so sánh trực quan (Side-by-side Diff Table).
5. Đưa ra kết luận và khuyến nghị xử lý đối với các thay đổi trọng yếu.

## Tiêu chí kiểm tra:
- [ ] Không bỏ sót bất kỳ thay đổi ngữ nghĩa hoặc số liệu nào giữa 2 văn bản.
- [ ] Phân loại chính xác các loại thay đổi (Thêm / Bớt / Sửa).
- [ ] Đánh giá khách quan tác động của sự thay đổi.
- [ ] Bảng so sánh rõ ràng, dễ đối chiếu.

## Định dạng đầu ra:
```markdown
# BẢNG PHÂN TÍCH SO SÁNH HAI VĂN BẢN
- **Văn bản A (Gốc)**: [Tên file / Phiên bản A]
- **Văn bản B (Mới)**: [Tên file / Phiên bản B]

---

## 📊 Bảng Đối Chiếu Chi Tiết
| Vị trí / Điều khoản | Phiên bản A (Cũ) | Phiên bản B (Mới) | Loại thay đổi | Đánh giá tác động |
| :--- | :--- | :--- | :--- | :--- |
| Điều 1 | ... | ... | 🟡 Sửa đổi | Tăng thời hạn giao hàng |
| Điều 4.2 | *(Chưa có)* | ... | 🟢 Thêm mới | Bổ sung điều khoản bảo mật |
| Điều 7 | ... | *(Bị xóa)* | 🔴 Xóa bỏ | Mất cơ chế phạt vi phạm |

## ⚠️ Các Thay Đổi Trọng Yếu Cần Lưu Ý
1. **[Điểm thay đổi 1]**: [Phân tích chi tiết rủi ro hoặc lợi ích]
2. **[Điểm thay đổi 2]**: [Phân tích chi tiết]

## 💡 Đề Xuất Phản Hồi / Điều Chỉnh
- [Khuyến nghị chấp thuận / từ chối / yêu cầu đàm phán lại các điều khoản nào]
```
