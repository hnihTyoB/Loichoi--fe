# Kỹ Năng: Phân Tích Hợp Đồng (Contract Analysis & Legal Review Skill)

## 1. Tên kỹ năng
`phan-tich-hop-dong` (Contract Analysis & Review)

## 2. Mục tiêu
Rà soát toàn diện các điều khoản trong hợp đồng kinh tế, biên bản ghi nhớ (MOU) hoặc thỏa thuận dịch vụ để phát hiện rủi ro pháp lý, bất cân xứng quyền lợi và đề xuất câu chữ sửa đổi (Redlines).

## 3. Khi nào sử dụng
- Khi nhận được dự thảo hợp đồng từ đối tác hoặc khách hàng trước khi ký kết.
- Khi cần rà soát lại các điều khoản cam kết mức dịch vụ (SLA) và bảo mật thông tin (NDA).

## 4. Dữ liệu đầu vào
- Nội dung văn bản hợp đồng (đã khử PII hoặc từ `data/processed/`).
- Tiêu chí rà soát pháp lý từ `references/legal-checklist.md`.

## 5. Quy trình thực hiện
1. **Kiểm tra thông tin các bên & Thẩm quyền**: Xác định rõ tư cách pháp nhân và đại diện ký kết.
2. **Rà soát các điều khoản trọng yếu**:
   - Đối tượng hợp đồng và phạm vi dịch vụ.
   - Giá trị, phương thức và tiến độ thanh toán.
   - Phạt vi phạm và mức giới hạn bồi thường thiệt hại.
   - Bảo mật thông tin, sở hữu trí tuệ (IP).
   - Điều kiện đơn phương chấm dứt hợp đồng và bất khả kháng.
   - Luật áp dụng và cơ quan giải quyết tranh chấp.
3. **Phân loại rủi ro & Soạn thảo đề xuất sửa đổi**: Sử dụng mẫu tại `templates/contract-template.md`.
4. **Tổng kết khuyến nghị đàm phán**.

## 6. Tiêu chuẩn đầu ra
- Bảng phân tích rủi ro chi tiết từng điều khoản.
- Câu chữ đề xuất thay thế cụ thể, rõ ràng, chặt chẽ về mặt pháp lý.

## 7. Tình huống KHÔNG ĐƯỢC sử dụng
- Khi hợp đồng thuộc các lĩnh vực đặc thù nghiêm ngặt (Hình sự, Tranh tụng tại tòa án quốc tế chuyên biệt) mà không có sự tham gia trực tiếp của luật sư được ủy quyền.
- Khi tài liệu bị che mất các trang quan trọng về nghĩa vụ và mức phạt.

## 8. Ví dụ mẫu
Tham khảo file mẫu tại `examples/sample-contract-analysis.md`.
