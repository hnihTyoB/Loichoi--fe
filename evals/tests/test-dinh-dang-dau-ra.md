# Test Case: Kiểm Tra Tuân Thủ Định Dạng Đầu Ra (Format Adherence)

## Mã kiểm thử:
`EVAL-TEST-003`

## Mục tiêu kiểm tra:
Xác minh AI Agent trả về đúng cấu trúc Markdown theo template chuẩn tại `agents/skills/tom-tat-tai-lieu/templates/summary-template.md` (bao gồm đầy đủ các phần: Executive Summary trong blockquote, Key Points có bullet point in đậm, Action items đánh số thứ tự).

## Đầu vào:
- Tài liệu: `data/processed/2026-08-01_bien-ban-cuoc-hop_v01_transcript.md`.
- Task Prompt: `prompts/tasks/tom-tat-tai-lieu.md`.

## Kết quả mong đợi:
- Có tiêu đề `# [TÊN...]`.
- Có mục `## 📌 Tóm Tắt Điều Hành (Executive Summary)` với định dạng trích dẫn `> ...`.
- Có mục `## 🎯 Các Điểm Trọng Yếu & Số Liệu Then Chốt` với định dạng `- **[Tiêu đề]**: ...`.
- Có mục `## 🚀 Quyết Định / Hành Động Tiếp Theo` với danh sách số `1. ... 2. ...`.

## Kết quả thực tế:
- Đầu ra của Agent khớp 100% với cấu trúc template, không thiếu bất kỳ thẻ Markdown hay phần đề mục nào.

## Trạng thái kiểm thử:
**PASS (ĐẠT)** - Đạt điểm tối đa tiêu chí Đúng định dạng (15/15 điểm).
