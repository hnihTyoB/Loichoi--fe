# Thư Mục `data/`: Quản Lý Dữ Liệu Đầu Vào

Thư mục `data/` chứa tất cả tài liệu, bảng tính, văn bản, hình ảnh hoặc dữ liệu mà AI cần đọc và xử lý.

```text
data/
├── raw/          # Dữ liệu gốc, chưa chỉnh sửa
└── processed/    # Dữ liệu đã được làm sạch và chuẩn hóa
```

---

## 1. `raw/` - Dữ Liệu Gốc (Bất Biến)

Chứa dữ liệu gốc do người dùng, khách hàng cung cấp hoặc xuất trực tiếp từ hệ thống:
- File PDF tài liệu, hợp đồng, hồ sơ thầu.
- Biên bản cuộc họp, ghi âm thô.
- File Excel, CSV xuất từ ERP/CRM/Core DB.
- Tài liệu quy phạm pháp luật, chính sách.
- Nội dung khảo sát người dùng.

> [!IMPORTANT]
> **NGUYÊN TẮC BẤT KHẢ XÂM PHẠM**: Tuyệt đối **KHÔNG CHỈNH SỬA TRỰC TIẾP** dữ liệu trong thư mục `raw/`. Việc giữ nguyên vẹn dữ liệu gốc giúp đối chiếu, kiểm chứng nguồn tin khi phát sinh sai sót hoặc khi cần chạy lại pipeline.

---

## 2. `processed/` - Dữ Liệu Đã Chuẩn Hóa & Làm Sạch

Chứa dữ liệu đã qua các bước tiền xử lý để AI sẵn sàng tiêu thụ:
- PDF/Word đã được bóc tách thành văn bản thuần (Plain Text / Markdown).
- Bảng tính Excel đã loại bỏ các dòng trùng lặp, xử lý giá trị null, định dạng lại kiểu số và ngày tháng.
- Dữ liệu đã được che mờ / ẩn thông tin cá nhân nhạy cảm (PII Redacted).
- Tài liệu lớn đã được phân đoạn nhỏ (Chunking & Embedding ready) để nạp vào hệ thống RAG (Retrieval-Augmented Generation).
- File ghi âm đã được chuyển thành transcript hoàn chỉnh kèm timestamp.

---

## 3. Quy Trình Xử Lý Dữ Liệu (Data Pipeline)

$$\text{Dữ liệu gốc (raw)} \longrightarrow \text{Làm sạch (Clean)} \longrightarrow \text{Chuẩn hóa (Standardize)} \longrightarrow \text{AI xử lý (Inference)}$$

---

## 4. Quy Tắc Đặt Tên File Thống Nhất

Tất cả các file trong thư mục `data/` (cả `raw/` và `processed/`) bắt buộc tuân theo quy tắc:

```text
YYYY-MM-DD_ten-tai-lieu_phien-ban.dinh-dang
```

**Ví dụ chuẩn:**
- `2026-07-24_bao-cao-doanh-thu_v01.csv`
- `2026-07-24_bao-cao-doanh-thu_v01_cleaned.json`
- `2026-08-01_bien-ban-cuoc-hop_v01.md`
- `2026-08-01_bien-ban-cuoc-hop_v01_transcript.md`
- `2026-08-15_tai-lieu-khao-sat_v01.json`
- `2026-08-15_tai-lieu-khao-sat_v01_rag-chunks.json`
