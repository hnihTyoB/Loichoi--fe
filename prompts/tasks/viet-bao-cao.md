# Task Prompt: Viết Báo Cáo Chuyên Nghiệp (Report Writing)

## Mục tiêu:
Tổng hợp dữ liệu, số liệu thống kê và thông tin thực tế để xây dựng một bản báo cáo phân tích toàn diện, chuyên nghiệp, hỗ trợ đắc lực cho công tác quản trị và ra quyết định.

## Dữ liệu đầu vào:
- **Dữ liệu thô / Dữ liệu đã làm sạch**: File Excel/CSV, JSON hoặc báo cáo kỳ trước từ `data/processed/`.
- **Kỳ báo cáo**: Tuần / Tháng / Quý / Năm hoặc Giai đoạn dự án cụ thể.
- **Yêu cầu đặc biệt**: Mục tiêu kinh doanh, KPI cần theo dõi, rủi ro cần làm rõ.

## Các bước thực hiện:
1. **Tổng hợp số liệu**: Tính toán các chỉ số KPI trọng yếu (Doanh thu, Chi phí, Lợi nhuận, Tỷ lệ hoàn thành, Tăng trưởng MoM/YoY).
2. **Phân tích nguyên nhân & Xu hướng**: Giải thích lý do biến động (vượt chỉ tiêu hoặc chưa đạt), phân tích các yếu tố thúc đẩy và rào cản.
3. **Đánh giá rủi ro & Thách thức**: Nêu các nguy cơ tiềm ẩn trong vận hành, tài chính hoặc thị trường.
4. **Xây dựng giải pháp & Kiến nghị**: Đề xuất kế hoạch hành động cụ thể cho kỳ tiếp theo kèm timeline và người phụ trách.
5. **Đóng gói báo cáo**: Định dạng rõ ràng, sử dụng bảng biểu, biểu đồ minh họa và highlight số liệu nổi bật.

## Tiêu chí kiểm tra:
- [ ] Số liệu tính toán chính xác 100%, không mâu thuẫn giữa các phần.
- [ ] Lập luận logic, các đề xuất giải pháp bám sát nguyên nhân gốc rễ.
- [ ] Cấu trúc chuẩn mực theo mẫu báo cáo doanh nghiệp.
- [ ] Trình bày rõ ràng, dễ đọc cho cấp quản lý trong vòng 3 phút.

## Định dạng đầu ra:
```markdown
# BÁO CÁO [TÊN BÁO CÁO / KỲ BÁO CÁO]
**Ngày lập**: YYYY-MM-DD | **Người thực hiện**: [Tên Agent / Bộ phận]

---

## I. Tổng Quan & Các Chỉ Số KPI Trọng Yếu
| Chỉ số (KPI) | Mục tiêu | Thực tế đạt được | Tỷ lệ hoàn thành | So với cùng kỳ |
| :--- | :--- | :--- | :--- | :--- |
| KPI 1 | ... | ... | ...% | +...% |
| KPI 2 | ... | ... | ...% | -...% |

## II. Phân Tích Chi Tiết Từng Hạng Mục
### 1. [Hạng mục A]
- **Hiện trạng**: [Mô tả chi tiết]
- **Nguyên nhân chính**: [Phân tích nguyên nhân]

### 2. [Hạng mục B]
- **Hiện trạng**: [Mô tả chi tiết]

## III. Đánh Giá Rủi Ro & Thách Thức
- ⚠️ **Rủi ro 1**: [Mô tả rủi ro và mức độ tác động]
- ⚠️ **Rủi ro 2**: [Mô tả rủi ro và mức độ tác động]

## IV. Kế Hoạch Hành Động & Kiến Nghị Kỳ Tới
1. **[Hành động 1]**: [Mục tiêu, Deadline, Phụ trách]
2. **[Hành động 2]**: [Mục tiêu, Deadline, Phụ trách]
```
