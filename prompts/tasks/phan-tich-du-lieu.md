# Task Prompt: Phân Tích Dữ Liệu Chuyên Sâu (Data Analysis & Insights)

## Mục tiêu:
Xử lý, khám phá và phân tích tập dữ liệu đầu vào để phát hiện các quy luật, xu hướng, phân khúc khách hàng, bất thường (anomalies) và đưa ra các đề xuất hành động dựa trên dữ liệu (Data-Driven Decisions).

## Dữ liệu đầu vào:
- **Tập dữ liệu**: File CSV, JSON, Excel hoặc kết quả truy vấn SQL từ `data/processed/`.
- **Mục tiêu phân tích**: Phân tích doanh thu, hành vi người dùng, tối ưu chi phí, dự báo xu hướng.
- **Biến số quan tâm**: Thời gian, Phân khúc sản phẩm, Vùng địa lý, Kênh bán hàng.

## Các bước thực hiện:
1. **Kiểm tra chất lượng dữ liệu**: Đánh giá số lượng dòng, cột, giá trị rỗng (null/missing), ngoại lai (outliers) hoặc trùng lặp.
2. **Thống kê mô tả (Descriptive Statistics)**: Tính tổng (Sum), Trung bình (Mean), Trung vị (Median), Độ lệch chuẩn, Min, Max.
3. **Phân tích nhóm & Tương quan (Segmentation & Correlation)**: Nhóm dữ liệu theo các chiều (Group By Category, Time, Channel) để nhận diện mô hình xu hướng.
4. **Phát hiện điểm bất thường & Đột biến**: Xác định các giao dịch hoặc thời điểm có biến động lớn bất thường.
5. **Tổng hợp phát hiện & Khuyến nghị chiến lược**: Biến đổi các con số khô khan thành thông điệp quản trị có giá trị thực tiễn.

## Tiêu chí kiểm tra:
- [ ] Tính toán toán học chính xác 100%.
- [ ] Minh họa dữ liệu bằng bảng và biểu đồ cấu trúc rõ ràng.
- [ ] Phát hiện được ít nhất 3 phát hiện chiến lược từ tập dữ liệu.
- [ ] Đề xuất hành động có tính khả thi và đo lường được.

## Định dạng đầu ra:
```markdown
# BÁO CÁO PHÂN TÍCH DỮ LIỆU: [TÊN CHỦ ĐỀ]

## 1. Tổng Quan Tập Dữ Liệu
- **Quy mô**: [Số lượng bản ghi / Dòng x Cột]
- **Thời gian phân tích**: [Khoảng thời gian]
- **Chất lượng dữ liệu**: [Độ sạch, tỷ lệ đầy đủ: 99.8%...]

## 2. Các Chỉ Số Thống Kê Cốt Lõi
| Chỉ số đo lường | Tổng cộng | Trung bình | Cao nhất | Thấp nhất |
| :--- | :--- | :--- | :--- | :--- |
| Doanh thu | ... | ... | ... | ... |
| Số lượng đơn hàng | ... | ... | ... | ... |

## 3. Các Phát Hiện Trọng Yếu (Key Insights)
- 📈 **Xu hướng tăng trưởng**: [Mô tả chi tiết xu hướng qua các mốc thời gian]
- 🏆 **Phân khúc dẫn đầu**: [Top 20% sản phẩm/kênh tạo ra 80% giá trị]
- ⚠️ **Điểm nghẽn / Bất thường**: [Phân tích thời điểm sụt giảm hoặc chi phí tăng cao]

## 4. Khuyến Nghị Hành Động (Data-driven Recommendations)
1. [Khuyến nghị 1 - Tác động dự kiến: +15% doanh thu]
2. [Khuyến nghị 2 - Tác động dự kiến: Giảm 10% chi phí]
```
