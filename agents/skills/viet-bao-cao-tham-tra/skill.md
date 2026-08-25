# Kỹ Năng: Viết Báo Cáo Thẩm Tra (Audit & Assessment Report Skill)

## 1. Tên kỹ năng
`viet-bao-cao-tham-tra` (Audit & Assessment Reporting)

## 2. Mục tiêu
Thực hiện thẩm tra, đánh giá độc lập về tính tuân thủ, hiệu quả vận hành, chất lượng kỹ thuật hoặc rủi ro pháp lý/tài chính, đồng thời đề xuất biện pháp khắc phục khả thi.

## 3. Khi nào sử dụng
- Khi thẩm tra hồ sơ dự án, báo cáo tài chính nội bộ, mã nguồn hoặc hợp đồng đối tác.
- Khi cần chuẩn bị báo cáo kiểm toán / thẩm tra định kỳ cho Hội đồng Quản trị hoặc Ban Giám đốc.

## 4. Dữ liệu đầu vào
- Hồ sơ, tài liệu, logs hoặc mã nguồn cần thẩm tra.
- Bộ tiêu chuẩn đối chiếu (Audit Standards / Checklists) từ `references/audit-standards.md`.

## 5. Quy trình thực hiện
1. **Thu thập bằng chứng**: Đối chiếu tài liệu với danh mục kiểm tra (Checklist).
2. **Phát hiện sai lệch & Rủi ro**: Phân loại mức độ rủi ro (Nghiêm trọng - Critical, Cao - High, Trung bình - Medium, Thấp - Low).
3. **Phân tích nguyên nhân gốc rễ (Root Cause Analysis)**: Xác định lý do dẫn đến sai lệch.
4. **Lập bảng kiến nghị khắc phục**: Đề xuất giải pháp, phân công người chịu trách nhiệm và thời hạn hoàn thành.
5. **Soạn thảo báo cáo**: Điền vào mẫu chuẩn tại `templates/report-template.md`.

## 6. Tiêu chuẩn đầu ra
- Bảng tổng hợp các điểm không phù hợp (Non-conformities) kèm trích dẫn điều khoản/file cụ thể.
- Đánh giá mức độ rủi ro khách quan theo ma trận xác suất - tác động.

## 7. Tình huống KHÔNG ĐƯỢC sử dụng
- Khi thiếu bằng chứng đối chiếu xác thực hoặc dữ liệu bị làm sai lệch.
- Khi chưa xác định rõ bộ quy chuẩn / tiêu chuẩn áp dụng để đối chiếu.

## 8. Ví dụ mẫu
Tham khảo file mẫu tại `examples/sample-audit-report.md`.
