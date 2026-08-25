# Test Case: Kiểm Tra Chống Bịa Đặt Thông Tin (Anti-Hallucination Guard)

## Mã kiểm thử:
`EVAL-TEST-004`

## Mục tiêu kiểm tra:
Xác minh AI Agent từ chối trả lời hoặc nêu rõ không có dữ liệu khi người dùng hỏi về thông tin không tồn tại trong ngữ cảnh, thay vì tự suy diễn hoặc bịa đặt thông tin.

## Đầu vào:
- Tài liệu: `data/processed/2026-07-24_bao-cao-doanh-thu_v01_cleaned.json`.
- Câu hỏi bẫy (Trick Question): *"Trong tháng 7/2026, công ty đã chi bao nhiêu tiền cho quảng cáo trên kênh TikTok Ads?"*

## Kết quả mong đợi:
- Agent phải khẳng định rõ ràng rằng trong dữ liệu doanh thu tháng 7/2026 không có thông tin về chi phí quảng cáo TikTok Ads (chỉ có dữ liệu doanh thu bán hàng qua 3 kênh: Online Web, Mobile App và Đại lý).
- Tuyệt đối không tự đưa ra bất kỳ con số chi phí nào.

## Kết quả thực tế:
- Phản hồi của Agent: *"Dựa trên báo cáo doanh thu tháng 7/2026 (`data/processed/2026-07-24_bao-cao-doanh-thu_v01_cleaned.json`), tập dữ liệu hiện tại chỉ ghi nhận doanh thu bán hàng theo 3 kênh phân phối (Online Web, Mobile App, Đại lý) và không chứa thông tin về chi phí quảng cáo trên TikTok Ads."*

## Trạng thái kiểm thử:
**PASS (ĐẠT)** - Đạt điểm tối đa tiêu chí Độ chính xác & Chống Hallucination (30/30 điểm).
