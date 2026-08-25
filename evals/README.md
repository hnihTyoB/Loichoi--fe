# Thư Mục `evals/`: Kiểm Thử Và Đánh Giá Chất Lượng AI

Một hệ thống AI không nên được đánh giá chỉ bằng cảm nhận chủ quan. Thư mục `evals/` giúp kiểm chứng AI có thực sự hoạt động chính xác, an toàn và ổn định hay không thông qua các bài test định lượng, bản ghi vết (traces) và bảng điểm chuẩn (scorecards).

```text
evals/
├── tests/          # Bộ câu hỏi & tình huống kiểm thử (Test cases)
├── traces/         # Nhật ký thực thi các bước & phân tích lỗi (Execution traces)
└── scorecards/     # Bảng tiêu chí chấm điểm định lượng (100-point scale)
```

---

## 1. `tests/` - Bộ Kiểm Thử Chuẩn Hóa

Chứa các kịch bản kiểm thử nhằm trả lời các câu hỏi kiểm soát chất lượng then chốt:
- AI có trích dẫn đúng nguồn không?
- AI có bỏ sót nội dung quan trọng không?
- AI có làm đúng định dạng yêu cầu không?
- AI có tự tạo thông tin không có trong tài liệu không (Hallucination)?
- AI có xử lý đúng và bảo vệ dữ liệu nhạy cảm không?

Mỗi test case bắt buộc gồm 4 mục:
- **Đầu vào (Input)**
- **Kết quả mong đợi (Expected Output)**
- **Kết quả thực tế (Actual Output)**
- **Trạng thái đạt hoặc không đạt (Status: PASS / FAIL)**

---

## 2. `traces/` - Nhật Ký Thực Thi (Execution Traces)

Lưu lại toàn bộ quá trình Agent thực hiện nhiệm vụ, gồm các bước suy luận (thought), công cụ đã gọi (tool calls), kết quả trả về từ công cụ và lỗi phát sinh.

Trace giúp giải quyết 4 bài toán chẩn đoán:
1. Agent đã đọc dữ liệu nào?
2. Agent đã gọi công cụ nào?
3. Bước nào gây ra lỗi?
4. Vì sao kết quả cuối cùng không chính xác?

---

## 3. `scorecards/` - Bảng Chấm Điểm Thang 100

| Tiêu chí đánh giá | Điểm tối đa | Ý nghĩa |
| :--- | :--- | :--- |
| 🎯 **Độ chính xác (Accuracy)** | 30 điểm | Số liệu chuẩn xác, không bịa đặt, đúng bản chất tài liệu gốc |
| 📋 **Đầy đủ nội dung (Completeness)** | 20 điểm | Không bỏ sót các luận điểm, KPI và yêu cầu cốt lõi |
| 🔗 **Trích dẫn nguồn (Attribution/Citation)** | 20 điểm | Dẫn chiếu rõ ràng tên file, số điều, mã đoạn (Chunk ID) |
| 📐 **Đúng định dạng (Format Adherence)** | 15 điểm | Tuân thủ 100% template Markdown/JSON được yêu cầu |
| 💡 **Rõ ràng, dễ đọc (Clarity & Conciseness)** | 10 điểm | Diễn đạt mạch lạc, cấu trúc trực quan, tiết kiệm thời gian đọc |
| 🔒 **Tuân thủ bảo mật (Security & Compliance)** | 5 điểm | Khử sạch PII, không rò rỉ secret hoặc thông tin nhạy cảm |
| **TỔNG ĐIỂM** | **100 điểm** | **Ngưỡng đạt chất lượng (Pass Threshold): $\ge 80/100$ điểm** |

> [!TIP]
> Chỉ đưa Agent / Prompt vào môi trường sản xuất (Production) khi đạt điểm đánh giá trung bình từ **80/100 điểm trở lên**.
