# Checklist review thay đổi

## UI/UX & Claymorphism
- [ ] Mọi nút bấm (Button) đều có hiệu ứng thụt xuống (pressed shadow & translate-y) khi click.
- [ ] Các card và modal đều sử dụng bo góc lớn (`rounded-clay-lg` hoặc `rounded-clay`) và shadow kép mềm mại.
- [ ] Hộp nhập liệu (Input) ở trạng thái thụt lõm xuống mặc định để tạo cảm giác thực tế.
- [ ] Sử dụng đúng hệ phông chữ: Baloo 2 cho Headings/Số tiền và Nunito cho Body.
- [ ] Màu sắc hiển thị đúng bảng màu Pastel dịu mắt của Claymorphism, không dùng màu gốc thô (red-500, blue-600, v.v.).
- [ ] Các icon hiển thị là các nét vẽ mập mạp, nhiều màu sắc hoặc icon 3D blob đã quy chuẩn.

## Logic & TypeScript
- [ ] Không sử dụng kiểu `any` trong code mới viết.
- [ ] Kiểm tra lỗi biên dịch TypeScript không gặp bất kỳ cảnh báo nào.
- [ ] Form submit được ngăn chặn hành vi mặc định và được validate qua schema của Zod.
- [ ] Trạng thái gọi API có đầy đủ bộ đệm và tự động làm mới (React Query).

## Tương thích & Native Zalo
- [ ] Sử dụng đúng các component cấu trúc của ZMP UI (`Page`, `Header`).
- [ ] Code gọi các ZMP native API được bao bọc an toàn để tránh crash khi chạy thử trên Web browser thường.
