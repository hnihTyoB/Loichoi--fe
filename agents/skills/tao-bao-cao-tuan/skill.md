# Kỹ Năng: Tạo Báo Cáo Tuần (Weekly Report Generation Skill)

## 1. Tên kỹ năng
`tao-bao-cao-tuan` (Weekly Progress & KPI Report Generation)

## 2. Mục tiêu
Tự động tổng hợp dữ liệu hoạt động trong tuần, so sánh tiến độ thực tế với mục tiêu KPI đã cam kết, làm nổi bật các điểm nghẽn và lập kế hoạch cho tuần tiếp theo.

## 3. Khi nào sử dụng
- Định kỳ vào cuối mỗi tuần làm việc (thứ Sáu / thứ Bảy).
- Khi chuẩn bị tài liệu cho cuộc họp giao ban đầu tuần của ban lãnh đạo.

## 4. Dữ liệu đầu vào
- Báo cáo công việc của các cá nhân/nhóm, file theo dõi tiến độ Task/Ticket (Jira/Trello/Git).
- Số liệu doanh thu, chi phí, số lượng ticket hỗ trợ hoặc tiến độ phát hành tính năng từ `data/processed/`.

## 5. Quy trình thực hiện
1. **Tổng hợp dữ liệu**: Thu thập số liệu hoàn thành trong tuần từ thứ Hai đến thứ Sáu.
2. **Đối chiếu KPI**: So sánh số liệu thực tế với kế hoạch (Target vs Actual) theo định nghĩa tại `references/kpi-definitions.md`.
3. **Phân tích kết quả theo mô hình PPP (Progress - Problems - Plans)**:
   - **Progress (Tiến độ)**: Các việc đã hoàn thành.
   - **Problems (Vấn đề / Điểm nghẽn)**: Các trở ngại phát sinh cần hỗ trợ.
   - **Plans (Kế hoạch)**: Mục tiêu và hành động trong tuần tới.
4. **Điền mẫu chuẩn**: Xuất báo cáo theo cấu trúc tại `templates/weekly-template.md`.

## 6. Tiêu chuẩn đầu ra
- Bảng số liệu KPI trực quan, có tỷ lệ % hoàn thành và xu hướng so với tuần trước.
- Các vấn đề tồn đọng có nêu rõ người chịu trách nhiệm và đề xuất giải pháp.

## 7. Tình huống KHÔNG ĐƯỢC sử dụng
- Khi dữ liệu tuần bị thiếu quá 50% số ngày hoặc không có số liệu kiểm chứng.
- Khi người dùng yêu cầu báo cáo tài chính kiểm toán năm (cần chuyển sang skill chuyên sâu khác).

## 8. Ví dụ mẫu
Tham khảo file mẫu tại `examples/sample-weekly-report.md`.
